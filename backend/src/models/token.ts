import mongoose, { Schema, Document } from "mongoose";

export interface Token extends Document {
  _userId: string;
  tokenValue: string;
}

const TokenSchema = new Schema({
  _userId: { type: Schema.Types.ObjectId, required: true },
  tokenValue: { type: String, required: true },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 18000
  }
});

export var TokenModel = mongoose.model<Token>("Token", TokenSchema);
