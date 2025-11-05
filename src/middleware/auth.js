const logger = require('../utils/logger');

/**
 * Middleware to authenticate API requests using Bearer token
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  const expectedToken = process.env.API_TOKEN;

  if (!expectedToken) {
    logger.error('API_TOKEN not configured in environment');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  if (!token) {
    logger.warn('Unauthorized request - missing token', {
      ip: req.ip,
      path: req.path
    });
    return res.status(401).json({ error: 'Unauthorized - Token required' });
  }

  if (token !== expectedToken) {
    logger.warn('Unauthorized request - invalid token', {
      ip: req.ip,
      path: req.path
    });
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }

  logger.info('Authenticated request', {
    ip: req.ip,
    path: req.path
  });

  next();
};

module.exports = authenticateToken;
