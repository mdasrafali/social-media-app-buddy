const { uploadToCloudinary } = require('../services/upload.service');
const { sendCreated, sendError } = require('../utils/apiResponse');
const { asyncHandler } = require('../middlewares/error.middleware');

/**
 * POST /api/upload
 *
 * Accepts a single image file (field name: "image"), uploads it to
 * Cloudinary, and returns the secure URL.
 *
 * The frontend sends this URL when creating a post — we never store
 * binary data in MongoDB.
 */
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return sendError(res, 'No image file provided', 400, 'NO_FILE');
  }

  const { url, publicId } = await uploadToCloudinary(req.file.buffer, 'appify/posts');

  return sendCreated(res, { url, publicId }, 'Image uploaded successfully');
});

module.exports = { uploadImage };
