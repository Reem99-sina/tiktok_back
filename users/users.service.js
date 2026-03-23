const User = require("../models/user.schema");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const { generateCode } = require("../utils/common");
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const code = generateCode();
    const hashedCode = await bcrypt.hash(code, 10);
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
      code: hashedCode,
      verificationCodeExpires: Date.now() + 10 * 60 * 1000,
    });
    await newUser.save();
    const message = `
      <h3>Email Verification</h3>
      <p>Your verification code is:</p>
      <h2>${code}</h2>
      <p>This code expires in 10 minutes.</p>
    `;

    await sendEmail.sendConfirmationEmail({
      to: email,
      name: `${username}`,
      link: message,
    });
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
    if (!user.confirmed) {
      const code = generateCode();
      const hashedCode = await bcrypt.hash(code, 10);
      await userModel.findOneAndUpdate(
        { email },
        {
          code: hashedCode,
          verificationCodeExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
        },
        { new: true },
      );
      const message = `
      <h3>Email Verification</h3>
      <p>Your verification code is:</p>
      <h2>${code}</h2>
      <p>This code expires in 10 minutes.</p>
    `;

      await sendEmail.sendConfirmationEmail({
        to: email,
        name: `${user.username}`,
        link: message,
      });
      return res.error("Please confirm your email first", null, 400);
    }
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

exports.confirmByCodeReq = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.error("Email and code are required", null, 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.error("User not found", null, 404);
    }

    if (!user.code || !user.verificationCodeExpires) {
      return res.error("No verification code found", null, 400);
    }

    if (Date.now() > user.verificationCodeExpires) {
      return res.error("Verification code expired", null, 400);
    }

    const isValidCode = await bcrypt.compare(code, user.code);

    if (!isValidCode) {
      return res.error("Invalid verification code", null, 400);
    }

    await User.findByIdAndUpdate(
      user._id,
      {
        confirmed: true,
        $unset: {
          code: "",
          verificationCodeExpires: "",
        },
      },
      { new: true },
    );

    return res.success("Email confirmed successfully");
  } catch (error) {
    return res.error("Internal server error", error.message, 500);
  }
};

exports.sendVerifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).select("_id username");
    if (!user) return res.error("User not found", null, 404);

    const code = generateCode();
    const hashedCode = await bcrypt.hash(code, 10);

    await User.findByIdAndUpdate(user._id, {
      $set: {
        code: hashedCode,
        verificationCodeExpires: Date.now() + 10 * 60 * 1000,
      },
    });

    const message = `
      <h3>Email Verification</h3>
      <p>Your new verification code is:</p>
      <h2>${code}</h2>
      <p>This code expires in 10 minutes.</p>
    `;

    await sendEmail.sendConfirmationEmail({
      to: email,
      name: user?.username,
      link: message,
    });

    return res.success("Verification code resent successfully");
  } catch (error) {
    return res.error("Internal server error", error.message, 500);
  }
};