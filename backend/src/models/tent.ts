import mongoose from "mongoose";

const { Schema } = mongoose;

const TentSchema = new Schema({
  capacity: Number,
  type: String,
  bookingPrice: Number,
  preBookPeriod: Number,
  surgePrice: Number,
  camp: { type: Schema.Types.ObjectId, ref: "Camp" },
  isAvailable: { type: Boolean, default: false },
  disabledDates: { type: [Date] }
});

module.exports = mongoose.model("Tent", TentSchema);
