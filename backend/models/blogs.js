const mongoose = require('mongoose');

const { Schema } = mongoose;

const BlogSchema = new Schema({
  title: { type: String, required: true },
  url: {
    type: String,
    required: true,
    unique: true,
  },
  content: { type: String, required: true },
  heroImage: { type: String, unique: true, required: true },
  authorId: {
    type: String,
    unique: true,
  },
});

module.exports = mongoose.model('Blog', BlogSchema);
