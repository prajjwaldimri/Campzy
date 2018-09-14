const mongoose = require('mongoose');
const nanoid = require('nanoid');

const { Schema } = mongoose;

const BookingSchema = new Schema(
  {
    code: {
      type: String, unique: true, default: nanoid, required: true,
    },
    razorpayPaymentId: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tent: { type: Schema.Types.ObjectId, ref: 'Tent', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    adultCount: { type: Number, required: true },
    childrenCount: { type: Number, required: true },
    amount: { type: Schema.Types.Decimal128, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Booking', BookingSchema);
