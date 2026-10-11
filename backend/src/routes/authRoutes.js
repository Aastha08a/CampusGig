const express = require("express");
const authGuard = require("../middleware/authGuard");

const {
  signupController,
  verifyOtpController,
  loginController,
  refreshTokenController,
  logoutController,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signupController);
router.post("/verify-otp", verifyOtpController);
router.post("/login", loginController);
router.post("/refresh-token", refreshTokenController);
router.post("/logout", logoutController);

router.get("/me/test", authGuard, (req, res) => {
  res.status(200).json({
    message: "You are authenticated.",
    user: req.user,
  });
});

module.exports = router;