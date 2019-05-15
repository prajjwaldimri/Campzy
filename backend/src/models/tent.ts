import { prop, Typegoose, Ref } from "typegoose";
import { Camp } from "./camp";

export class Tent extends Typegoose {
  @prop()
  private capacity?: number;

  @prop()
  private type?: number;

  @prop()
  private bookingPrice?: number;

  @prop()
  private surgePrice?: number;

  @prop()
  private preBookPeriod?: number;

  @prop({ ref: Camp, required: true })
  private camp!: Ref<Camp>;

  @prop({ default: false })
  private isAvailable!: boolean;

  @prop()
  private disabledDates?: Date[];
}

export var TentModel = new Tent().getModelForClass(Tent);
