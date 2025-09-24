const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const ApiError = require("../utils/apiError");
const expressAsyncHandler = require("express-async-handler");

const getToken = (id) => {
  return jwt.sign({ userId: id }, process.env.SECRET_TOKEN, {
    expiresIn: process.env.EXPIRED_TOKEN,
  });
};

const signUp = expressAsyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const newUser = await User.create({ name, email, password });

  const token = getToken(newUser._id);

  res.status(201).json({ status: "success", user: newUser, token });
});

const login = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ApiError("Incorrect email or password", 400));
  }

  console.log(user);

  const isMach = await bcrypt.compare(password, user.password);

  if (!isMach) {
    return next(new ApiError("Incorrect email or password", 400));
  }

  const token = getToken(user._id);

  res.status(200).json({ status: "success", user, token });
});

const changePassword = expressAsyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new ApiError("Current and new passwords are required", 400));
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return next(new ApiError("Current password is incorrect", 400));
  }

  user.password = newPassword;
  await user.save();

  const token = getToken(user._id);

  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
    token,
  });
});

const getProfile = expressAsyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  res.status(200).json({ status: "success", data: user });
});

module.exports = {
  signUp,
  login,
  changePassword,
  getProfile,
};
