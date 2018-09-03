const mongoose = require('mongoose');
const validate = require('mongoose-validator');

const { Schema } = mongoose;

const TentSchema = new Schema({
  capacity: Number,
  type: String,
  isBooked: { type: Boolean, default: false },
  bookingPrice: {
    type: String,
    validate: [validate({ validator: 'isCurrency', message: 'Not a valid amount' })],
  },
  surgePrice: {
    type: String,
    validate: [validate({ validator: 'isCurrency', message: 'Not a valid amount' })],
  },
  preBookPeriod: Number,
  camp: { type: Schema.Types.ObjectId, ref: 'Camp' },
  bookedBy: { type: Schema.Types.ObjectId, unique: true, sparse: true },
});

module.exports = mongoose.model('Tent', TentSchema);
