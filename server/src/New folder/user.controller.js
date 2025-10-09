const User = require("../models/user.model");
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/apiError");

const createUser = expressAsyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    return next(new ApiError(`email is already exist`, 400));
  }

  const createTheUser = await User.create(req.body);

  res.status(201).json({ status: "success", data: createTheUser });
});

const getAllUser = expressAsyncHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({ status: "success", data: users });
});

const getUser = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new ApiError(`User not found`, 404));
  }
  res.status(200).json({ status: "success", user });
});

const updateUser = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }

  const user = await User.findByIdAndUpdate(id, req.body, { new: true });

  if (!user) {
    return next(new ApiError(`User not found`, 404));
  }
  res
    .status(200)
    .json({ status: "success", message: "Updated successfully", user });
});

const deleteUser = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return next(new ApiError(`User not found`, 404));
  }
  res.status(200).json({ status: "success", message: "Deleted successfully" });
});

module.exports = {
  createUser,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
};
