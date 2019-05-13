import mongoose, { Schema, Document } from "mongoose";

export interface OTP extends Document {
  phoneNumber: string;
  otpValue: string;
}

const OTPSchema = new Schema({
  phoneNumber: { type: String, required: true },
  otpValue: { type: String, required: true },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 300
  }
});

export var OTPModel = mongoose.model<OTP>("OTP", OTPSchema);
