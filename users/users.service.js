const User = require("../models/user.schema");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!req.imagevalidtype && !req.file) {
      return res.status(400).json({ message: "Invalid file type" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const newUser = new User({
      username,
      email,
      password,
      avatar: req?.destination + "/" + req?.file?.filename,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
      .populate("followers", "username avatar") // populate followers
      .populate("following", "username avatar"); // populate following
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    // req.user is added by verifyToken middleware
    const user = await User.findById(req.user?._id)
      .populate("followers", "username avatar") // populate followers
      .populate("following", "username avatar"); // populate following
    res.status(200).json({ user: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleFollow = async (req, res) => {
  try {
    const targetUserId = req.params.userId; // الشخص اللي هتابعه
    const currentUserId = req.user._id; // المستخدم الحالي

    if (targetUserId.toString() === currentUserId.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // UNFOLLOW
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);
    } else {
      // FOLLOW
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);
    }

    await currentUser.save();
    await targetUser.save();

    res.status(200).json({
      success: true,
      following: !isFollowing,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
