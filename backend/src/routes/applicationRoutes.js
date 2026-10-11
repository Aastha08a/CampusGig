const express = require("express");

const {
  withdrawApplicationController,
} = require("../controllers/applicationController");

const authGuard = require("../middleware/authGuard");

const router = express.Router();

router.delete(
  "/:id",
  authGuard,
  withdrawApplicationController
);

module.exports = router;