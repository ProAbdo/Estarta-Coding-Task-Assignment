const logger = require('../utils/logger');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred:', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  // Handle known errors with status codes
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      details: err.errors.map(e => e.message)
    });
  }

  // Handle Sequelize database errors
  if (err.name === 'SequelizeDatabaseError' || err.name === 'SequelizeConnectionError') {
    return res.status(500).json({
      error: 'Database error occurred'
    });
  }

  // Default error response
  res.status(500).json({
    error: 'Internal server error'
  });
};

module.exports = errorHandler;
