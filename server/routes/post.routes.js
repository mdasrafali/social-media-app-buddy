const express = require('express');
const router = express.Router();

const postController = require('../controllers/post.controller');
const commentController = require('../controllers/comment.controller');
const likeController = require('../controllers/like.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createPostSchema } = require('../validations/post.validation');
const { createCommentSchema } = require('../validations/comment.validation');

// All post routes are protected
router.use(protect);

// GET  /api/posts              — paginated feed
router.get('/', postController.getFeed);

// POST /api/posts              — create a post
router.post('/', validate(createPostSchema), postController.createPost);

// GET  /api/posts/:postId      — single post
router.get('/:postId', postController.getPost);

// DELETE /api/posts/:postId    — delete own post
router.delete('/:postId', postController.deletePost);

// ─── Likes on posts ───────────────────────────────────────────────────────────
// POST   /api/posts/:postId/likes   — toggle like/unlike
router.post('/:postId/likes', likeController.togglePostLike);

// GET    /api/posts/:postId/likes   — who liked this post
router.get('/:postId/likes', likeController.getPostLikes);

// ─── Comments on posts ────────────────────────────────────────────────────────
// GET  /api/posts/:postId/comments
router.get('/:postId/comments', commentController.getComments);

// POST /api/posts/:postId/comments  — add comment or reply (parentCommentId in body)
router.post('/:postId/comments', validate(createCommentSchema), commentController.addComment);

module.exports = router;
