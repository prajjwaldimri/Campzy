import {
  prop,
  Typegoose,
  Ref,
  index,
  InstanceType,
  instanceMethod,
  arrayProp
} from "typegoose";
import validate from "mongoose-validator";
import jwt from "jsonwebtoken";
import { Camp } from "./camp";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
@index({ name: "text" })
export class User extends Typegoose {
  @Field({ nullable: true })
  @prop()
  public name?: string;

  @Field()
  @prop({
    lowercase: true,
    required: true,
    unique: true,
    sparse: true,
    validate: [validate({ validator: "isEmail", message: "Not a valid email" })]
  })
  public email!: string;

  @Field()
  @prop({ default: false })
  public isEmailVerified!: boolean;

  @Field()
  @prop({ default: false })
  public gdprConsent!: boolean;

  @prop({ required: true })
  public password!: string;

  @prop()
  public passwordResetToken?: string;

  @prop()
  public passwordResetExpires?: Date;

  @Field()
  @prop({ required: true, default: "Camper" })
  public type!: string;

  @Field()
  @prop({
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
  public phoneNumber?: string;

  @prop()
  public facebookToken?: string;

  @prop()
  public googleToken?: string;

  @Field()
  @prop({ default: false })
  public isBlacklisted?: boolean;

  @Field()
  @prop()
  public dateOfBirth?: Date;

  @prop({ ref: Camp, unique: true, sparse: true })
  public ownedCampId?: Ref<Camp>;

  @Field(() => [Camp])
  @prop({ ref: Camp })
  public wishlist?: Ref<Camp>[];

  @instanceMethod
  public generateJWT(this: InstanceType<User>): string {
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
