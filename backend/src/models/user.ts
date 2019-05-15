import {
  prop,
  Typegoose,
  Ref,
  index,
  InstanceType,
  instanceMethod
} from "typegoose";
import validate from "mongoose-validator";
import jwt from "jsonwebtoken";
import { Camp } from "./camp";

@index({ name: "text" })
export class User extends Typegoose {
  @prop()
  private name?: string;

  @prop({
    lowercase: true,
    required: true,
    unique: true,
    sparse: true,
    validate: [validate({ validator: "isEmail", message: "Not a valid email" })]
  })
  private email!: string;

  @prop({ default: false })
  private isEmailVerified!: boolean;

  @prop({ default: false })
  private gdprConsent!: boolean;

  @prop({ required: true })
  private password!: string;

  @prop()
  private passwordResetToken?: string;

  @prop()
  private passwordResetExpires?: Date;

  @prop({ required: true, default: "Camper" })
  private type!: string;

  @prop({
    required: true,
    unique: true,
    sparse: true,
    validate: [
      validate({
        validator: "isMobilePhone",
        message: "Not a valid phone number",
        arguments: ["any", true]
      })
    ]
  })
  private phoneNumber!: string;

  @prop()
  private facebookToken?: string;

  @prop()
  private googleToken?: string;

  @prop({ default: false })
  private isBlacklisted?: boolean;

  @prop()
  private dateOfBirth?: Date;

  @prop({ ref: Camp, unique: true, sparse: true })
  private ownedCampId?: Ref<Camp>;

  @prop({ ref: Camp })
  private wishlist?: Camp[];

  @instanceMethod
  private generateJWT(this: InstanceType<User>): string {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign(
      {
        email: this.email,
        // eslint-disable-next-line
        id: this._id,
        exp: expirationDate.getTime() / 1000
      },
      process.env.JWT_SECRET || ""
    );
  }
}

export var UserModel = new User().getModelForClass(User);
