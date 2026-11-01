const express = require("express");
const authGuard = require("../middleware/authGuard");

const {
  signupController,
  verifyOtpController,
  loginController,
  refreshTokenController,
  logoutController,
  forgotPasswordController,
  resetPasswordController,
  googleLoginController,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signupController);
router.post("/verify-otp", verifyOtpController);
router.post("/login", loginController);
router.post("/refresh-token", refreshTokenController);
router.post("/logout", logoutController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.post("/google", googleLoginController);

router.get("/me/test", authGuard, (req, res) => {
  res.status(200).json({
    message: "You are authenticated.",
    user: req.user,
  });
});

module.exports = router;