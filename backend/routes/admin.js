const express = require("express");
const router = express.Router();
const {
  getAnalytics,
  getActivities,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/adminController");

router.get("/analytics", getAnalytics);

router.get("/activities", getActivities);

router.get("/users", getUsers);

router.put("/users/:id", updateUser);

router.delete("/users/:id", deleteUser);

module.exports = router;
