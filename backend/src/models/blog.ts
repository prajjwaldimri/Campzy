import mongoose from "mongoose";

const { Schema } = mongoose;

const BlogSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    url: {
      type: String,
      required: true,
      unique: true
    },
    content: { type: String, required: true },
    heroImage: { type: String, required: true },
    heroImageCaption: { type: String, required: true },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    darkTheme: { type: Boolean, default: false }
  },
  { timestamps: true }
);

BlogSchema.index({
  name: "text"
});

module.exports = mongoose.model("Blog", BlogSchema);
