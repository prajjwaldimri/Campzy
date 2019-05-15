import {
  prop,
  Typegoose,
  Ref,
  index,
  InstanceType,
  ModelType
} from "typegoose";
import validate from "mongoose-validator";
import nanoid from "nanoid";

import { TentModel } from "./tent";
import { User } from "./user";

class BankAccount {
  @prop()
  private beneficiary?: string;

  @prop()
  private accountType?: string;

  @prop()
  private accountNumber?: string;

  @prop()
  private IFSCCode?: string;
}

class Amenities {
  @prop({
    default: false
  })
  private washRoomAttached!: boolean;

  @prop({ default: false })
  private bonfire!: boolean;

  @prop({ default: false })
  private hotWater!: boolean;

  @prop({ default: false })
  private mobileConnectivity!: boolean;

  @prop({ default: false })
  private mealsInclude!: boolean;

  @prop({ default: false })
  private petsAllowed!: boolean;

  @prop({ default: false })
  private chargingPoints!: boolean;
}

class NearbyActivities {
  @prop({ default: false })
  private waterRafting?: boolean;

  @prop({ default: false })
  private kayaking?: boolean;

  @prop({ default: false })
  private skiing?: boolean;

  @prop({ default: false })
  private waterfallRappelling?: boolean;

  @prop({ default: false })
  private skydiving?: boolean;

  @prop({ default: false })
  private scubaDiving?: boolean;

  @prop({ default: false })
  private hotAirBallon?: boolean;

  @prop({ default: false })
  private caving?: boolean;

  @prop({ default: false })
  private trekking?: boolean;

  @prop({ default: false })
  private snorkelling?: boolean;

  @prop({ default: false })
  private cliffJumping?: boolean;

  @prop({ default: false })
  private paragliding?: boolean;

  @prop({ default: false })
  private cycling?: boolean;
}

class Coordinates {
  @prop()
  private lat?: string;

  @prop()
  private long?: string;
}

class Terrain {
  @prop()
  private glacier?: boolean;

  @prop()
  private forest?: boolean;

  @prop()
  private desert?: boolean;

  @prop()
  private ocean?: boolean;

  @prop()
  private hill?: boolean;

  @prop()
  private river?: boolean;
}

@index({
  name: "text",
  shortDescription: "text",
  tags: "text",
  location: "text",
  terrain: "text"
})
export class Camp extends Typegoose {
  @prop({ required: true })
  private name!: string;

  @prop({
    validate: [
      validate({
        validator: "isMobilePhone",
        message: "Not a valid phone number",
        arguments: ["any", true]
      })
    ]
  })
  private phoneNumber?: string;

  @prop({
    lowercase: true,
    required: true,
    unique: true,
    sparse: true,
    validate: [
      validate({
        validator: "isEmail",
        message: "Not a valid email"
      })
    ]
  })
  private email!: string;

  @prop()
  private image?: string[];

  @prop()
  private heroImage?: string;

  @prop({ unique: true, required: true })
  private url!: string;

  @prop()
  private location?: string;

  @prop({ required: true, default: false })
  private isAvailable!: boolean;

  @prop({ required: true })
  private shortDescription!: string;

  @prop()
  private longDescription?: string;

  @prop({ required: true, default: false })
  private agreementAccepted!: boolean;

  @prop({ unique: true, default: (): string => nanoid(20), required: true })
  private gst!: string;

  @prop()
  private bank?: BankAccount;

  @prop({
    validate: (val): boolean => val.length <= 10
  })
  private tags?: string[];

  @prop()
  private amenities?: Amenities;

  @prop()
  private razorpayAccountId?: string;

  @prop()
  private razorpayCustomerId?: string;

  @prop()
  private services?: string[];

  @prop()
  private nearByActivities?: NearbyActivities;

  @prop()
  private temperature?: string;

  @prop()
  private temperatureSummary?: string;

  @prop()
  private altitude?: string;

  @prop()
  private hourDriveFromDelhi?: Date;

  @prop()
  private coordinates?: Coordinates;

  @prop({ ref: User, unique: true })
  private ownerId?: Ref<User>;

  @prop()
  private terrain?: Terrain;

  @prop()
  private campDocuments?: string[];

  @prop({ default: 0 })
  private averageRating!: number;

  @prop({ default: 0 })
  private ratingsCount!: number;

  @prop({ default: 0 })
  private credits!: number;

  @prop()
  private get inventory(this: InstanceType<ModelType<Camp>>): any {
    return TentModel.find({ camp: this._id });
  }
}

// CampSchema.index(
//   {
//     name: "text",
//     tags: "text",
//     location: "text",
//     shortDescription: "text",
//     terrain: "text"
//   },
//   {
//     weights: {
//       name: 7,
//       location: 6,
//       tags: 3,
//       terrain: 2,
//       shortDescription: 1
//     }
//   }
// );

export var CampModel = new Camp().getModelForClass(Camp);
