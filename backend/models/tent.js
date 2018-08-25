const mongoose = require('mongoose');

const { Schema } = mongoose;

const TentSchema = new Schema({
  capacity: Number,
  type: String,
  isBooked: { type: Boolean, default: false },
  bookingPrice: String,
  surgePrice: String,
  preBookPeriod: String,
  camp: { type: Schema.Types.ObjectId, ref: 'Camp' },
  bookedBy: { type: Schema.Types.ObjectId, unique: true, sparse: true },
});

module.exports = mongoose.model('Tent', TentSchema);
