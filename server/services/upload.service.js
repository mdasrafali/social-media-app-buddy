const cloudinary = require('../config/cloudinary');

/**
 * Uploads a file buffer to Cloudinary using an upload stream.
 *
 * Why a stream instead of cloudinary.uploader.upload() with a temp path?
 *   - We're using multer's memoryStorage, so the file is already in RAM.
 *   - Piping the buffer directly avoids writing to disk at all.
 *
 * @param {Buffer} buffer   - File buffer from multer
 * @param {string} folder   - Cloudinary folder name (e.g. 'appify/posts')
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadToCloudinary = (buffer, folder = 'appify/posts') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        // Auto-detect the best format (e.g. convert PNG → WebP for smaller size)
        fetch_format: 'auto',
        // Serve images at a sensible quality without visible degradation
        quality: 'auto',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,   // https:// URL — always use secure_url
          publicId: result.public_id,
        });
      }
    );

    stream.end(buffer);
  });
};

/**
 * Deletes an image from Cloudinary by its public_id.
 * Called when a post with an image is deleted.
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch {
    // Non-fatal — log but don't crash the delete flow
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
