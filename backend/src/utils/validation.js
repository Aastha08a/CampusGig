const { z } = require("zod");

const signupSchema = z.object({

  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long"),

  stream: z
    .string()
    .trim()
    .min(1, "Please select your stream"),

  year: z
    .number()
    .int()
    .min(1, "Year must be between 1 and 4")
    .max(4, "Year must be between 1 and 4"),

  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters long"),

});

const verifyOtpSchema = z.object({

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  otp: z
    .string()
    .regex(/^\d{6}$/, "OTP must be exactly 6 digits"),

});

module.exports = {

  signupSchema,
  verifyOtpSchema,

};