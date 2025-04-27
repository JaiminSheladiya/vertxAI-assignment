const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");
const Activity = require("../models/Activity");

// Admin analytics route
router.get("/analytics", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalReportedPosts = await Post.countDocuments({
      reported: { $gt: 0 },
    });
    const totalSavedPosts = await Post.aggregate([
      { $group: { _id: null, total: { $sum: "$saved" } } },
    ]);

    res.json({
      totalUsers,
      totalPosts,
      totalReportedPosts,
      totalSavedPosts: totalSavedPosts[0]?.total || 0,
    });
  } catch (err) {
    console.error("Admin analytics error:", err);
    res.status(500).json({ message: "Failed to fetch analytics", error: err });
  }
});

router.get("/activities", async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ timestamp: -1 })
      .limit(50)
      .populate("userId", "username")
      .populate("postId", "title");

    res.status(200).json(activities);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch activities", error: err });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

module.exports = router;
