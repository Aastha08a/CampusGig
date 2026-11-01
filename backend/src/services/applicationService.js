const prisma = require("../lib/prisma");

async function createApplication(gigId, applicantId, pitchMessage) {
  if (!pitchMessage || !pitchMessage.trim()) {
    throw new Error("Pitch message is required.");
  }

  const gig = await prisma.gig.findUnique({
    where: {
      id: gigId,
    },
  });

  if (!gig) {
    throw new Error("Gig not found.");
  }

  if (gig.status !== "OPEN") {
    throw new Error("This gig is no longer open for applications.");
  }

  if (gig.postedById === applicantId) {
    const error = new Error(
      "You cannot apply to your own gig."
    );

    error.statusCode = 400;

    throw error;
  }

  const existingApplication = await prisma.application.findUnique({
    where: {
      applicantId_gigId: {
        applicantId,
        gigId,
      },
    },
  });

  if (existingApplication) {
    const error = new Error(
      "You have already applied to this gig."
    );

    error.statusCode = 409;

    throw error;
  }

  const application = await prisma.application.create({
    data: {
      message: pitchMessage.trim(),
      applicantId,
      gigId,
    },

    include: {
      gig: {
        select: {
          id: true,
          title: true,
          budget: true,
          status: true,
        },
      },
    },
  });

  return application;
}


async function getMyApplications(userId) {
  const applications = await prisma.application.findMany({
    where: {
      applicantId: userId,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      gig: {
        select: {
          id: true,
          title: true,
          description: true,
          budget: true,
          category: true,
          workMode: true,
          dueDate: true,
          status: true,

          postedBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return applications;
}

async function getGigApplications(gigId, userId) {
  const gig = await prisma.gig.findUnique({
    where: {
      id: gigId,
    },
    select: {
      id: true,
      title: true,
      spots: true,
      postedById: true,
    },
  });

  if (!gig) {
    const error = new Error("Gig not found.");
    error.statusCode = 404;
    throw error;
  }

  // Only the creator can view applicants for this gig.
  if (gig.postedById !== userId) {
    const error = new Error(
      "You are not allowed to view applicants for this gig."
    );
    error.statusCode = 403;
    throw error;
  }

  const applications = await prisma.application.findMany({
    where: {
      gigId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      applicant: {
        select: {
          id: true,
          name: true,
          bio: true,
          university: true,
          skills: {
            include: {
              skill: true,
            },
          },
          receivedRatings: true,
        },
      },
    },
  });

  return {
    gig,
    applications,
  };
}

async function updateApplicationStatus(applicationId, userId, status) {
  if (!["ACCEPTED", "REJECTED"].includes(status)) {
    const error = new Error("Invalid application status.");
    error.statusCode = 400;
    throw error;
  }

  return prisma.$transaction(async (tx) => {
    const application = await tx.application.findUnique({
      where: {
        id: applicationId,
      },
      include: {
        gig: true,
      },
    });

    if (!application) {
      const error = new Error("Application not found.");
      error.statusCode = 404;
      throw error;
    }

    const gig = application.gig;

    if (gig.postedById !== userId) {
      const error = new Error(
        "You are not allowed to manage applications for this gig."
      );
      error.statusCode = 403;
      throw error;
    }

    if (["COMPLETED", "CANCELLED"].includes(gig.status)) {
      const error = new Error(
        "Applications cannot be changed for completed or cancelled gigs."
      );
      error.statusCode = 400;
      throw error;
    }

    if (application.status !== "PENDING") {
      const error = new Error(
        "Only pending applications can be updated."
      );
      error.statusCode = 400;
      throw error;
    }

    if (status === "ACCEPTED") {
      const acceptedCount = await tx.application.count({
        where: {
          gigId: gig.id,
          status: "ACCEPTED",
        },
      });

      if (acceptedCount >= gig.spots) {
        const error = new Error(
          "All positions for this gig are already filled."
        );
        error.statusCode = 400;
        throw error;
      }
    }

    const updatedApplication = await tx.application.update({
      where: {
        id: applicationId,
      },
      data: {
        status,
      },
    });

    if (status === "ACCEPTED") {
      const acceptedCount = await tx.application.count({
        where: {
          gigId: gig.id,
          status: "ACCEPTED",
        },
      });

      if (acceptedCount >= gig.spots) {
        await tx.gig.update({
          where: {
            id: gig.id,
          },
          data: {
            status: "IN_PROGRESS",
          },
        });

        await tx.application.updateMany({
          where: {
            gigId: gig.id,
            status: "PENDING",
          },
          data: {
            status: "REJECTED",
          },
        });
      }
    }

    return updatedApplication;
  });
}

async function withdrawApplication(applicationId, userId) {
  const application = await prisma.application.findUnique({
    where: {
      id: applicationId,
    },
  });

  if (!application) {
    throw new Error("Application not found.");
  }

  if (application.applicantId !== userId) {
    const error = new Error(
      "You are not allowed to withdraw this application."
    );

    error.statusCode = 403;

    throw error;
  }

  if (application.status !== "PENDING") {
    const error = new Error(
      "Only pending applications can be withdrawn."
    );

    error.statusCode = 400;

    throw error;
  }

  await prisma.application.delete({
    where: {
      id: applicationId,
    },
  });

  return {
    message: "Application withdrawn successfully.",
  };
}




module.exports = {
  createApplication,
  getMyApplications,
  withdrawApplication,
  getGigApplications,
  updateApplicationStatus,
};