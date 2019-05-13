import mongoose, { Schema, Document } from "mongoose";
import validate from "mongoose-validator";
import nanoid from "nanoid";

export interface Camp extends Document {
  name: string;
  phoneNumber: string;
  email: string;
  ownerId: {
    name: string;
  };
  location: string;
}

const CampSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    validate: [
      validate({
        validator: "isMobilePhone",
        message: "Not a valid phone number",
        arguments: ["any", true]
      })
    ]
  },
  email: {
    type: String,
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
  },
  images: [String],
  heroImage: String,
  url: {
    type: String,
    unique: true
  },
  location: {
    type: String
  },
  isAvailable: {
    type: Boolean,
    required: true,
    default: false
  },
  shortDescription: {
    type: String,
    required: true
  },
  longDescription: String,
  agreementAccepted: {
    type: Boolean,
    required: true,
    default: false
  },
  gst: {
    type: String,
    unique: true,
    default: (): string => nanoid(20),
    required: true
  },
  bank: {
    beneficiary: String,
    accountType: String,
    accountNumber: String,
    IFSCCode: String
  },
  tags: {
    type: [String],
    validate: [(val): boolean => val.length <= 10, "Only 10 tags are allowed"]
  },
  amenities: {
    washRoomAttached: {
      type: Boolean,
      default: false
    },
    bonfire: {
      type: Boolean,
      default: false
    },
    hotWater: {
      type: Boolean,
      default: false
    },
    mobileConnectivity: {
      type: Boolean,
      default: false
    },
    mealsInclude: {
      type: Boolean,
      default: false
    },
    petsAllowed: {
      type: Boolean,
      default: false
    },
    chargingPoints: {
      type: Boolean,
      default: false
    }
  },
  razorpayAccountId: String,
  razorpayCustomerId: String,
  services: {
    type: [String]
  },
  nearByActivities: {
    waterRafting: {
      type: Boolean,
      default: false
    },
    kayaking: {
      type: Boolean,
      default: false
    },
    skiing: {
      type: Boolean,
      default: false
    },
    waterfallRappelling: {
      type: Boolean,
      default: false
    },
    skydiving: {
      type: Boolean,
      default: false
    },
    scubaDiving: {
      type: Boolean,
      default: false
    },
    hotAirBallon: {
      type: Boolean,
      default: false
    },
    caving: {
      type: Boolean,
      default: false
    },
    trekking: {
      type: Boolean,
      default: false
    },
    snorkelling: {
      type: Boolean,
      default: false
    },
    cliffJumping: {
      type: Boolean,
      default: false
    },
    paragliding: {
      type: Boolean,
      default: false
    },
    cycling: {
      type: Boolean,
      default: false
    }
  },
  temperature: {
    type: String
  },
  temperatureSummary: {
    type: String
  },
  altitude: {
    type: String
  },
  hourDriveFromDelhi: {
    type: Date
  },
  coordinates: {
    lat: {
      type: String
    },
    lng: {
      type: String
    }
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    unique: true
  },
  terrain: {
    glacier: Boolean,
    forest: Boolean,
    desert: Boolean,
    ocean: Boolean,
    hill: Boolean,
    river: Boolean
  },
  campDocuments: [String],
  averageRating: {
    type: Number,
    default: 0
  },
  ratingsCount: {
    type: Number,
    default: 0
  },
  credits: {
    type: Number,
    default: 0
  }
});

CampSchema.virtual("inventory", {
  ref: "Tent",
  localField: "_id",
  foreignField: "camp"
});

CampSchema.index(
  {
    name: "text",
    tags: "text",
    location: "text",
    shortDescription: "text",
    terrain: "text"
  },
  {
    weights: {
      name: 7,
      location: 6,
      tags: 3,
      terrain: 2,
      shortDescription: 1
    }
  }
);

module.exports = mongoose.model<Camp>("Camp", CampSchema);
