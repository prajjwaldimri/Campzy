const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: String,
  email: String,
  type: String,
  phone_number: String,
  facebook: {
    oauth_token: String,
  },
  google: {
    oauth_token: String,
  },
  date_of_birth: Date,
});

module.exports = mongoose.model('User', UserSchema);
