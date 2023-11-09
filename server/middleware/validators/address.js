const Joi = require('joi');

exports.create = Joi.object({
  name: Joi.string().required(),
  zipCode: Joi.number().min(1000).max(99999).required(),
  detailAddress: Joi.string().required(),
  recipient: Joi.string().required(),
  phone: Joi.number().required(),
  mainAddress: Joi.boolean().optional(),
});

exports.update = Joi.object({
  name: Joi.string().optional(),
  zipCode: Joi.number().min(10000).max(99999).optional(),
  detailAddress: Joi.string().optional(),
  recipient: Joi.string().optional(),
  phone: Joi.number().optional(),
  mainAddress: Joi.boolean().optional(),
});
