const mongoose = require('mongoose');

const { Schema } = mongoose;

const TentSchema = new Schema({
  capacity: Number,
  type: String,
  isBooked: { type: Boolean, default: false },
  bookingPrice: Number,
  surgePrice: Number,
  preBookPeriod: Number,
  camp: { type: Schema.Types.ObjectId, ref: 'Camp' },
  bookedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  isAvailable: { type: Boolean, default: false },
});

module.exports = mongoose.model('Tent', TentSchema);
