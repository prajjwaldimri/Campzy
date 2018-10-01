const mongoose = require('mongoose');
const validate = require('mongoose-validator');

const { Schema } = mongoose;

const CampSchema = new Schema({
  name: { type: String, required: true },
  phoneNumber: {
    type: String,
    validate: [
      validate({
        validator: 'isMobilePhone',
        message: 'Not a valid phone number',
        arguments: ['any', true],
      }),
    ],
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    sparse: true,
    validate: [
      validate({ validator: 'isEmail', message: 'Not a valid email' }),
    ],
  },
  images: [String],
  heroImage: String,
  url: { type: String, unique: true },
  location: { type: String },
  isAvailable: { type: Boolean, required: true, default: false },
  shortDescription: { type: String, required: true },
  longDescription: String,
  tags: {
    type: [String],
    validate: [val => val.length <= 10, 'Only 10 tags are allowed'],
  },
  amenities: {
    washRoomAttached: { type: Boolean, default: false },
    bonfire: { type: Boolean, default: false },
    hotWater: { type: Boolean, default: false },
    mobileConnectivity: { type: Boolean, default: false },
    mealsInclude: { type: Boolean, default: false },
    petsAllowed: { type: Boolean, default: false },
    chargingPoints: { type: Boolean, default: false },
  },
  services: { type: [String] },
  placesOfInterest: [{ name: String, distance: String }],
  temperature: { type: String },
  altitude: { type: String },
  hourDriveFromDelhi: { type: Date },
  coordinates: {
    latitude: { type: String },
    longitude: { type: String },
  },
  ownerId: {
    type: String,
    unique: true,
  },
  terrain: {
    glacier: Boolean,
    forest: Boolean,
    desert: Boolean,
    ocean: Boolean,
    hill: Boolean,
    river: Boolean,
  },
  inventory: [{ type: Schema.Types.ObjectId, ref: 'Tent' }],
  campDocuments: [String],
  averageRating: { type: Number, default: 0 },
  ratingsCount: { type: Number, default: 0 },
});

CampSchema.index(
  {
    name: 'text',
    tags: 'text',
    location: 'text',
    shortDescription: 'text',
    terrain: 'text',
  },
  {
    weights: {
      name: 7,
      location: 6,
      tags: 3,
      terrain: 2,
      shortDescription: 1,
    },
  },
);

module.exports = mongoose.model('Camp', CampSchema);
