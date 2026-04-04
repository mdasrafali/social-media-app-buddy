const rateLimit = require('express-rate-limit');
const { sendError } = require('../utils/apiResponse');

/**
 * Rate limiters.
 *
 * Separate limits per concern so legitimate heavy feed readers are not
 * blocked by the strict auth limit (which guards against brute-force).
 */

/** Strict limiter for auth endpoints — prevents brute-force attacks. */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                   // 10 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    sendError(
      res,
      'Too many requests from this IP, please try again after 15 minutes',
      429,
      'RATE_LIMITED'
    );
  },
});

/** General API limiter — protects against scraping / DoS. */
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,                 // 100 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    sendError(res, 'Too many requests, please slow down', 429, 'RATE_LIMITED');
  },
});

module.exports = { authLimiter, apiLimiter };
