import { Typegoose, prop } from "typegoose";

export class Token extends Typegoose {
  @prop({ required: true })
  public userId!: string;

  @prop({ required: true })
  public tokenValue!: string;

  @prop({ required: true, default: Date.now, expires: 18000 })
  public createdAt!: Date;
}

export var TokenModel = new Token().getModelForClass(Token);
