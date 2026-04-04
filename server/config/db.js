const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Connects to MongoDB using the URI from environment variables.
 * Exits the process on failure so we surface config problems early
 * rather than silently serving broken responses.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Keep the connection pool small enough for a single-server dev setup
      // but large enough to handle concurrent requests at scale.
      maxPoolSize: 10,
    });

    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
