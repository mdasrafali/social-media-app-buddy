const mongoose = require('mongoose');

/**
 * Story schema.
 *
 * Design decisions:
 * - Stories expire after 24 hours — MongoDB TTL index auto-deletes them.
 * - imageUrl is required (a story without an image makes no sense here).
 * - Denormalised author snapshot, same pattern as Post/Comment.
 * - `viewers` tracks who has seen the story (ObjectId array).
 */
const storySchema = new mongoose.Schema(
  {
    author: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      firstName: { type: String, required: true },
      lastName:  { type: String, required: true },
      avatar:    { type: String, default: null },
    },
    imageUrl: {
      type: String,
      required: [true, 'Story image is required'],
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
    viewers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      default: [],
      select: false,
    },
  },
  { timestamps: true }
);

// TTL index — MongoDB removes the document when expiresAt passes
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Fast lookup: all active stories sorted newest first
storySchema.index({ 'author._id': 1, createdAt: -1 });

module.exports = mongoose.model('Story', storySchema);
