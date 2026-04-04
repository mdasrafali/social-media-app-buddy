const postService = require('../services/post.service');
const { sendSuccess, sendCreated } = require('../utils/apiResponse');
const { asyncHandler } = require('../middlewares/error.middleware');

const createPost = asyncHandler(async (req, res) => {
  const post = await postService.createPost(req.user.id, req.body);
  return sendCreated(res, { post }, 'Post created');
});

const getFeed = asyncHandler(async (req, res) => {
  const { cursor, limit } = req.query;
  const result = await postService.getFeed({ cursor, limit, viewerId: req.user.id });
  return sendSuccess(res, result);
});

const getPost = asyncHandler(async (req, res) => {
  const post = await postService.getPostById(req.params.postId, req.user.id);
  return sendSuccess(res, { post });
});

const deletePost = asyncHandler(async (req, res) => {
  await postService.deletePost(req.params.postId, req.user.id);
  return sendSuccess(res, null, 'Post deleted');
});

module.exports = { createPost, getFeed, getPost, deletePost };
