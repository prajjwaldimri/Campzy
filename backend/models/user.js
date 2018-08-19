const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    dropDups: true,
  },
  password: { type: String, required: true },
  type: { type: String, required: true, default: 'Camper' },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
  },
  facebook: {
    oauthToken: String,
  },
  google: {
    oauthToken: String,
  },
  date_of_birth: Date,
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

// eslint-disable-next-line
UserSchema.methods.toAuthJSON = function() {
  return {
    // eslint-disable-next-line
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
  };
};

module.exports = mongoose.model('User', UserSchema);
