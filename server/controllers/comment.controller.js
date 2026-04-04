const commentService = require('../services/comment.service');
const { sendSuccess, sendCreated } = require('../utils/apiResponse');
const { asyncHandler } = require('../middlewares/error.middleware');

const addComment = asyncHandler(async (req, res) => {
  const comment = await commentService.addComment(
    req.params.postId,
    req.user.id,
    req.body
  );
  return sendCreated(res, { comment }, 'Comment added');
});

const getComments = asyncHandler(async (req, res) => {
  const { cursor, limit } = req.query;
  const result = await commentService.getComments(req.params.postId, { cursor, limit });
  return sendSuccess(res, result);
});

const getReplies = asyncHandler(async (req, res) => {
  const { cursor, limit } = req.query;
  const result = await commentService.getReplies(req.params.commentId, { cursor, limit });
  return sendSuccess(res, result);
});

const deleteComment = asyncHandler(async (req, res) => {
  await commentService.deleteComment(req.params.commentId, req.user.id);
  return sendSuccess(res, null, 'Comment deleted');
});

module.exports = { addComment, getComments, getReplies, deleteComment };
