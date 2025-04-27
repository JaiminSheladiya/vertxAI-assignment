const express = require("express");
const router = express.Router();
const { getUserActivities } = require("../controllers/activityController");

router.get("/user/:userId", getUserActivities);

module.exports = router;
