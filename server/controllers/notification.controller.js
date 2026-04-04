const notificationService = require('../services/notification.service');
const { sendSuccess } = require('../utils/apiResponse');
const { asyncHandler } = require('../middlewares/error.middleware');

const getNotifications = asyncHandler(async (req, res) => {
  const { cursor, limit, filter } = req.query;
  const result = await notificationService.getNotifications(req.user.id, { cursor, limit, filter });
  return sendSuccess(res, result);
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user.id);
  return sendSuccess(res, { count });
});

const markAllRead = asyncHandler(async (req, res) => {
  await notificationService.markAllRead(req.user.id);
  return sendSuccess(res, { message: 'All notifications marked as read' });
});

const markOneRead = asyncHandler(async (req, res) => {
  await notificationService.markOneRead(req.user.id, req.params.id);
  return sendSuccess(res, { message: 'Notification marked as read' });
});

module.exports = { getNotifications, getUnreadCount, markAllRead, markOneRead };
