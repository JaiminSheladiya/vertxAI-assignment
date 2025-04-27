const User = require("../models/User");
const Post = require("../models/Post");
const Activity = require("../models/Activity");

const getAnalytics = async (req, res) => {
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
};

const getActivities = async (req, res) => {
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
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

const updateCredits = async (req, res) => {
  try {
    const { credits } = req.body;
    console.log('credits: ', credits);
    const cr = +credits
    if (typeof cr !== "number" || credits < 0) {
      return res.status(400).json({ message: "Invalid credits value" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { credits : cr },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Credits updated", user });
  } catch (err) {
    console.error("Failed to update credits:", err);
    res.status(500).json({ message: "Failed to update credits", error: err });
  }
};


module.exports = {
  getAnalytics,
  getActivities,
  getUsers,
  updateUser,
  deleteUser,
  updateCredits,
};
