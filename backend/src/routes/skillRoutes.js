const express = require("express");

const {
  getSkills,
} = require("../controllers/skillController");

const authGuard = require("../middleware/authGuard");

const router = express.Router();

router.get("/", authGuard, getSkills);

module.exports = router;