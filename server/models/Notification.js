const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Denormalized actor snapshot — same pattern as Post/Comment author
    actor: {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      avatar: { type: String, default: null },
    },
    type: {
      type: String,
      enum: ['like_post', 'like_comment', 'comment_post', 'reply_comment'],
      required: true,
    },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-delete notifications after 30 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

// Efficient fetch for a user's notifications (newest first)
notificationSchema.index({ recipient: 1, _id: -1 });

// Efficient unread-count query
notificationSchema.index({ recipient: 1, read: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
