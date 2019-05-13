import mongoose from "mongoose";

const { Schema } = mongoose;
const ReviewSchema = new Schema(
  {
    stars: { type: Number, required: true },
    comment: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    camp: { type: Schema.Types.ObjectId, ref: "Camp" },
    booking: { type: Schema.Types.ObjectId, ref: "Booking" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
