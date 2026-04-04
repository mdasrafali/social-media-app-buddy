const { sendError } = require('../utils/apiResponse');

/**
 * Factory that returns an Express middleware which validates `req.body`
 * against the provided Joi schema.
 *
 * Usage: router.post('/register', validate(registerSchema), authController.register)
 *
 * - `abortEarly: false` collects ALL validation errors in one pass so the
 *   client gets a complete picture instead of fixing one error at a time.
 * - `stripUnknown: true` silently removes fields not in the schema, which
 *   prevents mass-assignment vulnerabilities.
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const message = error.details.map((d) => d.message).join('; ');
    return sendError(res, message, 422, 'VALIDATION_ERROR');
  }

  // Replace req.body with the validated + sanitised version
  req.body = value;
  next();
};

module.exports = { validate };
