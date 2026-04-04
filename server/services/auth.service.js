const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt.utils');

/**
 * Converts a human-readable duration string (e.g. "7d", "15m") to a JS Date.
 * We use this to set the `expiresAt` field on RefreshToken documents.
 * Supports s/m/h/d suffixes only (no need for a full `ms` package).
 */
const expiresAtFromDuration = (duration) => {
  const units = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error(`Invalid duration format: ${duration}`);
  const ms = parseInt(match[1], 10) * units[match[2]];
  return new Date(Date.now() + ms);
};

// ─── Register ─────────────────────────────────────────────────────────────────

const register = async ({ firstName, lastName, email, password }) => {
  // Duplicate email check — gives a friendlier error than the Mongo 11000 code
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error('Email already registered');
    err.statusCode = 409;
    throw err;
  }

  const user = await User.create({ firstName, lastName, email, password });
  return user.toPublicProfile();
};

// ─── Login ────────────────────────────────────────────────────────────────────

const login = async ({ email, password }, { userAgent = '', ipAddress = '' } = {}) => {
  // `select('+password')` overrides the `select: false` on the schema field
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const tokenPayload = { id: user._id.toString(), email: user.email };
  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken(tokenPayload);

  // Persist the refresh token so it can be revoked
  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: expiresAtFromDuration(process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
    userAgent,
    ipAddress,
  });

  return {
    user: user.toPublicProfile(),
    accessToken,
    refreshToken,
  };
};

// ─── Refresh ──────────────────────────────────────────────────────────────────

const refreshAccessToken = async (refreshToken) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    const err = new Error('Invalid or expired refresh token');
    err.statusCode = 401;
    throw err;
  }

  // Confirm the token is still in DB (not revoked)
  const stored = await RefreshToken.findOne({ token: refreshToken });
  if (!stored) {
    const err = new Error('Refresh token revoked');
    err.statusCode = 401;
    throw err;
  }

  const newAccessToken = signAccessToken({ id: decoded.id, email: decoded.email });
  return { accessToken: newAccessToken };
};

// ─── Logout ───────────────────────────────────────────────────────────────────

const logout = async (refreshToken) => {
  await RefreshToken.deleteOne({ token: refreshToken });
};

/** Revoke all sessions for a user — "log out all devices". */
const logoutAll = async (userId) => {
  await RefreshToken.deleteMany({ userId });
};

module.exports = { register, login, refreshAccessToken, logout, logoutAll };
