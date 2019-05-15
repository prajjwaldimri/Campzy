import { Typegoose, prop, Ref, plugin } from "typegoose";
import { Booking } from "./booking";
import { Camp } from "./camp";
import mongoose from "mongoose";
const AutoIncrement = require("mongoose-sequence")(mongoose);

// eslint-disable-next-line @typescript-eslint/camelcase
@plugin(AutoIncrement, { inc_field: "invoiceNumber" })
export class Invoice extends Typegoose {
  @prop({ required: true })
  public invoiceNumber!: number;

  @prop()
  public serviceCharge?: number;

  @prop()
  public tax?: number;

  @prop()
  public totalAmount?: number;

  @prop({ ref: Booking })
  public booking?: Ref<Booking>;

  @prop({ ref: Camp })
  public camp?: Ref<Camp>;
}

export var InvoiceModel = new Invoice().getModelForClass(Invoice, {
  schemaOptions: { timestamps: true }
});
