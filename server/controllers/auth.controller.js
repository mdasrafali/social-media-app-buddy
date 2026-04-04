const authService = require('../services/auth.service');
const { sendSuccess, sendCreated, sendError } = require('../utils/apiResponse');
const { asyncHandler } = require('../middlewares/error.middleware');

/**
 * Controllers are intentionally thin — they only:
 *   1. Extract data from the request
 *   2. Call the appropriate service
 *   3. Format and send the response
 *
 * All business logic lives in services/.
 */

const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);
  return sendCreated(res, { user }, 'Account created successfully');
});

const login = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body, {
    userAgent: req.get('user-agent'),
    ipAddress: req.ip,
  });

  return sendSuccess(res, { user, accessToken, refreshToken }, 'Login successful');
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const { accessToken } = await authService.refreshAccessToken(refreshToken);
  return sendSuccess(res, { accessToken }, 'Token refreshed');
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  await authService.logout(refreshToken);
  return sendSuccess(res, null, 'Logged out successfully');
});

const logoutAll = asyncHandler(async (req, res) => {
  await authService.logoutAll(req.user.id);
  return sendSuccess(res, null, 'Logged out from all devices');
});

module.exports = { register, login, refresh, logout, logoutAll };
