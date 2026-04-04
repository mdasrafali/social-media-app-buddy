const Notification = require('../models/Notification');
const User = require('../models/User');

// Human-readable suffix for each notification type
const NOTIFICATION_TEXT = {
  like_post: 'liked your post.',
  like_comment: 'liked your comment.',
  comment_post: 'commented on your post.',
  reply_comment: 'replied to your comment.',
};

/**
 * Create one notification.
 * Silently skips self-notifications (actor === recipient).
 * Always call fire-and-forget: notificationService.createNotification(...).catch(() => {})
 *
 * @param {Object} opts
 * @param {string} opts.recipientId  - who receives the notification
 * @param {string} opts.actorId      - who triggered the action
 * @param {string} opts.type         - notification type enum
 * @param {string} [opts.postId]     - related post (optional)
 * @param {string} [opts.commentId]  - related comment (optional)
 */
const createNotification = async ({ recipientId, actorId, type, postId = null, commentId = null }) => {
  if (recipientId.toString() === actorId.toString()) return; // never notify yourself

  const actor = await User.findById(actorId).select('firstName lastName avatar').lean();
  if (!actor) return;

  await Notification.create({
    recipient: recipientId,
    actor: {
      _id: actor._id,
      firstName: actor.firstName,
      lastName: actor.lastName,
      avatar: actor.avatar || null,
    },
    type,
    postId,
    commentId,
  });
};

/**
 * Get a user's notifications — cursor-based pagination, newest first.
 *
 * @param {string} userId
 * @param {Object} opts
 * @param {string} [opts.cursor]        - _id of last item from previous page
 * @param {number} [opts.limit=20]
 * @param {string} [opts.filter='all']  - 'all' | 'unread'
 */
const getNotifications = async (userId, { cursor = null, limit = 20, filter = 'all' }) => {
  const safeLimit = Math.min(Number(limit) || 20, 50);

  const query = { recipient: userId };
  if (filter === 'unread') query.read = false;
  if (cursor) query._id = { $lt: cursor };

  const notifications = await Notification.find(query)
    .sort({ _id: -1 })
    .limit(safeLimit + 1)
    .lean();

  const hasNextPage = notifications.length > safeLimit;
  if (hasNextPage) notifications.pop();

  return {
    notifications,
    pagination: {
      hasNextPage,
      nextCursor: hasNextPage ? notifications[notifications.length - 1]._id : null,
    },
  };
};

/** Count unread notifications for a user. */
const getUnreadCount = async (userId) => {
  return Notification.countDocuments({ recipient: userId, read: false });
};

/** Mark every unread notification as read for a user. */
const markAllRead = async (userId) => {
  await Notification.updateMany({ recipient: userId, read: false }, { $set: { read: true } });
};

/** Mark a single notification as read (ownership-checked). */
const markOneRead = async (userId, notifId) => {
  await Notification.updateOne(
    { _id: notifId, recipient: userId },
    { $set: { read: true } }
  );
};

module.exports = {
  createNotification,
  getNotifications,
  getUnreadCount,
  markAllRead,
  markOneRead,
  NOTIFICATION_TEXT,
};
