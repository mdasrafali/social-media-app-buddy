const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User schema.
 *
 * Design decisions:
 * - avatar stored as URL (Cloudinary/S3), never as binary data.
 * - password is excluded from default queries via `select: false` so it is
 *   never accidentally serialised into API responses.
 * - We store a lean denormalised snapshot (firstName, lastName, avatar) on
 *   posts/comments to avoid expensive joins when rendering the feed.
 */
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name cannot exceed 50 characters'],
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // never returned in queries by default
    },
    avatar: {
      type: String,
      default: null, // URL from Cloudinary/S3
    },
    bio: {
      type: String,
      maxlength: [300, 'Bio cannot exceed 300 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
    // Virtual `fullName` so callers never have to concatenate manually
    virtuals: {
      fullName: {
        get() {
          return `${this.firstName} ${this.lastName}`;
        },
      },
    },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// email already has a unique index from `unique: true` above.

// ─── Pre-save hook ────────────────────────────────────────────────────────────
userSchema.pre('save', async function (next) {
  // Only re-hash when the password field was actually changed
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ─── Instance methods ─────────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/** Returns a lean public snapshot safe to embed in posts/comments. */
userSchema.methods.toPublicProfile = function () {
  return {
    _id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    avatar: this.avatar,
  };
};

module.exports = mongoose.model('User', userSchema);
