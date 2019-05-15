import { prop, Typegoose, Ref } from "typegoose";
import { Schema } from "mongoose";
import nanoid from "nanoid";
import { User } from "./user";
import { Tent } from "./tent";
import { Camp } from "./camp";

export class Booking extends Typegoose {
  @prop({ unique: true, required: true, default: (): string => nanoid(20) })
  private code!: string;

  @prop({ required: true })
  private razorpayPaymentId!: string;

  @prop({ default: false })
  private isCancelled!: boolean;

  @prop({ ref: User, required: true })
  private user!: Ref<User>;

  @prop({ ref: Tent, required: true })
  private tents!: Ref<Tent[]>;

  @prop({ ref: Camp, required: true })
  private camp!: Ref<Camp>;

  @prop({ required: true })
  private startDate!: Date;

  @prop({ required: true })
  private endDate!: Date;

  @prop({ required: true })
  private tentCount!: number;

  @prop({ required: true })
  private personCount!: number;

  @prop({ required: true })
  private amount!: Schema.Types.Decimal128;
}

export var BookingModel = new Booking().getModelForClass(Booking, {
  schemaOptions: { timestamps: true }
});
