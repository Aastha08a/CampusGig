const express = require("express");

const {
  createGigController,
  getGig,
  updateGigController,
  deleteGigController,
  getMyGigsController,
  getAllGigsController,
} = require("../controllers/gigController");

const authGuard = require("../middleware/authGuard");

const router = express.Router();

const {
  createApplicationController,
} = require("../controllers/applicationController");

router.post(
  "/:id/applications",
  authGuard,
  createApplicationController
);

router.get("/my", authGuard, getMyGigsController);

router.post("/", authGuard, createGigController);

router.get("/", authGuard, getAllGigsController);

router.get("/:id", authGuard, getGig);

router.patch("/:id", authGuard, updateGigController);

router.delete("/:id", authGuard, deleteGigController);

module.exports = router;