const prisma = require("../lib/prisma");

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
  } = data;

  if (!title || !description || budget === undefined) {
    throw new Error(
      "Title, description, and budget are required."
    );
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

  const where = {
    status: "OPEN",

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

  if (data.skillIds !== undefined) {
    if (!Array.isArray(data.skillIds)) {
      throw new Error("skillIds must be an array.");
    }

    const skills = await prisma.skill.findMany({
      where: {
        id: {
          in: data.skillIds,
        },
      },
    });

    if (skills.length !== data.skillIds.length) {
      throw new Error("One or more skill IDs are invalid.");
    }

    await prisma.gigSkill.deleteMany({
      where: {
        gigId,
      },
    });

    await prisma.gigSkill.createMany({
      data: data.skillIds.map((skillId) => ({
        gigId,
        skillId,
      })),

      skipDuplicates: true,
    });
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
};