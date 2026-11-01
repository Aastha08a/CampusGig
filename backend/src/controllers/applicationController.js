const {
  createApplication,
  getMyApplications,
  getGigApplications,
  updateApplicationStatus,
  withdrawApplication,
} = require("../services/applicationService");


async function createApplicationController(req, res) {
  try {
    const application = await createApplication(
      req.params.id,
      req.user.userId,
      req.body.pitchMessage
    );

    res.status(201).json(application);
  } catch (error) {
    res.status(error.statusCode || 400).json({
      message: error.message,
    });
  }
}


async function getMyApplicationsController(req, res) {
  try {
    const applications = await getMyApplications(
      req.user.userId
    );

    res.status(200).json(applications);
  } catch (error) {
    res.status(error.statusCode || 400).json({
      message: error.message,
    });
  }
}

async function updateApplicationStatusController(req, res) {
  try {
    const application = await updateApplicationStatus(
      req.params.id,
      req.user.userId,
      req.body.status
    );

    res.status(200).json(application);
  } catch (error) {
    res.status(error.statusCode || 400).json({
      message: error.message,
    });
  }
}

async function getGigApplicationsController(req, res) {
  try {
    const result = await getGigApplications(
      req.params.id,
      req.user.userId
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 400).json({
      message: error.message,
    });
  }
}

async function withdrawApplicationController(req, res) {
  try {
    const result = await withdrawApplication(
      req.params.id,
      req.user.userId
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 400).json({
      message: error.message,
    });
  }
}


module.exports = {
  createApplicationController,
  getMyApplicationsController,
  withdrawApplicationController,
  getGigApplicationsController,
  updateApplicationStatusController,
};