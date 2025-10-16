const User = require("../models/user.model");
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const ApiError = require("../utils/apiError");
//added for login
const loginUser = expressAsyncHandler(async (req, res, next) => {
  const {email, password} = req.body

  const user = await User.findOne({email}).select("+password")
  if(!user){
    return next(new ApiError("invalid email or password", 401))
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch){
    return next(new ApiError("invalid email or password", 401))
  }

  const token = jwt.sign({userId: user._id}, process.env.SECRET_TOKEN, {expiresIn: "7d"})
  // const token = jwt.sign({userId: user._id}, process.env.SECRET_TOKEN, {expiresIn: "7d"})


  res.status(200).json({
    status: "success",
    message: "login successful",
    token, 
    user: {
      _id: user._id,
      name: user.name,
      email: user.email, 
      role: user.role,
    }
  })
})

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
  loginUser,
};
