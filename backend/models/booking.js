const mongoose = require('mongoose');
const nanoid = require('nanoid');

const { Schema } = mongoose;

const BookingSchema = new Schema(
  {
    code: { type: String, unique: true, default: nanoid },
    razorpayBookingId: { type: String },
    isCompleted: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    tent: { type: Schema.Types.ObjectId, ref: 'Tent' },
    startDate: { type: Date },
    endDate: { type: Date },
    adultCount: { type: Number },
    childrenCount: { type: Number },
    amount: { type: Schema.Types.Decimal128 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Booking', BookingSchema);
