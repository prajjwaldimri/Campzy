import { prop, Typegoose, Ref } from "typegoose";
import { Schema } from "mongoose";
import nanoid from "nanoid";
import { User } from "./user";
import { Tent } from "./tent";
import { Camp } from "./camp";

export class Booking extends Typegoose {
  @prop({ unique: true, required: true, default: (): string => nanoid(20) })
  public code!: string;

  @prop({ required: true })
  public razorpayPaymentId!: string;

  @prop({ default: false })
  public isCancelled!: boolean;

  @prop({ ref: User, required: true })
  public user!: Ref<User>;

  @prop({ ref: Tent, required: true })
  public tents!: Ref<Tent[]>;

  @prop({ ref: Camp, required: true })
  public camp!: Ref<Camp>;

  @prop({ required: true })
  public startDate!: Date;

  @prop({ required: true })
  public endDate!: Date;

  @prop({ required: true })
  public tentCount!: number;

  @prop({ required: true })
  public personCount!: number;

  @prop({ required: true })
  public amount!: Schema.Types.Decimal128;
}

export var BookingModel = new Booking().getModelForClass(Booking, {
  schemaOptions: { timestamps: true }
});
