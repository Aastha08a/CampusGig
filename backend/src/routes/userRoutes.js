const express = require("express");

const {
  getMe,
  updateMe,
  getUserById,
  addUserSkills,
} = require("../controllers/userController");

const authGuard = require("../middleware/authGuard");

const router = express.Router();

const {
  getMyApplicationsController,
} = require("../controllers/applicationController");

router.get("/me", authGuard, getMe);

router.patch("/me", authGuard, updateMe);

router.get(
  "/me/applications",
  authGuard,
  getMyApplicationsController
);

router.get("/:id", authGuard, getUserById);

router.post("/me/skills", authGuard, addUserSkills);

module.exports = router;