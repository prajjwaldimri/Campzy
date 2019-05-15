import { prop, Typegoose, Ref } from "typegoose";
import mongoose from "mongoose";

class Blog extends Typegoose {
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

  // @prop({ ref: User, required: true })
  // private authorId!: Ref<User>;
}

// const BlogSchema = new Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     url: {
//       type: String,
//       required: true,
//       unique: true
//     },
//     content: { type: String, required: true },
//     heroImage: { type: String, required: true },
//     heroImageCaption: { type: String, required: true },
//     authorId: {
//       type: Schema.Types.ObjectId,
//       ref: "User"
//     },
//     darkTheme: { type: Boolean, default: false }
//   },
//   { timestamps: true }
// );

export var BlogModel = new Blog().getModelForClass(Blog, {
  schemaOptions: { timestamps: true }
});
