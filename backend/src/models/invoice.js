const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const { Schema } = mongoose;

const InvoiceSchema = new Schema(
  {
    serviceCharge: Number,
    tax: Number,
    totalAmount: Number,
    booking: { type: Schema.Types.ObjectId, ref: 'Booking' },
    camp: { type: Schema.Types.ObjectId, ref: 'Camp' },
  },
  { timestamps: true },
);

InvoiceSchema.plugin(AutoIncrement, { inc_field: 'invoiceNumber' });

module.exports = mongoose.model('Invoice', InvoiceSchema);
