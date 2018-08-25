const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: { type: String, text: true },
  email: {
    type: String,
    text: true,
    lowercase: true,
    required: true,
    unique: true,
    sparse: true,
  },
  isEmailVerified: { type: Boolean, default: false },
  password: { type: String, required: true },
  passwordResetToken: String,
  passwordResetExpires: Date,
  type: { type: String, required: true, default: 'Camper' },
  phoneNumber: {
    type: String,
    text: true,
    required: true,
    unique: true,
    sparse: true,
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
