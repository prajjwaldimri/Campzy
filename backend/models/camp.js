const mongoose = require('mongoose');

const { Schema } = mongoose;

const CampSchema = new Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String },
  email: String,
  url: { type: String, unique: true },
  location: { type: String },
  isAvailable: { type: Boolean, required: true, default: false },
  shortDescription: { type: String, required: true },
  longDescription: String,
  tags: { type: [String] },
  amenities: { type: [String] },
  services: { type: [String] },
  placesOfInterest: { type: [String] },
  coordinates: [String],
  ownerId: { type: Schema.Types.ObjectId, unique: true, sparse: true },
  inventory: [Schema.Types.ObjectId],
});

module.exports = mongoose.model('Camp', CampSchema);
