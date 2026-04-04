const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { authLimiter } = require('../middlewares/rateLimiter.middleware');
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} = require('../validations/auth.validation');

// POST /api/auth/register
router.post('/register', authLimiter, validate(registerSchema), authController.register);

// POST /api/auth/login
router.post('/login', authLimiter, validate(loginSchema), authController.login);

// POST /api/auth/refresh
router.post('/refresh', validate(refreshTokenSchema), authController.refresh);

// POST /api/auth/logout        (requires valid access token)
router.post('/logout', protect, validate(refreshTokenSchema), authController.logout);

// POST /api/auth/logout-all    (revokes all sessions for this user)
router.post('/logout-all', protect, authController.logoutAll);

module.exports = router;
