const cloudinary = require("cloudinary").v2;
const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

exports.cloudinaryUpload = expressAsyncHandler(async (req, res, next) => {
  if (!req.files || !req.files.file || req.files.file.length === 0) {
    return next(new ApiError("No file to upload", 400));
  }

  const file = req.files.file[0];
  console.log("Uploading file:", {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
  });

  try {
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "community_media" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    res.status(200).json({
      status: "success",
      data: uploadResult,
    });
  } catch (error) {
    return next(new ApiError(`Upload failed: ${error.message}`, 400));
  }
});

exports.cloudinaryBulkUpload = expressAsyncHandler(async (req, res, next) => {
  if (!req.files || !req.files.files || req.files.files.length === 0) {
    return next(new ApiError("No files to upload", 400));
  }

  const files = req.files.files;
  try {
    const imagesUploads = await Promise.all(
      files.map(async (file) => {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "auto", folder: "community_media" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        return result;
      })
    );

    res.status(200).json({
      status: "success",
      data: imagesUploads,
    });
  } catch (error) {
    return next(new ApiError(`Bulk upload failed: ${error.message}`, 400));
  }
});
