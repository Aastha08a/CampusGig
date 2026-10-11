const {
  createApplication,
  getMyApplications,
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
};