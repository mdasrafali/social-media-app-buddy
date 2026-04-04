const logger = require('../utils/logger');

/**
 * Global error handler — must be registered LAST in app.js.
 *
 * Express recognises it as an error handler because it has 4 parameters.
 * All unhandled errors propagate here via next(err).
 *
 * Design notes:
 * - Mongoose validation errors → 422
 * - Mongoose duplicate key (code 11000) → 409
 * - JWT errors are handled inline in auth.middleware but re-caught here too
 * - Everything else → 500, with the real message hidden in production
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join('; ');
  }

  // MongoDB duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Log server errors with full stack; client errors at warn level
  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.path} → ${statusCode}: ${err.stack || message}`);
  } else {
    logger.warn(`${req.method} ${req.path} → ${statusCode}: ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal server error'
      : message,
  });
};

/** Catches async errors thrown inside route handlers without try/catch boilerplate. */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { errorHandler, asyncHandler };
