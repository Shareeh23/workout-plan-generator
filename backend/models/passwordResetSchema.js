const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true
  },
  otp: {
    type: String,
    required: true
  },
  otpExpires: {
    type: Date,
    required: true
  },
  isOtpVerified: {
    type: Boolean,
    default: false
  },
  otpVerifiedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 1800 // 30 minutes (15m OTP + buffer)
  }
}, {
  index: { 
    email: 1,
    otp: 1
  }
});

module.exports = mongoose.model('PasswordReset', passwordResetSchema);