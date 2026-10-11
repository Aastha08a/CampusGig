const bcrypt = require("bcrypt");

const prisma = require("../lib/prisma");

const { generateOtp, getOtpExpiry } = require("../utils/otp");

const { sendOtpEmail } = require("./emailService");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt");

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

module.exports = {
  signup,
  verifyOtp,
  login,
};