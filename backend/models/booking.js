const mongoose = require('mongoose');
const en = require('nanoid-good/locale/en');
const nanoid = require('nanoid-good')(en);

const { Schema } = mongoose;

const BookingSchema = new Schema(
  {
    code: {
      type: String,
      unique: true,
      default: () => nanoid(20),
      required: true,
    },
    razorpayPaymentId: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tents: { type: [Schema.Types.ObjectId], ref: 'Tent', required: true },
    camp: { type: Schema.Types.ObjectId, ref: 'Camp', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    tentCount: { type: Number, required: true },
    personCount: { type: Number, required: true },
    amount: { type: Schema.Types.Decimal128, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Booking', BookingSchema);
