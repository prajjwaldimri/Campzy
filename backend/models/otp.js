const mongoose = require('mongoose');

const { Schema } = mongoose;
const OTPSchema = new Schema({
  _userId: { type: Schema.Types.ObjectId, required: true },
  otpValue: { type: String, required: true },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 300,
  },
});

module.exports = mongoose.model('OTP', OTPSchema);
