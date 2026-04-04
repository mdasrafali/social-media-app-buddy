const mongoose = require('mongoose');

/**
 * Comment schema — handles both top-level comments AND replies.
 *
 * Design decisions:
 * - `parentCommentId: null`  → top-level comment
 * - `parentCommentId: <id>`  → reply to that comment
 * - We deliberately avoid deep nesting (no sub-documents) because:
 *     1. Mongo documents have a 16MB limit.
 *     2. Nested nesting makes pagination and individual updates expensive.
 *   One flat collection with a parentCommentId pointer is the standard
 *   pattern used by Facebook/Twitter at scale.
 * - `depth` field is kept for future UI use (indent level) and to prevent
 *   nesting beyond 2 levels in the service layer.
 * - Denormalised author snapshot (same rationale as Post).
 * - Likes follow the same counter + array pattern as Post.
 */
const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    parentCommentId: {
      // null = top-level comment, ObjectId = reply
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
    depth: {
      // 0 = comment, 1 = reply. Enforced in service layer (max 1).
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    author: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      avatar: { type: String, default: null },
    },
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    likes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: [],
      select: false,
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    repliesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Primary access pattern: fetch all top-level comments for a post, newest first
commentSchema.index({ postId: 1, parentCommentId: 1, createdAt: -1 });

// Fetch replies for a specific comment
commentSchema.index({ parentCommentId: 1, createdAt: 1 });

module.exports = mongoose.model('Comment', commentSchema);
