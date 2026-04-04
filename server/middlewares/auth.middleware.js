const { verifyAccessToken } = require('../utils/jwt.utils');
const { sendError } = require('../utils/apiResponse');

/**
 * Protects routes by verifying the Bearer access token.
 * Attaches `req.user = { id, email }` on success.
 *
 * We deliberately do NOT hit the database here — access tokens are
 * short-lived (15 min) so stateless verification is safe and fast.
 * If you need to invalidate access tokens before expiry, swap this for
 * a Redis-backed token blocklist check.
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authentication required', 401, 'MISSING_TOKEN');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 'Access token expired', 401, 'TOKEN_EXPIRED');
    }
    return sendError(res, 'Invalid token', 401, 'INVALID_TOKEN');
  }
};

module.exports = { protect };
