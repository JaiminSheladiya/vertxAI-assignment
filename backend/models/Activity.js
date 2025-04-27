const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String, // e.g., 'save', 'report', 'login', etc.
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: null },
  timestamp: { type: Date, default: Date.now },
  details: String,
});

module.exports = mongoose.model("Activity", activitySchema);
