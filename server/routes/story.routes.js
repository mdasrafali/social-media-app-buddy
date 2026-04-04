const express = require('express');
const router  = express.Router();

const storyController = require('../controllers/story.controller');
const { protect }     = require('../middlewares/auth.middleware');

router.use(protect);

// GET  /api/stories          — all active stories (own first)
router.get('/',              storyController.getStories);

// POST /api/stories          — create story  { imageUrl }
router.post('/',             storyController.createStory);

// DELETE /api/stories/:storyId
router.delete('/:storyId',  storyController.deleteStory);

module.exports = router;
