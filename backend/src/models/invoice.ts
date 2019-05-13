import mongoose from "mongoose";
const AutoIncrement = require("mongoose-sequence")(mongoose);

const { Schema } = mongoose;

const InvoiceSchema = new Schema(
  {
    serviceCharge: Number,
    tax: Number,
    totalAmount: Number,
    booking: { type: Schema.Types.ObjectId, ref: "Booking" },
    camp: { type: Schema.Types.ObjectId, ref: "Camp" }
  },
  { timestamps: true }
);

// eslint-disable-next-line @typescript-eslint/camelcase
InvoiceSchema.plugin(AutoIncrement, { inc_field: "invoiceNumber" });

module.exports = mongoose.model("Invoice", InvoiceSchema);
