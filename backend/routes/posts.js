const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const Activity = require("../models/Activity");
const router = express.Router();
router.get("/reddit", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const totalPosts = await Post.countDocuments({ source: "reddit" });
    const posts = await Post.find({ source: "reddit" })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({ posts, totalPosts, page, limit });
  } catch (error) {
    console.error("Error fetching Reddit posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/twitter", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const totalPosts = await Post.countDocuments({ source: "twitter" });
    const posts = await Post.find({ source: "twitter" })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({ posts, totalPosts, page, limit });
  } catch (error) {
    console.error("Error fetching Twitter posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// Route for saving or unsaving a post
router.post("/save-post", async (req, res) => {
  const { userId, postId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the post is already saved
    if (user.savedPosts.includes(postId)) {
      // If it's saved, unsave it
      user.savedPosts = user.savedPosts.filter(
        (id) => id.toString() !== postId.toString()
      );
      if (post.saved > 0) {
        post.saved -= 1; // Decrease the saved count, but don't go below 0
      }
      await post.save();
      await user.save();

      return res
        .status(200)
        .json({ message: "Post unsaved successfully", user });
    } else {
      // If not saved, save it
      user.savedPosts.push(postId);
      post.saved += 1;
      user.credits += 2;
      await post.save();
      await user.save();
      await Activity.create({
        userId,
        type: "save",
        postId,
        details: "User saved a post",
      });
      return res.status(200).json({ message: "Post saved successfully", user });
    }
  } catch (error) {
    res.status(500).json({ message: "Error saving or unsaving post", error });
  }
});

// Route for reporting or unreporting a post
router.post("/report-post", async (req, res) => {
  const { postId, userId } = req.body;

  try {
    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the post is already reported
    if (user.reportedPosts.includes(postId)) {
      // If it's reported, unreport it
      user.reportedPosts = user.reportedPosts.filter(
        (id) => id.toString() !== postId.toString()
      );
      if (post.reported > 0) {
        post.reported -= 1;
      }
      await post.save();
      await user.save();

      return res
        .status(200)
        .json({ message: "Post unreported successfully", user });
    } else {
      // If not reported, report it
      user.reportedPosts.push(postId);
      post.reported += 1; // Increase the reported count
      user.credits += 5;
      await post.save();
      await user.save();
      await Activity.create({
        userId,
        type: "report",
        postId,
        details: "User reported a post",
      });
      return res
        .status(200)
        .json({ message: "Post reported successfully", user });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error reporting or unreporting post", error });
  }
});

module.exports = router;
