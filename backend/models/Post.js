const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  reported: {
    type: Number,
    default: 0,
  },
  saved: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Post", PostSchema);
