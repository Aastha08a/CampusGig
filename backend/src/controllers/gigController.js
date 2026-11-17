const {
  createGig,
  getGigById,
  updateGig,
  deleteGig,
  getMyGigs,
  getAllGigs,
} = require("../services/gigService");

async function createGigController(req, res) {
  try {
    const gig = await createGig(req.user.userId, req.body);

    res.status(201).json(gig);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

async function getGig(req, res) {
  try {
    const gig = await getGigById(req.params.id);

    res.status(200).json(gig);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
}

async function updateGigController(req, res) {
  try {
    const gig = await updateGig(
      req.params.id,
      req.user.userId,
      req.body
    );

    res.status(200).json(gig);
  } catch (error) {
    res.status(error.statusCode || 400).json({
      message: error.message,
    });
  }
}

async function deleteGigController(req, res) {
  try {
    const gig = await deleteGig(
      req.params.id,
      req.user.userId
    );

    res.status(200).json(gig);
  } catch (error) {
    res.status(error.statusCode || 400).json({
      message: error.message,
    });
  }
}

async function getMyGigsController(req, res) {
  try {
    const gigs = await getMyGigs(req.user.userId);

    res.status(200).json(gigs);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

async function getAllGigsController(req, res) {
  try {
    const gigs = await getAllGigs(
      req.query,
      req.user.userId
    );

    res.status(200).json(gigs);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

module.exports = {
  createGigController,
  getGig,
  updateGigController,
  deleteGigController,
  getMyGigsController,
  getAllGigsController,
};