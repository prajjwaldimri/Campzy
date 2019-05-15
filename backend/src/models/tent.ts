import { prop, Typegoose, Ref } from "typegoose";
import { Camp } from "./camp";

export class Tent extends Typegoose {
  @prop()
  public capacity?: number;

  @prop()
  public type?: number;

  @prop()
  public bookingPrice?: number;

  @prop()
  public surgePrice?: number;

  @prop()
  public preBookPeriod?: number;

  @prop({ ref: Camp, required: true })
  public camp!: Ref<Camp>;

  @prop({ default: false })
  public isAvailable!: boolean;

  @prop()
  public disabledDates?: Date[];
}

export var TentModel = new Tent().getModelForClass(Tent);
