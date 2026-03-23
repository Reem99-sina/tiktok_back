// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { generateCode } = require("../utils/common");
const sendEmail = require("../utils/sendEmail");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default: "" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    password: { type: String, required: true }, // hash in production
    code: String,
    verificationCodeExpires: {
      type: Date,
    },
    confirmed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const code = generateCode();
  const hashedCode = await bcrypt.hash(code, 10);
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  await sendEmail.sendCodeEmail({
    to: this.email,
    code,
  });
  this.code = hashedCode;
  this.verificationCodeExpires = Date.now() + 10 * 60 * 1000;
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
