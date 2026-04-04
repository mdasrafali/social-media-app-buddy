const express = require('express');
const router = express.Router();

const commentController = require('../controllers/comment.controller');
const likeController = require('../controllers/like.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

// GET    /api/comments/:commentId/replies  — paginated replies
router.get('/:commentId/replies', commentController.getReplies);

// DELETE /api/comments/:commentId
router.delete('/:commentId', commentController.deleteComment);

// POST   /api/comments/:commentId/likes   — toggle like/unlike
router.post('/:commentId/likes', likeController.toggleCommentLike);

// GET    /api/comments/:commentId/likes   — who liked this comment
router.get('/:commentId/likes', likeController.getCommentLikes);

module.exports = router;
