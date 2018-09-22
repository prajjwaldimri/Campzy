const mongoose = require('mongoose');

const { Schema } = mongoose;
const ReviewSchema = new Schema({
  stars: { type: Number, required: true },
  comment: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  camp: { type: Schema.Types.ObjectId, ref: 'Camp' },
});

module.exports = mongoose.model('Review', ReviewSchema);