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
  password: { type: String, required: true },
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
  dateOfBirth: Date,
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
