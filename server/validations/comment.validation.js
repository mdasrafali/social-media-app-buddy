const Joi = require('joi');

const createCommentSchema = Joi.object({
  content: Joi.string().trim().min(1).max(1000).required().messages({
    'string.empty': 'Comment content is required',
    'string.max': 'Comment cannot exceed 1000 characters',
  }),
  // Optional — if present this creates a reply; if absent it's a top-level comment
  parentCommentId: Joi.string()
    .pattern(/^[a-f\d]{24}$/i, 'ObjectId')
    .allow(null)
    .default(null),
});

module.exports = { createCommentSchema };
