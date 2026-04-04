require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const { connectRedis } = require('./config/redis');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

const start = async () => {
  // Connect to datastores before accepting traffic
  await connectDB();
  await connectRedis();

  const server = app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // ─── Graceful shutdown ──────────────────────────────────────────────────────
  // On SIGTERM/SIGINT, stop accepting new connections and let in-flight
  // requests complete before the process exits. Important for zero-downtime
  // deploys (Kubernetes, PM2, etc.).
  const gracefulShutdown = (signal) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });

    // Force-kill if shutdown takes longer than 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  // Catch unhandled promise rejections — log them but don't crash in development
  process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`);
    if (process.env.NODE_ENV === 'production') {
      gracefulShutdown('unhandledRejection');
    }
  });
};

start();
