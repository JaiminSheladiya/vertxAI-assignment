const Activity = require("../models/Activity");

const getUserActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .limit(20)
      .populate("postId", "title");

    res.status(200).json(activities);
  } catch (err) {
    console.error("Error fetching user activity:", err);
    res.status(500).json({ message: "Failed to fetch activity", error: err });
  }
};

module.exports = {
  getUserActivities,
};
