import { Typegoose, prop, Ref, plugin } from "typegoose";
import { Booking } from "./booking";
import { Camp } from "./camp";
import mongoose from "mongoose";
const AutoIncrement = require("mongoose-sequence")(mongoose);

// eslint-disable-next-line @typescript-eslint/camelcase
@plugin(AutoIncrement, { inc_field: "invoiceNumber" })
export class Invoice extends Typegoose {
  @prop()
  private serviceCharge?: number;

  @prop()
  private tax?: number;

  @prop()
  private totalAmount?: number;

  @prop({ ref: Booking })
  private booking?: Ref<Booking>;

  @prop({ ref: Camp })
  private camp?: Ref<Camp>;
}

export var InvoiceModel = new Invoice().getModelForClass(Invoice, {
  schemaOptions: { timestamps: true }
});
