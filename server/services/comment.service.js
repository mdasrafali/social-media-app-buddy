const Comment = require('../models/Comment');
const Post = require('../models/Post');
const User = require('../models/User');
const { createNotification } = require('./notification.service');

// ─── Add comment / reply ──────────────────────────────────────────────────────

const addComment = async (postId, userId, { content, parentCommentId }) => {
  // Verify post exists
  const post = await Post.findById(postId).select('_id visibility author');
  if (!post) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    throw err;
  }

  let depth = 0;

  if (parentCommentId) {
    const parent = await Comment.findById(parentCommentId).select('depth postId');
    if (!parent) {
      const err = new Error('Parent comment not found');
      err.statusCode = 404;
      throw err;
    }
    if (parent.postId.toString() !== postId) {
      const err = new Error('Parent comment does not belong to this post');
      err.statusCode = 400;
      throw err;
    }
    if (parent.depth >= 1) {
      // Enforce max depth of 1 (reply-to-reply not allowed — prevents UI complexity)
      const err = new Error('Cannot reply to a reply');
      err.statusCode = 400;
      throw err;
    }
    depth = parent.depth + 1;
  }

  const user = await User.findById(userId).select('firstName lastName avatar');

  const comment = await Comment.create({
    postId,
    parentCommentId: parentCommentId || null,
    depth,
    author: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
    },
    content,
  });

  // Keep counters in sync atomically
  if (parentCommentId) {
    await Comment.findByIdAndUpdate(parentCommentId, { $inc: { repliesCount: 1 } });
  } else {
    await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });
  }

  // Fire-and-forget notifications — never let this break the comment creation
  if (parentCommentId) {
    // Reply → notify the parent comment's author
    const parentComment = await Comment.findById(parentCommentId).select('author').lean();
    if (parentComment?.author?._id) {
      createNotification({
        recipientId: parentComment.author._id,
        actorId: userId,
        type: 'reply_comment',
        postId,
        commentId: comment._id,
      }).catch(() => {});
    }
  } else {
    // Top-level comment → notify the post author
    if (post.author?._id) {
      createNotification({
        recipientId: post.author._id,
        actorId: userId,
        type: 'comment_post',
        postId,
        commentId: comment._id,
      }).catch(() => {});
    }
  }

  return comment;
};

// ─── Get comments for a post (cursor-based) ──────────────────────────────────

const getComments = async (postId, { cursor = null, limit = 20 }) => {
  const safeLimit = Math.min(Number(limit) || 20, 50);

  const filter = { postId, parentCommentId: null }; // top-level only
  if (cursor) filter._id = { $lt: cursor };

  const comments = await Comment.find(filter)
    .sort({ _id: -1 })
    .limit(safeLimit + 1)
    .select('-likes')
    .lean();

  const hasNextPage = comments.length > safeLimit;
  if (hasNextPage) comments.pop();

  return {
    comments,
    pagination: {
      hasNextPage,
      nextCursor: hasNextPage ? comments[comments.length - 1]._id : null,
    },
  };
};

// ─── Get replies for a comment (cursor-based) ─────────────────────────────────

const getReplies = async (commentId, { cursor = null, limit = 10 }) => {
  const safeLimit = Math.min(Number(limit) || 10, 50);

  const filter = { parentCommentId: commentId };
  if (cursor) filter._id = { $gt: cursor }; // replies: oldest first

  const replies = await Comment.find(filter)
    .sort({ _id: 1 })
    .limit(safeLimit + 1)
    .select('-likes')
    .lean();

  const hasNextPage = replies.length > safeLimit;
  if (hasNextPage) replies.pop();

  return {
    replies,
    pagination: {
      hasNextPage,
      nextCursor: hasNextPage ? replies[replies.length - 1]._id : null,
    },
  };
};

// ─── Delete ───────────────────────────────────────────────────────────────────

const deleteComment = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) {
    const err = new Error('Comment not found');
    err.statusCode = 404;
    throw err;
  }

  if (comment.author._id.toString() !== userId) {
    const err = new Error('Not authorised');
    err.statusCode = 403;
    throw err;
  }

  await comment.deleteOne();

  // Update parent counters
  if (comment.parentCommentId) {
    await Comment.findByIdAndUpdate(comment.parentCommentId, {
      $inc: { repliesCount: -1 },
    });
  } else {
    await Post.findByIdAndUpdate(comment.postId, { $inc: { commentsCount: -1 } });
  }
};

module.exports = { addComment, getComments, getReplies, deleteComment };
