const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { cacheGet, cacheSet, cacheDel } = require('../config/redis');

/**
 * Feed cache key — invalidated whenever a new post is created or deleted.
 * In a real system you'd have per-user feed keys and use a fan-out-on-write
 * strategy, but this is a solid foundation.
 */
const FEED_CACHE_KEY = 'feed:public';
const FEED_CACHE_TTL = 30; // seconds

// ─── Create ───────────────────────────────────────────────────────────────────

const createPost = async (userId, { content, imageUrl, visibility }) => {
  // Pull the minimal user info needed for the denormalised author snapshot
  const user = await User.findById(userId).select('firstName lastName avatar');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const post = await Post.create({
    author: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
    },
    content,
    imageUrl,
    visibility,
  });

  // Invalidate feed cache so the new post appears immediately
  await cacheDel(FEED_CACHE_KEY);

  return post;
};

// ─── Feed (cursor-based pagination) ──────────────────────────────────────────

/**
 * Returns public posts in reverse-chronological order.
 *
 * Cursor-based pagination using `_id` (which encodes creation time in its
 * first 4 bytes and is monotonically increasing, making it a perfect cursor).
 *
 * Why cursor over offset?
 *   - Offset pagination is O(offset) — page 1000 of 20 items requires
 *     skipping 20000 rows, getting progressively slower.
 *   - Cursor pagination is O(1) — always a single range scan on the index.
 *   - No duplicate/missing items when new posts arrive between pages.
 *
 * @param {string|null} cursor  - The `_id` of the last post on the previous page
 * @param {number}      limit   - Number of posts to return (default 10, max 50)
 * @param {string}      viewerId - The authenticated user's id (to see their private posts too)
 */
const getFeed = async ({ cursor = null, limit = 10, viewerId }) => {
  const safeLimit = Math.min(Number(limit) || 10, 50);

  // Try cache for the first page of the public feed (no cursor)
  if (!cursor) {
    const cached = await cacheGet(FEED_CACHE_KEY);
    if (cached) return cached;
  }

  // Build the query filter
  const filter = {
    $or: [
      { visibility: 'public' },
      // The viewer can always see their own private posts
      { visibility: 'private', 'author._id': new mongoose.Types.ObjectId(viewerId) },
    ],
  };

  if (cursor) {
    // `_id < cursor` means "older than the last item we saw"
    filter._id = { $lt: cursor };
  }

  const posts = await Post.find(filter)
    .sort({ _id: -1 }) // newest first
    .limit(safeLimit + 1) // fetch one extra to determine if there's a next page
    .select('-likes') // don't return the full likes array — use likesCount instead
    .lean(); // plain JS object, faster than Mongoose documents for read-only data

  const hasNextPage = posts.length > safeLimit;
  if (hasNextPage) posts.pop();

  const result = {
    posts,
    pagination: {
      hasNextPage,
      nextCursor: hasNextPage ? posts[posts.length - 1]._id : null,
    },
  };

  // Cache only the first page of the public feed (viewer-independent data)
  if (!cursor) {
    await cacheSet(FEED_CACHE_KEY, result, FEED_CACHE_TTL);
  }

  // Compute isLikedByViewer AFTER the cache — this is viewer-specific so must
  // never be stored in the shared cache. One extra query on the _id index.
  if (viewerId && posts.length > 0) {
    const viewerOid = new mongoose.Types.ObjectId(viewerId);
    const postIds = posts.map((p) => p._id);
    // likes has select:false but we can still filter on it; only _id needed back
    const likedDocs = await Post.find(
      { _id: { $in: postIds }, likes: viewerOid }
    ).select('_id').lean();
    const likedSet = new Set(likedDocs.map((d) => d._id.toString()));
    result.posts = posts.map((p) => ({
      ...p,
      isLikedByViewer: likedSet.has(p._id.toString()),
    }));
  }

  return result;
};

// ─── Single post ─────────────────────────────────────────────────────────────

const getPostById = async (postId, viewerId) => {
  const post = await Post.findById(postId).select('-likes').lean();

  if (!post) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    throw err;
  }

  // Enforce privacy
  if (
    post.visibility === 'private' &&
    post.author._id.toString() !== viewerId
  ) {
    const err = new Error('Post not found');
    err.statusCode = 404; // return 404 not 403 to avoid leaking post existence
    throw err;
  }

  return post;
};

// ─── Delete ───────────────────────────────────────────────────────────────────

const deletePost = async (postId, userId) => {
  const post = await Post.findById(postId);
  if (!post) {
    const err = new Error('Post not found');
    err.statusCode = 404;
    throw err;
  }

  if (post.author._id.toString() !== userId) {
    const err = new Error('Not authorised to delete this post');
    err.statusCode = 403;
    throw err;
  }

  await Promise.all([
    post.deleteOne(),
    Comment.deleteMany({ postId }), // cascade-delete comments
    cacheDel(FEED_CACHE_KEY),
  ]);
};

module.exports = { createPost, getFeed, getPostById, deletePost };
