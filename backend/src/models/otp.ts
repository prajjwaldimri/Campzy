import { Typegoose, prop } from "typegoose";

export class OTP extends Typegoose {
  @prop({ required: true })
  private phoneNumber!: string;

  @prop({ required: true })
  private otpValue!: string;

  @prop({ required: true, default: Date.now, expires: 300 })
  private createdAt!: Date;
}

export var OTPModel = new OTP().getModelForClass(OTP);
