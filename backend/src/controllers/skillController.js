const {
  getAllSkills,
} = require("../services/skillService");

async function getSkills(req, res) {
  try {
    const skills = await getAllSkills();

    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  getSkills,
};