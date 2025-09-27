const cloudinary = require("cloudinary");
const fs = require("fs");
const ApiError = require("../utils/apiError");
const expressAsyncHandler = require("express-async-handler");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

exports.clodinaryUpload = expressAsyncHandler(async (req, res, next) => {
  if (!req.files || !req.files.file) {
    return next(new ApiError("No File to upload", 400));
  }

  // console.log(req.file);
  // console.log(req.files);

  const uploadResult = await cloudinary.uploader.upload(
    req.files.file[0].path,
    {
      resource_type: "auto",
    }
  );

  // Clean up: Delete the temporary file after upload
  fs.unlinkSync(req.files.file[0].path);

  res.status(200).json({ status: "success", data: uploadResult });
});

exports.cloudinaryBulkUpload = expressAsyncHandler(async (req, res, next) => {
  if (!req.files || !req.files.files) {
    return next(new ApiError("No File to upload", 400));
  }

  const files = req.files.files;
  const imagesUploads = await Promise.all(
    files.map(async (image) => {
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "auto",
      });
      fs.unlinkSync(image.path);
      return result;
    })
  );

  res.status(200).json({ status: "success", data: imagesUploads });
});
