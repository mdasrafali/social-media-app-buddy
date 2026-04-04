const Joi = require('joi');

const createPostSchema = Joi.object({
  content: Joi.string().trim().max(2000).allow('', null),
  imageUrl: Joi.string().uri().allow('', null),
  visibility: Joi.string().valid('public', 'private').default('public'),
}).or('content', 'imageUrl'); // at least one of the two must be present

const updatePostSchema = Joi.object({
  content: Joi.string().trim().max(2000).allow('', null),
  imageUrl: Joi.string().uri().allow('', null),
  visibility: Joi.string().valid('public', 'private'),
}).min(1); // at least one field must be sent

module.exports = { createPostSchema, updatePostSchema };
