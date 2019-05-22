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
import { ObjectType, Field } from "type-graphql";

class BankAccount {
  @prop()
  public beneficiary?: string;

  @prop()
  public accountType?: string;

  @prop()
  public accountNumber?: string;

  @prop()
  public IFSCCode?: string;
}

class Amenities {
  @prop({
    default: false
  })
  public washRoomAttached!: boolean;

  @prop({ default: false })
  public bonfire!: boolean;

  @prop({ default: false })
  public hotWater!: boolean;

  @prop({ default: false })
  public mobileConnectivity!: boolean;

  @prop({ default: false })
  public mealsInclude!: boolean;

  @prop({ default: false })
  public petsAllowed!: boolean;

  @prop({ default: false })
  public chargingPoints!: boolean;
}

class NearbyActivities {
  @prop({ default: false })
  public waterRafting?: boolean;

  @prop({ default: false })
  public kayaking?: boolean;

  @prop({ default: false })
  public skiing?: boolean;

  @prop({ default: false })
  public waterfallRappelling?: boolean;

  @prop({ default: false })
  public skydiving?: boolean;

  @prop({ default: false })
  public scubaDiving?: boolean;

  @prop({ default: false })
  public hotAirBallon?: boolean;

  @prop({ default: false })
  public caving?: boolean;

  @prop({ default: false })
  public trekking?: boolean;

  @prop({ default: false })
  public snorkelling?: boolean;

  @prop({ default: false })
  public cliffJumping?: boolean;

  @prop({ default: false })
  public paragliding?: boolean;

  @prop({ default: false })
  public cycling?: boolean;
}

class Coordinates {
  @prop()
  public lat?: string;

  @prop()
  public long?: string;
}

class Terrain {
  @prop()
  public glacier?: boolean;

  @prop()
  public forest?: boolean;

  @prop()
  public desert?: boolean;

  @prop()
  public ocean?: boolean;

  @prop()
  public hill?: boolean;

  @prop()
  public river?: boolean;
}

@ObjectType()
@index({
  name: "text",
  shortDescription: "text",
  tags: "text",
  location: "text",
  terrain: "text"
})
export class Camp extends Typegoose {
  @Field()
  public id?: string;

  @Field()
  @prop({ required: true })
  public name!: string;

  @Field()
  @prop({
    validate: [
      validate({
        validator: "isMobilePhone",
        message: "Not a valid phone number",
        arguments: ["any", true]
      })
    ]
  })
  public phoneNumber?: string;

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
  public email!: string;

  @prop()
  public image?: string[];

  @prop()
  public heroImage?: string;

  @prop({ unique: true, required: true })
  public url!: string;

  @prop()
  public location?: string;

  @prop({ required: true, default: false })
  public isAvailable!: boolean;

  @prop({ required: true })
  public shortDescription!: string;

  @prop()
  public longDescription?: string;

  @prop({ required: true, default: false })
  public agreementAccepted!: boolean;

  @prop({ unique: true, default: (): string => nanoid(20), required: true })
  public gst!: string;

  @prop()
  public bank?: BankAccount;

  @prop({
    validate: (val): boolean => val.length <= 10
  })
  public tags?: string[];

  @prop()
  public amenities?: Amenities;

  @prop()
  public razorpayAccountId?: string;

  @prop()
  public razorpayCustomerId?: string;

  @prop()
  public services?: string[];

  @prop()
  public nearByActivities?: NearbyActivities;

  @prop()
  public temperature?: string;

  @prop()
  public temperatureSummary?: string;

  @prop()
  public altitude?: string;

  @prop()
  public hourDriveFromDelhi?: Date;

  @prop()
  public coordinates?: Coordinates;

  @prop({ ref: User, unique: true })
  public ownerId!: Ref<User>;

  @prop()
  public terrain?: Terrain;

  @prop()
  public campDocuments?: string[];

  @prop({ default: 0 })
  public averageRating!: number;

  @prop({ default: 0 })
  public ratingsCount!: number;

  @prop({ default: 0 })
  public credits!: number;

  @prop()
  public get inventory(this: InstanceType<ModelType<Camp>>): any {
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
