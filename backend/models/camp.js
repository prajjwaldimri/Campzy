const mongoose = require('mongoose');

const { Schema } = mongoose;

const CampSchema = new Schema({
  name: { type: String, required: true, text: true },
  phoneNumber: { type: String, text: true },
  email: String,
  location: { type: String, text: true },
  isAvailable: { type: Boolean, required: true, default: false },
  shortDescription: { type: String, required: true },
  longDescription: String,
  tags: { type: [String], text: true },
  amenities: { type: [String], text: true },
  services: { type: [String], text: true },
  placesOfInterest: { type: [String], text: true },
  coordinates: [String],
  ownerId: Schema.Types.ObjectId,
  inventory: [Schema.Types.ObjectId],
});

module.exports = mongoose.model('Camp', CampSchema);
