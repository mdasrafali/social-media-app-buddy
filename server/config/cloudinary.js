const cloudinary = require('cloudinary').v2;

/**
 * Configure Cloudinary once at startup.
 * Credentials come from environment variables — never hardcoded.
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
