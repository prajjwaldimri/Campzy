import mongoose, { Schema, Document } from "mongoose";
import validate from "mongoose-validator";

import jwt from "jsonwebtoken";

export interface User extends Document {
  email: string;
  name: string;
  type: string;
  isEmailVerified: boolean;
}

const UserSchema = new Schema({
  name: { type: String },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    sparse: true,
    validate: [validate({ validator: "isEmail", message: "Not a valid email" })]
  },
  isEmailVerified: { type: Boolean, default: false },
  gdprConsent: { type: Boolean, default: false },
  password: { type: String, required: true },
  passwordResetToken: String,
  passwordResetExpires: Date,
  type: { type: String, required: true, default: "Camper" },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
    validate: [
      validate({
        validator: "isMobilePhone",
        message: "Not a valid phone number",
        arguments: ["any", true]
      })
    ]
  },
  facebookToken: String,
  googleToken: String,
  isBlacklisted: { type: Boolean, default: false },
  dateOfBirth: Date,
  ownedCampId: {
    type: Schema.Types.ObjectId,
    unique: true,
    sparse: true,
    ref: "Camp"
  },
  authoredBlogId: [
    {
      type: Schema.Types.ObjectId,
      ref: "Blog"
    }
  ],
  wishlist: [{ type: Schema.Types.ObjectId, ref: "Camp" }]
});

UserSchema.index({
  name: "text"
});

// eslint-disable-next-line
UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      email: this.email,
      // eslint-disable-next-line
      id: this._id,
      exp: expirationDate.getTime() / 1000
    },
    process.env.JWT_SECRET || ""
  );
};

export var UserModel = mongoose.model<User>("User", UserSchema);
