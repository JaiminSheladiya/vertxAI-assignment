const express = require("express");
const router = express.Router();
const {
  getRedditPosts,
  getTwitterPosts,
  savePost,
  reportPost,
  getUserSavedPosts,
} = require("../controllers/postController");

router.get("/reddit", getRedditPosts);

router.get("/twitter", getTwitterPosts);

router.post("/save-post", savePost);

router.post("/report-post", reportPost);

router.get("/saved-posts", getUserSavedPosts);

module.exports = router;
