const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const notificationController = require('../controllers/notification.controller');

// All notification endpoints require authentication
router.use(protect);

// GET  /api/notifications?filter=all|unread&cursor=&limit=
router.get('/', notificationController.getNotifications);

// GET  /api/notifications/unread-count
router.get('/unread-count', notificationController.getUnreadCount);

// PATCH /api/notifications/read-all
router.patch('/read-all', notificationController.markAllRead);

// PATCH /api/notifications/:id/read
router.patch('/:id/read', notificationController.markOneRead);

module.exports = router;
