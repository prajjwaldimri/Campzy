const mongoose = require('mongoose');

const { Schema } = mongoose;
const TokenSchema = new Schema({
  _userId: { type: Schema.Types.ObjectId, required: true },
  tokenValue: { type: String, required: true },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 18000,
  },
});

module.exports = mongoose.model('Token', TokenSchema);
