import { Typegoose, prop, Ref } from "typegoose";
import { User } from "./user";
import { Camp } from "./camp";
import { Booking } from "./booking";

export class Review extends Typegoose {
  @prop({ required: true })
  public stars!: number;

  @prop()
  public comment?: string;

  @prop({ ref: User })
  public user!: Ref<User>;

  @prop({ ref: Camp })
  public camp!: Ref<Camp>;

  @prop({ ref: Booking })
  public booking!: Ref<Booking>;
}

export var ReviewModel = new Review().getModelForClass(Review, {
  schemaOptions: { timestamps: true }
});
