const Joi = require("joi");

const ShowTimeCreateDTO = Joi.object({
  movie: Joi.string().required(),
  //theater: Joi.string().min(2).max(100).required(),
  screen: Joi.string().min(1).max(50).required(),
  date: Joi.date().required(),
  startTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.pattern.base": "startTime must be in HH:mm format",
    }),
  endTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.pattern.base": "endTime must be in HH:mm format",
    }),
  language: Joi.string().default("English"),
  status: Joi.string()
    .valid("active", "inactive")
    .default("active"),
});

const ShowTimeUpdateDTO = Joi.object({
  movie: Joi.string().optional(),
 // theater: Joi.string().min(2).max(100).optional(),
  screen: Joi.string().min(1).max(50).optional(),
  date: Joi.date().optional(),
  startTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional()
    .messages({
      "string.pattern.base": "startTime must be in HH:mm format",
    }),
  endTime: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .optional()
    .messages({
      "string.pattern.base": "endTime must be in HH:mm format",
    }),
  language: Joi.string().optional(),
  status: Joi.string()
    .valid("active", "inactive")
    .optional(),
});

module.exports = {
  ShowTimeCreateDTO,
  ShowTimeUpdateDTO,
};