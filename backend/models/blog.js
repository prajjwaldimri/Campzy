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
  authorId: {
    type: String,
  },
});

BlogSchema.index({
  name: 'text',
});

module.exports = mongoose.model('Blog', BlogSchema);
