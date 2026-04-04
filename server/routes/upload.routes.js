const express = require('express');
const router = express.Router();

const { uploadImage } = require('../controllers/upload.controller');
const { protect } = require('../middlewares/auth.middleware');
const { uploadSingle } = require('../middlewares/upload.middleware');

// POST /api/upload
// Field name must be "image" in the multipart form
router.post('/', protect, uploadSingle('image'), uploadImage);

module.exports = router;
