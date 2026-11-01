const express = require("express");

const {
  withdrawApplicationController,
  updateApplicationStatusController,
} = require("../controllers/applicationController");

const authGuard = require("../middleware/authGuard");

const router = express.Router();

router.patch(
  "/:id",
  authGuard,
  updateApplicationStatusController
);

router.delete(
  "/:id",
  authGuard,
  withdrawApplicationController
);

module.exports = router;