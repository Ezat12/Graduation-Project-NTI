const Joi = require("joi");
const hide = require('../utils');

const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      throw new hide(error.details[0].message, 400); 
    }
    next();
  };
};

module.exports = { validateBody };
