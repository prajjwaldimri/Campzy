import { prop, Typegoose, Ref } from "typegoose";
import { User } from "./user";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Blog extends Typegoose {
  @Field()
  @prop({ required: true, trim: true })
  public title!: string;

  @Field()
  @prop({ required: true })
  public description!: string;

  @Field()
  @prop({ required: true, unique: true, trim: true })
  public url!: string;

  @Field()
  @prop({ required: true })
  public content!: string;

  @Field()
  @prop({ required: true })
  public heroImage!: string;

  @Field()
  @prop({ required: true })
  public heroImageCaption!: string;

  @Field()
  @prop({ default: false })
  public darkTheme!: boolean;

  @prop({ ref: User, required: true })
  public authorId!: Ref<User>;
}

export var BlogModel = new Blog().getModelForClass(Blog, {
  schemaOptions: { timestamps: true }
});
