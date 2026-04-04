const { createClient } = require('redis');
const logger = require('../utils/logger');

/**
 * Redis client — used for feed caching.
 *
 * Design decision: Redis is optional. If REDIS_ENABLED=false (or Redis is
 * unavailable) the app falls back to hitting MongoDB directly. This means
 * you can ship without Redis and add it later with zero code changes in the
 * business logic layer.
 */
let redisClient = null;
let isConnected = false;

const connectRedis = async () => {
  if (process.env.REDIS_ENABLED !== 'true') {
    logger.info('Redis disabled — skipping connection');
    return;
  }

  redisClient = createClient({ url: process.env.REDIS_URL });

  redisClient.on('error', (err) => {
    logger.warn(`Redis error: ${err.message}`);
    isConnected = false;
  });

  redisClient.on('connect', () => {
    isConnected = true;
    logger.info('Redis connected');
  });

  await redisClient.connect();
};

/** Safe get — returns null when Redis is down rather than throwing. */
const cacheGet = async (key) => {
  if (!isConnected) return null;
  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

/** Safe set — silently skips on Redis failure. */
const cacheSet = async (key, value, ttlSeconds = 60) => {
  if (!isConnected) return;
  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
  } catch {
    // non-fatal
  }
};

/** Invalidate one or more keys (e.g. after a new post is created). */
const cacheDel = async (...keys) => {
  if (!isConnected) return;
  try {
    await redisClient.del(keys);
  } catch {
    // non-fatal
  }
};

module.exports = { connectRedis, cacheGet, cacheSet, cacheDel };
