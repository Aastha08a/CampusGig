const {
  verifyRefreshToken,
  generateAccessToken,
} = require("../utils/jwt");

const {
  signup,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
  googleLogin,
} = require("../services/authService");

const {
  signupSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../utils/validation");

async function signupController(req, res) {
  try {
    const data = signupSchema.parse(req.body);

    const result = await signup(
      data.name,
      data.email,
      data.password,
      data.stream,
      data.year,
      data.city
    );

    res.status(201).json(result);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      });
    }

    res.status(400).json({
      message: error.message,
    });
  }
}

async function verifyOtpController(req, res) {
  try {
    const data = verifyOtpSchema.parse(req.body);

    const result = await verifyOtp(
      data.email,
      data.otp
    );

    res.status(200).json(result);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      });
    }

    res.status(400).json({
      message: error.message,
    });
  }
}

async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    const result = await login(email, password);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: result.message,
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
}

async function refreshTokenController(req, res) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh token not found.",
      });
    }

    const decoded = verifyRefreshToken(refreshToken);

    const accessToken = generateAccessToken({
      id: decoded.userId,
    });

    res.status(200).json({
      accessToken,
    });
  } catch (error) {
    res.status(401).json({
      message: "Invalid or expired refresh token.",
    });
  }
}

async function logoutController(req, res) {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({
    message: "Logout successful.",
  });
}

async function forgotPasswordController(req, res) {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const result = await forgotPassword(email);

    res.status(200).json(result);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    res.status(500).json({
      message: "Unable to process your request right now.",
    });
  }
}

async function resetPasswordController(req, res) {
  try {
    const data = resetPasswordSchema.parse(req.body);

    const result = await resetPassword(
      data.email,
      data.otp,
      data.newPassword
    );

    res.status(200).json(result);
  } catch (error) {
    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Invalid reset details.",
        errors: error.issues.map((issue) => ({
          field: issue.path[0],
          message: issue.message,
        })),
      });
    }

    res.status(400).json({
      message: error.message || "Password reset failed.",
    });
  }
}

async function googleLoginController(req, res) {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required.",
      });
    }

    const result = await googleLogin(credential);

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Google login successful.",
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    res.status(401).json({
      message: error.message || "Google login failed.",
    });
  }
}

module.exports = {
  signupController,
  verifyOtpController,
  loginController,
  googleLoginController,
  forgotPasswordController,
  resetPasswordController,

  refreshTokenController,
  logoutController,
};