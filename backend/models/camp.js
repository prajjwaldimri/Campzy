const mongoose = require('mongoose');

const { Schema } = mongoose;

// Schema of paid packages that camp provides
const packageSchema = new Schema({
  name: String,
  number_of_guests: Number,
  price: Number,
  facilities: [String],
  discount_percent: Number,
});

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
  packages: [packageSchema],
  ownerId: String,
});

module.exports = mongoose.model('Camp', CampSchema);
