const mongoose = require('mongoose');

const { Schema } = mongoose;
const OTPSchema = new Schema({
  phoneNumber: { type: String, required: true },
  otpValue: { type: String, required: true },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 300,
  },
});

module.exports = mongoose.model('OTP', OTPSchema);
