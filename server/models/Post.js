const mongoose = require('mongoose');

/**
 * Post schema.
 *
 * Design decisions:
 * - `author` stores both the ObjectId (for relational integrity) AND a lean
 *   denormalised snapshot (name + avatar). This eliminates a join on every
 *   feed render and is acceptable because user profile changes are infrequent.
 * - Visibility is 'public' | 'private'. The service layer enforces privacy.
 * - `likesCount` is a counter kept in sync by the like service. Storing the
 *   count directly avoids counting the likes array on every read.
 * - Likes are stored as an array of userIds on the document so we can
 *   efficiently check "has this user liked?" with a single $in query.
 *   At scale (millions of likes per post) you'd extract this to a separate
 *   Likes collection — the service layer already abstracts that boundary.
 * - Image stored as URL only (Cloudinary/S3).
 */
const postSchema = new mongoose.Schema(
  {
    author: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      // Denormalised snapshot — update via a background job when user changes profile
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      avatar: { type: String, default: null },
    },
    content: {
      type: String,
      trim: true,
      maxlength: [2000, 'Post content cannot exceed 2000 characters'],
    },
    imageUrl: {
      type: String,
      default: null, // URL from Cloudinary/S3
    },
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
    likes: {
      // Array of user ObjectIds who liked this post
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: [],
      select: false, // exclude from default queries; fetch explicitly when needed
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Feed query: filter by visibility + sort by newest first
postSchema.index({ 'author._id': 1, createdAt: -1 });
postSchema.index({ visibility: 1, createdAt: -1 });

// Cursor-based pagination uses _id or createdAt — both need to be fast
postSchema.index({ createdAt: -1 });

// Validation: a post must have at least text or an image
postSchema.pre('validate', function (next) {
  if (!this.content && !this.imageUrl) {
    this.invalidate('content', 'A post must have text or an image');
  }
  next();
});

module.exports = mongoose.model('Post', postSchema);
