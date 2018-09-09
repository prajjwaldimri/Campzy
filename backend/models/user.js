const mongoose = require('mongoose');
const validate = require('mongoose-validator');

const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    sparse: true,
    validate: [validate({ validator: 'isEmail', message: 'Not a valid email' })],
  },
  isEmailVerified: { type: Boolean, default: false },
  gdprConsent: { type: Boolean, default: false },
  password: { type: String, required: true },
  passwordResetToken: String,
  passwordResetExpires: Date,
  type: { type: String, required: true, default: 'Camper' },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
    validate: [
      validate({
        validator: 'isMobilePhone',
        message: 'Not a valid phone number',
        arguments: ['any', true],
      }),
    ],
  },
  facebook: {
    oauthToken: String,
  },
  google: {
    oauthToken: String,
  },
  isBlacklisted: { type: Boolean, default: false },
  dateOfBirth: Date,
  ownedCampId: {
    type: Schema.Types.ObjectId,
    unique: true,
    sparse: true,
    ref: 'Camp',
  },
  authoredBlogId: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
});

UserSchema.index({
  name: 'text',
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
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    },
    process.env.JWT_SECRET,
  );
};

module.exports = mongoose.model('User', UserSchema);
