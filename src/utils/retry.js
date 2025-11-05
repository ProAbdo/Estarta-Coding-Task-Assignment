const logger = require('./logger');

/**
 * Retry mechanism for async operations
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum number of retries (default: 3)
 * @param {number} delay - Delay between retries in ms (default: 1000)
 * @returns {Promise} - Result of the function
 */
async function retry(fn, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries) {
        logger.warn(`Retry attempt ${attempt + 1}/${maxRetries} failed:`, {
          error: error.message,
          stack: error.stack
        });
        
        // Exponential backoff
        const waitTime = delay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        logger.error(`Max retries (${maxRetries}) exceeded:`, {
          error: error.message,
          stack: error.stack
        });
      }
    }
  }
  
  throw lastError;
}

module.exports = retry;
