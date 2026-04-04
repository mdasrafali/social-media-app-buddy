const Story = require('../models/Story');
const User  = require('../models/User');

// ─── Create ───────────────────────────────────────────────────────────────────

const createStory = async (userId, imageUrl) => {
  const user = await User.findById(userId).select('firstName lastName avatar');
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const story = await Story.create({
    author: {
      _id:       user._id,
      firstName: user.firstName,
      lastName:  user.lastName,
      avatar:    user.avatar,
    },
    imageUrl,
  });

  return story;
};

// ─── Get all active stories ───────────────────────────────────────────────────

/**
 * Returns all stories that have not yet expired.
 *
 * The logged-in user's own stories are returned first so the frontend
 * can always treat index 0 as "Your Story" without any extra sorting.
 *
 * Each author's stories are collapsed into a single entry — only the
 * most-recent story image is used as the card thumbnail, matching the
 * design (one card per person).
 */
const getStories = async (viewerId) => {
  const now = new Date();

  // Fetch all non-expired stories, newest first
  const stories = await Story.find({ expiresAt: { $gt: now } })
    .sort({ createdAt: -1 })
    .lean();

  // Collapse to one card per author (latest story per author)
  const seen = new Set();
  const collapsed = [];

  for (const story of stories) {
    const authorId = story.author._id.toString();
    if (seen.has(authorId)) continue;
    seen.add(authorId);
    collapsed.push(story);
  }

  // Put the viewer's own story first, then others
  const ownStories    = collapsed.filter((s) => s.author._id.toString() === viewerId);
  const othersStories = collapsed.filter((s) => s.author._id.toString() !== viewerId);

  return [...ownStories, ...othersStories];
};

// ─── Delete ───────────────────────────────────────────────────────────────────

const deleteStory = async (storyId, userId) => {
  const story = await Story.findById(storyId);
  if (!story) {
    const err = new Error('Story not found');
    err.statusCode = 404;
    throw err;
  }
  if (story.author._id.toString() !== userId) {
    const err = new Error('Not authorised');
    err.statusCode = 403;
    throw err;
  }
  await story.deleteOne();
};

module.exports = { createStory, getStories, deleteStory };
