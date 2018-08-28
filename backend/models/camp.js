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
  url: { type: String, unique: true },
  location: { type: String },
  isAvailable: { type: Boolean, required: true, default: false },
  shortDescription: { type: String, required: true },
  longDescription: String,
  tags: { type: [String], validate: [val => val.length <= 10, 'Only 10 tags are allowed'] },
  amenities: { type: [String] },
  services: { type: [String] },
  placesOfInterest: { type: [String] },
  coordinates: {
    type: String,
    validate: [validate({ validator: 'isLatLong', message: 'Not valid coordinates' })],
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    unique: true,
    sparse: true,
    ref: 'User',
  },
  inventory: [Schema.Types.ObjectId],
});

module.exports = mongoose.model('Camp', CampSchema);
