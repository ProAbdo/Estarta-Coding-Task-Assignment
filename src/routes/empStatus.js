const express = require('express');
const router = express.Router();

let empStatusController;
try {
  empStatusController = require('../controllers/empStatusController');
} catch (error) {
  console.error('Error loading EmpStatusController:', error);
  throw error;
}

const authenticateToken = require('../middleware/auth');
const { validateGetEmpStatus, handleValidationErrors } = require('../middleware/validation');

// Ensure controller is properly loaded
if (!empStatusController || !empStatusController.getEmpStatus) {
  console.error('EmpStatusController:', empStatusController);
  throw new Error('EmpStatusController is not properly exported');
}

router.post(
  '/GetEmpStatus',
  authenticateToken,
  validateGetEmpStatus,
  handleValidationErrors,
  (req, res, next) => empStatusController.getEmpStatus(req, res, next)
);

module.exports = router;
