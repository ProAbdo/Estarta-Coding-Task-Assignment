const { body, validationResult } = require('express-validator');

/**
 * Validation rules for GetEmpStatus endpoint
 */
const validateGetEmpStatus = [
  body('NationalNumber')
    .notEmpty()
    .withMessage('NationalNumber is required')
    .isString()
    .withMessage('NationalNumber must be a string')
    .trim()
    .isLength({ min: 1 })
    .withMessage('NationalNumber cannot be empty')
];

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  
  next();
};

module.exports = {
  validateGetEmpStatus,
  handleValidationErrors
};