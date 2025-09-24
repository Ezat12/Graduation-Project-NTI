const Category = require("../models/category");
const AppError = require("../utils/apiError");
const asyncHandler = require("express-async-handler");

exports.createCategory = asyncHandler(async (req, res, next) => {
  const category = new Category(req.body);
  await category.save();

  res.status(201).json({
    message: "Category created successfully",
    data: { category },
  });
});

exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();

  if (!categories) {
    return next(new AppError("No categories found", 404));
  }

  res.status(200).json({
    message: "success",
    results: categories.length,
    data: { categories },
  });
});

exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    message: "success",
    data: { category },
  });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {new: true,runValidators: true,});

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    message: "Category updated successfully",
    data: { category },
  });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  res.status(200).json({
    message: "Category deleted successfully",
  });
});