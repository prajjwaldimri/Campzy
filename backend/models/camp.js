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
    validate: [validate({ validator: 'isEmail', message: 'Not a valid email' })],
  },
  images: [String],
  heroImage: String,
  url: { type: String, unique: true },
  location: { type: String },
  isAvailable: { type: Boolean, required: true, default: false },
  shortDescription: { type: String, required: true },
  longDescription: String,
  tags: { type: [String], validate: [val => val.length <= 10, 'Only 10 tags are allowed'] },
  amenities: { type: [String] },
  services: { type: [String] },
  placesOfInterest: { type: [String] },
  temperature: { type: String },
  altitude: { type: String },
  hourDriveFromDelhi: { type: Date },
  coordinates: {
    latitude: { type: String },
    longitude: { type: String },
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    unique: true,
    sparse: true,
    ref: 'User',
  },
  rating: Number,
  terrain: String,
  inventory: [Schema.Types.ObjectId],
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
