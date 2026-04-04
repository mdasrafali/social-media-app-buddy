const likeService = require('../services/like.service');
const { sendSuccess } = require('../utils/apiResponse');
const { asyncHandler } = require('../middlewares/error.middleware');

const togglePostLike = asyncHandler(async (req, res) => {
  const result = await likeService.togglePostLike(req.params.postId, req.user.id);
  return sendSuccess(res, result);
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const result = await likeService.toggleCommentLike(req.params.commentId, req.user.id);
  return sendSuccess(res, result);
});

const getPostLikes = asyncHandler(async (req, res) => {
  const { cursor, limit } = req.query;
  const result = await likeService.getPostLikes(req.params.postId, { cursor, limit });
  return sendSuccess(res, result);
});

const getCommentLikes = asyncHandler(async (req, res) => {
  const { cursor, limit } = req.query;
  const result = await likeService.getCommentLikes(req.params.commentId, { cursor, limit });
  return sendSuccess(res, result);
});

module.exports = { togglePostLike, toggleCommentLike, getPostLikes, getCommentLikes };
