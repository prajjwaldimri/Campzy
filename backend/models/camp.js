const mongoose = require('mongoose');

const { Schema } = mongoose;

const CampSchema = new Schema({
  name: String,
  phoneNumber: String,
  email: String,
  location: String,
  isAvailable: Boolean,
  shortDescription: String,
  longDescription: String,
  tags: [String],
  amenities: [String],
  services: [String],
  placesOfInterest: [String],
  coordinates: [String],
  ownerId: [Schema.Types.ObjectId],
  inventory: [Schema.Types.ObjectId],
});

module.exports = mongoose.model('Camp', CampSchema);
