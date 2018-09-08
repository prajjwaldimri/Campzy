const mongoose = require('mongoose');

const { Schema } = mongoose;

const BlogSchema = new Schema({
  title: { type: String, required: true },
  url: {
    type: String,
    required: true,
    unique: true,
  },
  description: { type: String, required: true },
  content: { type: String, required: true },
  heroImage: { type: String, required: true },
  authorId: {
    type: Schema.Types.ObjectId,
  },
});

module.exports = mongoose.model('Blog', BlogSchema);
