import { Typegoose, prop, Ref } from "typegoose";
import { User } from "./user";

export class Token extends Typegoose {
  @prop({ ref: User, required: true })
  public user!: Ref<User>;

  @prop({ required: true })
  public tokenValue!: string;

  @prop({ required: true, default: Date.now, expires: 18000 })
  public createdAt!: Date;
}

export var TokenModel = new Token().getModelForClass(Token);
