const bcrypt = require("bcrypt");

const prisma = require("../lib/prisma");

const { generateOtp, getOtpExpiry } = require("../utils/otp");

const { sendOtpEmail } = require("./emailService");

const { OAuth2Client } = require("google-auth-library");

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt");

const crypto = require("crypto");

const {
  sendPasswordResetOtpEmail,
} = require("./emailService");

function isChitkaraEmail(email) {
  return email.toLowerCase().endsWith("@chitkara.edu.in");
}

async function signup(name, email, password, stream, year, city) {
  if (!isChitkaraEmail(email)) {
    throw new Error("Only Chitkara University email addresses are allowed.");
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const otp = generateOtp();
  const otpExpiresAt = getOtpExpiry();
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password_hash: passwordHash,

      stream,
      year,
      city,

      is_verified: false,
      otp_code: otp,
      otp_expires_at: otpExpiresAt,
    },
  });

  await sendOtpEmail(user.email, otp);

  return {
    message: "Signup successful. Please verify your email with the OTP.",
    email: user.email,
  };
}

async function verifyOtp(email, otp) {
  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.otp_code !== otp) {
    throw new Error("Invalid OTP.");
  }

  if (new Date() > user.otp_expires_at) {
    throw new Error("OTP has expired.");
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      is_verified: true,
      otp_code: null,
      otp_expires_at: null,
    },
  });

  return {
    message: "Email verified successfully.",
  };
}

async function login(email, password) {
  const user = await prisma.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  if (!user.is_verified) {
    throw new Error("Please verify your email before logging in.");
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    user.password_hash
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password.");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    message: "Login successful.",
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

async function forgotPassword(email) {
  const normalizedEmail = email.toLowerCase();

  // Return the same response for unknown or ineligible accounts.
  const genericMessage =
    "If an eligible account exists, a password reset code has been sent.";

  if (!isChitkaraEmail(normalizedEmail)) {
    return { message: genericMessage };
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user || !user.is_verified) {
    return { message: genericMessage };
  }

  const otp = generateOtp();
  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      reset_otp_code: hashedOtp,
      reset_otp_expires_at: getOtpExpiry(),
    },
  });

  await sendPasswordResetOtpEmail(user.email, otp);

  return { message: genericMessage };
}

async function resetPassword(email, otp, newPassword) {
  const normalizedEmail = email.toLowerCase();

  if (!isChitkaraEmail(normalizedEmail)) {
    throw new Error("Invalid or expired reset code.");
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user || !user.is_verified ||
      !user.reset_otp_code || !user.reset_otp_expires_at) {
    throw new Error("Invalid or expired reset code.");
  }

  if (new Date() > user.reset_otp_expires_at) {
    throw new Error("Invalid or expired reset code.");
  }

  const hashedOtp = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  if (hashedOtp !== user.reset_otp_code) {
    throw new Error("Invalid or expired reset code.");
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password_hash: passwordHash,
      reset_otp_code: null,
      reset_otp_expires_at: null,
    },
  });

  return {
    message: "Password reset successfully. Please log in.",
  };
}


async function googleLogin(credential) {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.email || !payload.email_verified) {
    throw new Error("Unable to verify your Google account.");
  }

  const email = payload.email.toLowerCase();

  if (!isChitkaraEmail(email)) {
    throw new Error("Only Chitkara University Google accounts are allowed.");
  }

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (user) {
    // Google has verified ownership of this email.
    if (!user.is_verified) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          is_verified: true,
          otp_code: null,
          otp_expires_at: null,
        },
      });
    }
  } else {
    // The existing schema requires a password hash.
    // Generate a random, undisclosed password for Google-created accounts.
    const randomPassword = crypto.randomBytes(32).toString("hex");
    const passwordHash = await bcrypt.hash(randomPassword, 12);

    user = await prisma.user.create({
      data: {
        name: payload.name || email.split("@")[0],
        email,
        password_hash: passwordHash,
        is_verified: true,
      },
    });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    message: "Google login successful.",
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}


module.exports = {
  signup,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
  googleLogin,
};