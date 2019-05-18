import { Typegoose, prop, Ref } from "typegoose";
import { User } from "./user";

export class OTP extends Typegoose {
  @prop({ required: true })
  public user!: Ref<User>;

  @prop({ required: true })
  public phoneNumber!: string;

  @prop({ required: true })
  public otpValue!: string;

  @prop({ required: true, default: Date.now, expires: 300 })
  public createdAt!: Date;
}

export var OTPModel = new OTP().getModelForClass(OTP);
