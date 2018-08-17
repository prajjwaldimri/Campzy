const mongoose = require('mongoose');

const { Schema } = mongoose;

const CampSchema = new Schema({
  name: String,
  phone_number: String,
  email: String,
  location: String,
  short_description: String,
  long_description: String,
  tags: [String],
  amenities: [String],
  services: [String],
  places_of_interest: [String],
  coordinates: [String],
  packages: {},
  ownerId: String,
});

module.exports = mongoose.model('Camp', CampSchema);
