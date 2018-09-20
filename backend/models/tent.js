const mongoose = require('mongoose');

const { Schema } = mongoose;

const TentSchema = new Schema({
  capacity: Number,
  type: String,
  isBooked: { type: Boolean, default: false },
  bookingPrice: Number,
  preBookPeriod: Number,
  surgePrice: Number,
  camp: { type: Schema.Types.ObjectId, ref: 'Camp' },
  bookedBy: {
    type: String,
    ref: 'User',
  },
  isAvailable: { type: Boolean, default: false },
});

module.exports = mongoose.model('Tent', TentSchema);
