const mongoose = require('mongoose');

/**
 * RefreshToken schema.
 *
 * Storing refresh tokens in MongoDB (rather than stateless JWTs) gives us
 * revocation capability — critical for "log out all devices" and security
 * incident response. The TTL index auto-deletes expired documents so the
 * collection self-cleans without a cron job.
 */
const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    // Optional: track device/IP for "sessions" UI
    userAgent: { type: String, default: '' },
    ipAddress: { type: String, default: '' },
  },
  { timestamps: true }
);

// TTL index — MongoDB removes the document automatically when expiresAt passes
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
refreshTokenSchema.index({ userId: 1 });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
