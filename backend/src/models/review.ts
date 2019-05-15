import { Typegoose, prop, Ref } from "typegoose";
import { User } from "./user";
import { Camp } from "./camp";
import { Booking } from "./booking";

export class Review extends Typegoose {
  @prop({ required: true })
  private stars!: number;

  @prop()
  private comment?: string;

  @prop({ ref: User })
  private user!: Ref<User>;

  @prop({ ref: Camp })
  private camp!: Ref<Camp>;

  @prop({ ref: Booking })
  private booking!: Ref<Booking>;
}

export var ReviewModel = new Review().getModelForClass(Review, {
  schemaOptions: { timestamps: true }
});
