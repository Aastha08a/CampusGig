const {
  getMyProfile,
  updateMyProfile,
  getPublicProfile,
  addSkills,
} = require("../services/userService");

async function getMe(req, res) {
  try {
    const user = await getMyProfile(req.user.userId);

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
}

async function updateMe(req, res) {
  try {
    const user = await updateMyProfile(req.user.userId, req.body);

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

async function getUserById(req, res) {
  try {
    const user = await getPublicProfile(req.params.id);

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
}

async function addUserSkills(req, res) {
  try {
    const skills = await addSkills(req.user.userId, req.body.skillIds);

    res.status(200).json({
      skills,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
}

module.exports = {
  getMe,
  updateMe,
  getUserById,
  addUserSkills,
};