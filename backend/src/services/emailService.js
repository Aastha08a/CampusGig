const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendOtpEmail(email, otp) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "CampusGig Email Verification",
    text: `Your CampusGig verification code is ${otp}. It expires in 10 minutes.`,
  });
}

async function sendPasswordResetOtpEmail(email, otp) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "CampusGig Password Reset",
    text: `Your CampusGig password reset code is ${otp}. It expires in 10 minutes. If you did not request this, ignore this email.`,
  });
}

module.exports = {
  sendOtpEmail,
  sendPasswordResetOtpEmail,
};