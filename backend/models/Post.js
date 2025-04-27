const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  source: {
    type: String, // 'twitter' or 'reddit'
    required: true,
  },
  data: {
    type: Object, // Store the post data (tweet/reddit post)
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Add reported field to track report count or users who reported
  reported: {
    type: Number,
    default: 0, // A simple counter to count the number of reports for the post
  },
  saved: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Post", PostSchema);
