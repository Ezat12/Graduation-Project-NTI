const { Joi } = require("express-validation");

exports.createCategoryValidation = {
  body: Joi.object({
    name: Joi.string().min(3).max(50).required(),
    description: Joi.string().max(400),
  }),
};

exports.updateCategoryValidation = {
  body: Joi.object({
    name: Joi.string().min(3).max(50),
    description: Joi.string().max(400),
  }),
};