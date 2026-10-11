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
};