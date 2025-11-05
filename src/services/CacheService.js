const redisClient = require('../config/redis');
const logger = require('../utils/logger');

class CacheService {
  constructor() {
    this.defaultTTL = 600; // 10 minutes in seconds
  }

  /**
   * Get value from cache
   * @param {string} key - Cache key
   * @returns {Promise<any|null>} - Cached value or null
   */
  async get(key) {
    try {
      const value = await redisClient.get(key);
      if (value) {
        logger.info(`Cache hit for key: ${key}`);
        return JSON.parse(value);
      }
      logger.info(`Cache miss for key: ${key}`);
      return null;
    } catch (error) {
      logger.error('Cache get error:', { error: error.message, key });
      return null;
    }
  }

  /**
   * Set value in cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds (default: 10 minutes)
   * @returns {Promise<void>}
   */
  async set(key, value, ttl = this.defaultTTL) {
    try {
      await redisClient.setEx(key, ttl, JSON.stringify(value));
      logger.info(`Cache set for key: ${key} with TTL: ${ttl}s`);
    } catch (error) {
      logger.error('Cache set error:', { error: error.message, key });
    }
  }

  /**
   * Delete value from cache
   * @param {string} key - Cache key
   * @returns {Promise<void>}
   */
  async delete(key) {
    try {
      await redisClient.del(key);
      logger.info(`Cache deleted for key: ${key}`);
    } catch (error) {
      logger.error('Cache delete error:', { error: error.message, key });
    }
  }

  /**
   * Generate cache key for employee status
   * @param {string} nationalNumber - National number
   * @returns {string} - Cache key
   */
  getEmployeeStatusKey(nationalNumber) {
    return `emp:status:${nationalNumber}`;
  }
}

module.exports = new CacheService();
