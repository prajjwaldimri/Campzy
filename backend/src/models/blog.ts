import { prop, Typegoose, Ref } from "typegoose";
import { User } from "./user";

export class Blog extends Typegoose {
  @prop({ required: true, trim: true })
  private title!: string;

  @prop({ required: true })
  private description!: string;

  @prop({ required: true, unique: true, trim: true })
  private url!: true;

  @prop({ required: true })
  private content!: string;

  @prop({ required: true })
  private heroImage!: string;

  @prop({ required: true })
  private heroImageCaption!: string;

  @prop({ default: false })
  private darkTheme!: boolean;

  @prop({ ref: User, required: true })
  private authorId!: Ref<User>;
}

export var BlogModel = new Blog().getModelForClass(Blog, {
  schemaOptions: { timestamps: true }
});
