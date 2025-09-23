const Joi = require('joi');

const objectId = Joi.string().hex().length(24);

exports.addSchema = Joi.object({
  userId: objectId.required(),
  courses: Joi.array().items(objectId).min(1).required(),
});

exports.removeSchema = Joi.object({
  userId: objectId.required(),
  courseId: objectId.required(),
});
