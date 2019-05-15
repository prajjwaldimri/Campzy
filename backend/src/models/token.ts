import { Typegoose, prop, Ref } from "typegoose";
import { User } from "./user";

export class Token extends Typegoose {
  @prop({ ref: User, required: true })
  private user!: Ref<User>;

  @prop({ required: true })
  private tokenValue!: string;

  @prop({ required: true, default: Date.now, expires: 18000 })
  private createdAt!: Date;
}

export var TokenModel = new Token().getModelForClass(Token);
