const mongoose = require('mongoose');

const { Schema } = mongoose;

const BlogSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: {
    type: String,
    required: true,
    unique: true,
  },
  content: { type: String, required: true },
  heroImage: { type: String, required: true },
  heroImageCaption: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  authorId: {
    type: String,
    ref: 'User',
  },
});

BlogSchema.index({
  name: 'text',
});

module.exports = mongoose.model('Blog', BlogSchema);
