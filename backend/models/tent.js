const mongoose = require('mongoose');

const { Schema } = mongoose;

const TentSchema = new Schema({
  capacity: Number,
  type: String,
  isBooked: Boolean,
  bookingPrice: Number,
  surgePricing: String,
  preBookPeriod: String,
});

module.exports = mongoose.model('Tent', TentSchema);
