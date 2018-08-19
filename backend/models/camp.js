const mongoose = require('mongoose');

const { Schema } = mongoose;

const CampSchema = new Schema({
  name: { type: String, required: true },
  phoneNumber: String,
  email: String,
  location: String,
  isAvailable: { type: Boolean, required: true, default: false },
  shortDescription: { type: String, required: true },
  longDescription: String,
  tags: [String],
  amenities: [String],
  services: [String],
  placesOfInterest: [String],
  coordinates: [String],
  ownerId: Schema.Types.ObjectId,
  inventory: [Schema.Types.ObjectId],
});

module.exports = mongoose.model('Camp', CampSchema);
