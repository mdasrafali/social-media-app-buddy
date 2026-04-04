const multer = require('multer');
const { sendError } = require('../utils/apiResponse');

/**
 * Multer configured with memory storage.
 *
 * Why memory storage instead of disk storage?
 *   - We stream the buffer directly to Cloudinary — no temp files on disk.
 *   - Cleaner in serverless/container environments where the filesystem
 *     may be read-only or ephemeral.
 *
 * Limits:
 *   - 5 MB max file size (Cloudinary free tier handles this fine)
 *   - Only image MIME types accepted
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

/**
 * Wraps multer's single-file upload and converts its callback-style
 * errors into our standard error response format.
 */
const uploadSingle = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return sendError(res, 'File too large. Maximum size is 5 MB.', 413, 'FILE_TOO_LARGE');
      }
      return sendError(res, err.message, 400, 'UPLOAD_ERROR');
    }
    if (err) {
      return sendError(res, err.message, 400, 'UPLOAD_ERROR');
    }
    next();
  });
};

module.exports = { uploadSingle };
