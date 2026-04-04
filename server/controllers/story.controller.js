const storyService = require('../services/story.service');
const { sendSuccess, sendCreated, sendError } = require('../utils/apiResponse');
const { asyncHandler } = require('../middlewares/error.middleware');

const createStory = asyncHandler(async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) return sendError(res, 'imageUrl is required', 400, 'VALIDATION_ERROR');

  const story = await storyService.createStory(req.user.id, imageUrl);
  return sendCreated(res, { story }, 'Story created');
});

const getStories = asyncHandler(async (req, res) => {
  const stories = await storyService.getStories(req.user.id);
  return sendSuccess(res, { stories });
});

const deleteStory = asyncHandler(async (req, res) => {
  await storyService.deleteStory(req.params.storyId, req.user.id);
  return sendSuccess(res, null, 'Story deleted');
});

module.exports = { createStory, getStories, deleteStory };
