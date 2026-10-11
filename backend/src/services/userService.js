const prisma = require("../lib/prisma");

async function getMyProfile(userId) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,
      name: true,
      email: true,
      bio: true,

      university: true,
      stream: true,
      year: true,
      city: true,

      createdAt: true,

      skills: {
        include: {
          skill: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  const postedGigs = await prisma.gig.count({
    where: {
      postedById: userId,
    },
  });

  const completedGigs = await prisma.gig.count({
    where: {
      postedById: userId,
      status: "COMPLETED",
    },
  });

  const ratingStats = await prisma.rating.aggregate({
    where: {
      ratedId: userId,
    },

    _avg: {
      score: true,
    },

    _count: {
      _all: true,
    },
  });

  const recentGigs = await prisma.gig.findMany({
    where: {
      postedById: userId,
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 3,

    select: {
      id: true,
      title: true,
      budget: true,
      status: true,
      createdAt: true,
    },
  });

  const reviews = await prisma.rating.findMany({
    where: {
      ratedId: userId,
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 3,

    select: {
      id: true,
      score: true,
      review: true,
      createdAt: true,

      rater: {
        select: {
          name: true,
        },
      },
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    bio: user.bio,

    university: user.university,
    stream: user.stream,
    year: user.year,
    city: user.city,

    createdAt: user.createdAt,

    skills: user.skills.map(
      (userSkill) => userSkill.skill
    ),

    stats: {
      postedGigs,
      completedGigs,
      rating: ratingStats._avg.score,
      reviewCount: ratingStats._count._all,
    },

    recentGigs,

    reviews: reviews.map((review) => ({
      id: review.id,
      score: review.score,
      review: review.review,
      createdAt: review.createdAt,
      raterName: review.rater.name,
    })),
  };
}

async function updateMyProfile(userId, data) {
  const updateData = {};

  if (data.name !== undefined) {
    updateData.name = data.name;
  }

  if (data.bio !== undefined) {
    updateData.bio = data.bio;
  }

  if (data.stream !== undefined) {
    updateData.stream = data.stream;
  }

  if (data.year !== undefined) {
    updateData.year = data.year;
  }

  if (data.city !== undefined) {
    updateData.city = data.city;
  }

  const user = await prisma.user.update({
    where: {
      id: userId,
    },

    data: updateData,

    select: {
      id: true,
      name: true,
      email: true,
      bio: true,

      university: true,
      stream: true,
      year: true,
      city: true,
    },
  });

  return user;
}

async function getPublicProfile(userId) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,
      name: true,
      bio: true,

      university: true,
      stream: true,
      year: true,
      city: true,

      skills: {
        include: {
          skill: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  return {
    id: user.id,
    name: user.name,
    bio: user.bio,

    university: user.university,
    stream: user.stream,
    year: user.year,
    city: user.city,

    skills: user.skills.map(
      (userSkill) => userSkill.skill
    ),
  };
}

async function addSkills(userId, skillIds) {
    if (!Array.isArray(skillIds)) {
        throw new Error("skillIds must be an array.");
    }

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

    await prisma.userSkill.deleteMany({
        where: {
            userId,
            skillId: {
                notIn: skillIds,
            },
        },
    });

    await prisma.userSkill.createMany({
        data: skillIds.map((skillId) => ({
            userId,
            skillId,
        })),
        skipDuplicates: true,
    });

    const userSkills = await prisma.userSkill.findMany({
        where: {
            userId,
        },
        include: {
            skill: true,
        },
    });

    return userSkills.map(
        (userSkill) => userSkill.skill
    );
}

module.exports = {
  getMyProfile,
  updateMyProfile,
  getPublicProfile,
  addSkills,
};