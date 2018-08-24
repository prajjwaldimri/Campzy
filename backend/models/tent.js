const mongoose = require('mongoose');

const { Schema } = mongoose;

const TentSchema = new Schema({
  capacity: Number,
  type: String,
  isBooked: Boolean,
  bookingPrice: String,
  surgePrice: String,
  preBookPeriod: String,
  bookedBy: { type: Schema.Types.ObjectId, unique: true, sparse: true },
});

module.exports = mongoose.model('Tent', TentSchema);
