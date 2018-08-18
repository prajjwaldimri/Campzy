const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: String,
  email: {
    type: String, required: true, index: true, unique: true, dropDups: true,
  },
  password: { type: String, required: true },
  type: { type: String, required: true, default: 'Camper' },
  phone_number: { type: String, required: true },
  facebook: {
    oauth_token: String,
  },
  google: {
    oauth_token: String,
  },
  date_of_birth: Date,
});

module.exports = mongoose.model('User', UserSchema);
