const crypto = require("crypto");

function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

function getOtpExpiry() {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 10);
  return expiry;
}

module.exports = {
  generateOtp,
  getOtpExpiry,
};