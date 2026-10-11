require("dotenv").config();

const { sendOtpEmail } = require("./src/services/emailService");

async function testEmail() {
  try {
    await sendOtpEmail(
      "joybox220@gmail.com",
      "123456"
    );

    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Email failed:", error);
  }
}

testEmail();