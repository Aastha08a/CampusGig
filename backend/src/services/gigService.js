const prisma = require("../lib/prisma");

function validateDueDate(dueDate) {
  if (!dueDate) return;

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const today = `${parts.find(p => p.type === "year").value}-${parts.find(p => p.type === "month").value}-${parts.find(p => p.type === "day").value}`;

  const selectedDate = String(dueDate).slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(selectedDate) ||
      selectedDate < today) {
    throw new Error(
      "Application deadline cannot be in the past."
    );
  }
}

async function createGig(userId, data) {
  const {
    title,
    description,
    budget,
    category,
    dueDate,
    workMode,
    whatYoullDo,
    duration,
    skillIds,
    spots = 1,
  } = data;

  if (!title || !description || budget === undefined) {
    throw new Error(
      "Title, description, and budget are required."
    );
  }

  if (!Number.isInteger(Number(spots)) ||
    Number(spots) < 1) {
    throw new Error("Spots must be a positive integer.");
  }

  if (skillIds !== undefined && !Array.isArray(skillIds)) {
    throw new Error("skillIds must be an array.");
  }

  if (skillIds && skillIds.length > 0) {
    const skills = await prisma.skill.findMany({
      where: {
        id: {
          in: skillIds,
        },
      },
    });

    if (skills.length !== skillIds.length) {
      throw new Error("One or more skill IDs are invalid.");
    }
  }

  validateDueDate(dueDate);

  const gig = await prisma.gig.create({
    data: {
      title,
      description,
      budget: Number(budget),

      category: category || null,

      dueDate: dueDate
        ? new Date(dueDate)
        : null,

      workMode: workMode || null,
      whatYoullDo: whatYoullDo || null,
      duration: duration || null,

      postedById: userId,

      skills: {
        create:
          skillIds?.map((skillId) => ({
            skill: {
              connect: {
                id: skillId,
              },
            },
          })) || [],
      },
      spots: Number(spots),
    },

    include: {
      skills: {
        include: {
          skill: true,
        },
      },
    },
  });

  return gig;
}


async function getGigById(gigId) {
  const gig = await prisma.gig.findUnique({
    where: {
      id: gigId,
    },

    include: {
      skills: {
        include: {
          skill: true,
        },
      },

      postedBy: {
        select: {
          id: true,
          name: true,
          university: true,
        },
      },

      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  if (!gig) {
    throw new Error("Gig not found.");
  }

  return gig;
}


async function getMyGigs(userId) {
  const gigs = await prisma.gig.findMany({
    where: {
      postedById: userId,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      skills: {
        include: {
          skill: true,
        },
      },

      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  return gigs;
}


async function getAllGigs(filters = {}, currentUserId) {
  const {
    category,
    skill,
    minPay,
    maxPay,
    workMode,
    q,
    sort = "latest",
  } = filters;

  // Get today's date in IST.
  const istParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const dateParts = Object.fromEntries(
    istParts.map(({ type, value }) => [type, value])
  );

  // Gig dueDate is stored as UTC midnight for its selected calendar date.
  const todayInIST = new Date(
    Date.UTC(
      Number(dateParts.year),
      Number(dateParts.month) - 1,
      Number(dateParts.day)
    )
  );

  const where = {
    status: "OPEN",

    AND: [
      {
        OR: [
          { dueDate: null },
          { dueDate: { gte: todayInIST } },
        ],
      },
    ],

    ...(currentUserId && {
      postedById: {
        not: currentUserId,
      },
    }),
  };

  // Category filter
  if (category) {
    where.category = category.toUpperCase();
  }

  // Work mode filter
  if (workMode) {
    where.workMode = workMode.toUpperCase();
  }

  // Pay range filter
  if (minPay !== undefined || maxPay !== undefined) {
    where.budget = {};

    if (minPay !== undefined && minPay !== "") {
      where.budget.gte = Number(minPay);
    }

    if (maxPay !== undefined && maxPay !== "") {
      where.budget.lte = Number(maxPay);
    }
  }

  // Skill filter
  if (skill) {
    where.skills = {
      some: {
        skill: {
          name: {
            equals: skill,
            mode: "insensitive",
          },
        },
      },
    };
  }

  // Keyword search
  if (q) {
    where.OR = [
      {
        title: {
          contains: q,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: q,
          mode: "insensitive",
        },
      },
    ];
  }

let orderBy = {
    createdAt: "desc",
};

if (sort === "highestPay") {
    orderBy = {
        budget: "desc",
    };
}

if (sort === "deadlineSoon") {
    orderBy = {
        dueDate: "asc",
    };
}

if (sort === "relevant") {
    orderBy = {
        applications: {
            _count: "desc",
        },
    };
}

const gigs = await prisma.gig.findMany({
    where,

    orderBy,

    include: {
        skills: {
            include: {
                skill: true,
            },
        },

        postedBy: {
            select: {
                id: true,
                name: true,
                university: true,
            },
        },

        _count: {
            select: {
                applications: true,
            },
        },
    },
  });

  return gigs;
}


async function updateGig(gigId, userId, data) {
  const gig = await prisma.gig.findUnique({
    where: {
      id: gigId,
    },
  });

  if (!gig) {
    throw new Error("Gig not found.");
  }

  if (gig.postedById !== userId) {
    const error = new Error(
      "You are not allowed to edit this gig."
    );

    error.statusCode = 403;

    throw error;
  }

  const updateData = {};

  if (data.title !== undefined) {
    updateData.title = data.title;
  }

  if (data.description !== undefined) {
    updateData.description = data.description;
  }

  if (data.budget !== undefined) {
    updateData.budget = Number(data.budget);
  }

  if (data.category !== undefined) {
    updateData.category = data.category || null;
  }

  if (data.dueDate !== undefined) {
    validateDueDate(data.dueDate);

    updateData.dueDate = data.dueDate
      ? new Date(data.dueDate)
      : null;
  }

  if (data.workMode !== undefined) {
    updateData.workMode = data.workMode || null;
  }

  if (data.whatYoullDo !== undefined) {
    updateData.whatYoullDo = data.whatYoullDo || null;
  }

  if (data.duration !== undefined) {
    updateData.duration = data.duration || null;
  }

  if (data.status !== undefined) {
    updateData.status = data.status;
  }

  if (data.spots !== undefined) {
    if (
      !Number.isInteger(Number(data.spots)) ||
      Number(data.spots) < 1
    ) {
      throw new Error("Spots must be a positive integer.");
    }

    updateData.spots = Number(data.spots);
  }

  const updatedGig = await prisma.gig.update({
    where: {
      id: gigId,
    },

    data: updateData,

    include: {
      skills: {
        include: {
          skill: true,
        },
      },

      _count: {
        select: {
          applications: true,
        },
      },
    },
  });

  return updatedGig;
}


async function completeGig(gigId, userId) {
  const gig = await prisma.gig.findUnique({
    where: { id: gigId },
    include: {
      applications: {
        where: {
          applicantId: userId,
          status: "ACCEPTED",
        },
        select: { id: true },
      },
    },
  });

  if (!gig) {
    const error = new Error("Gig not found.");
    error.statusCode = 404;
    throw error;
  }

  const isCreator = gig.postedById === userId;
  const isAcceptedApplicant = gig.applications.length > 0;

  if (!isCreator && !isAcceptedApplicant) {
    const error = new Error(
      "Only the gig creator or an accepted applicant can complete this gig."
    );
    error.statusCode = 403;
    throw error;
  }

  if (gig.status !== "IN_PROGRESS") {
    const error = new Error(
      "Only gigs in progress can be marked as complete."
    );
    error.statusCode = 400;
    throw error;
  }

  return prisma.gig.update({
    where: { id: gigId },
    data: { status: "COMPLETED" },
    include: {
      skills: { include: { skill: true } },
      postedBy: {
        select: {
          id: true,
          name: true,
          university: true,
        },
      },
      _count: { select: { applications: true } },
    },
  });
}


async function deleteGig(gigId, userId) {
  const gig = await prisma.gig.findUnique({
    where: {
      id: gigId,
    },
  });

  if (!gig) {
    throw new Error("Gig not found.");
  }

  if (gig.postedById !== userId) {
    const error = new Error(
      "You are not allowed to delete this gig."
    );

    error.statusCode = 403;

    throw error;
  }

  const cancelledGig = await prisma.gig.update({
    where: {
      id: gigId,
    },

    data: {
      status: "CANCELLED",
    },
  });

  return cancelledGig;
}


module.exports = {
  createGig,
  getGigById,
  getMyGigs,
  getAllGigs,
  updateGig,
  deleteGig,
  completeGig,
};