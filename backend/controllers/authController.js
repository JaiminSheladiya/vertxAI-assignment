const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Activity = require("../models/Activity");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashed,
      rewardClaimedToday: true,
      credits: 10,
    });
    await Activity.create({
      userId: user._id,
      type: "signup",
      details: "Account created.",
    });
    res.status(201).json({ token: generateToken(user._id, user.role) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
    const now = new Date();
    const lastLogin = new Date(user.lastLogin);
    const claimedToday =
      lastLogin.getDate() === now.getDate() &&
      lastLogin.getMonth() === now.getMonth() &&
      lastLogin.getFullYear() === now.getFullYear();
    if (!claimedToday) {
      user.credits += 10;
    }
    user.rewardClaimedToday = claimedToday;
    user.lastLogin = now;
    user.lastLogin = new Date();
    await user.save();

    res.json({ token: generateToken(user._id, user.role) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const now = new Date();
    const lastLogin = new Date(user.lastLogin);
    const claimedToday =
      lastLogin.getDate() === now.getDate() &&
      lastLogin.getMonth() === now.getMonth() &&
      lastLogin.getFullYear() === now.getFullYear();
    if (!claimedToday) {
      user.credits += 10;
    }
    user.rewardClaimedToday = claimedToday;
    user.lastLogin = now;
    await user.save();

    res.status(200).json({
      ...user.toObject(),
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Server error" });
  }
};
