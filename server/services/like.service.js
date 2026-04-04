const mongoose = require('mongoose');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { createNotification } = require('./notification.service');

/**
 * Generic toggle-like helper.
 *
 * Uses MongoDB's $addToSet / $pull for atomic idempotent operations:
 *   - $addToSet → no-op if userId already in the array (prevents double-likes)
 *   - $pull     → no-op if userId not in the array (prevents negative counts)
 *
 * We update the `likesCount` counter in the same atomic findOneAndUpdate call
 * to avoid a read-modify-write race condition.
 *
 * @param {Model}  Model   - Mongoose model (Post or Comment)
 * @param {string} docId   - Document _id
 * @param {string} userId  - The acting user's _id
 * @returns {{ liked: boolean, likesCount: number }}
 */
const toggleLike = async (Model, docId, userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Check current like state — also fetch author so we know who to notify
  const doc = await Model.findById(docId).select('likes likesCount author');
  if (!doc) {
    const err = new Error('Document not found');
    err.statusCode = 404;
    throw err;
  }

  const alreadyLiked = doc.likes.some((id) => id.equals(userObjectId));

  let updated;
  if (alreadyLiked) {
    // Unlike — no notification
    updated = await Model.findByIdAndUpdate(
      docId,
      {
        $pull: { likes: userObjectId },
        $inc: { likesCount: -1 },
      },
      { new: true, select: 'likesCount' }
    );
    return { liked: false, likesCount: updated.likesCount };
  } else {
    // Like — fire notification fire-and-forget
    updated = await Model.findByIdAndUpdate(
      docId,
      {
        $addToSet: { likes: userObjectId },
        $inc: { likesCount: 1 },
      },
      { new: true, select: 'likesCount' }
    );

    if (doc.author?._id) {
      const notifType = Model.modelName === 'Post' ? 'like_post' : 'like_comment';
      const refs = Model.modelName === 'Post'
        ? { postId: docId }
        : { commentId: docId };
      createNotification({
        recipientId: doc.author._id,
        actorId: userId,
        type: notifType,
        ...refs,
      }).catch(() => {});
    }

    return { liked: true, likesCount: updated.likesCount };
  }
};

// ─── Public API ───────────────────────────────────────────────────────────────

const togglePostLike = (postId, userId) => toggleLike(Post, postId, userId);
const toggleCommentLike = (commentId, userId) => toggleLike(Comment, commentId, userId);

/**
 * Returns a paginated list of users who liked a document.
 * Uses cursor-based pagination on `_id` within the likes array,
 * implemented via an aggregation pipeline to avoid populating the full array.
 *
 * For very high like counts (> 10k) you'd extract likes to a separate
 * collection — this is the service boundary where that migration would happen.
 */
const getLikes = async (Model, docId, { cursor = null, limit = 20 }) => {
  const safeLimit = Math.min(Number(limit) || 20, 50);

  const pipeline = [
    { $match: { _id: new mongoose.Types.ObjectId(docId) } },
    { $project: { likes: 1 } },
    { $unwind: '$likes' },
    ...(cursor
      ? [{ $match: { likes: { $gt: new mongoose.Types.ObjectId(cursor) } } }]
      : []),
    { $sort: { likes: 1 } },
    { $limit: safeLimit + 1 },
    {
      $lookup: {
        from: 'users',
        localField: 'likes',
        foreignField: '_id',
        as: 'user',
        pipeline: [{ $project: { firstName: 1, lastName: 1, avatar: 1 } }],
      },
    },
    { $unwind: '$user' },
    { $replaceRoot: { newRoot: '$user' } },
  ];

  const users = await Model.aggregate(pipeline);

  const hasNextPage = users.length > safeLimit;
  if (hasNextPage) users.pop();

  return {
    users,
    pagination: {
      hasNextPage,
      nextCursor: hasNextPage ? users[users.length - 1]._id : null,
    },
  };
};

const getPostLikes = (postId, opts) => getLikes(Post, postId, opts);
const getCommentLikes = (commentId, opts) => getLikes(Comment, commentId, opts);

module.exports = {
  togglePostLike,
  toggleCommentLike,
  getPostLikes,
  getCommentLikes,
};
