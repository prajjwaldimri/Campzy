import { prop, Typegoose, Ref } from "typegoose";
import { User } from "./user";

export class Blog extends Typegoose {
  @prop({ required: true, trim: true })
  public title!: string;

  @prop({ required: true })
  public description!: string;

  @prop({ required: true, unique: true, trim: true })
  public url!: true;

  @prop({ required: true })
  public content!: string;

  @prop({ required: true })
  public heroImage!: string;

  @prop({ required: true })
  public heroImageCaption!: string;

  @prop({ default: false })
  public darkTheme!: boolean;

  @prop({ ref: User, required: true })
  public authorId!: Ref<User>;
}

export var BlogModel = new Blog().getModelForClass(Blog, {
  schemaOptions: { timestamps: true }
});
