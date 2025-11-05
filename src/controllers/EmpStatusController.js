let ProcessStatusService = require('../services/ProcessStatusService');
let logger = require('../utils/logger');

class EmpStatusController {
  /**
   * Handle POST /api/GetEmpStatus
   * @param {Request} req - Express request
   * @param {Response} res - Express response
   * @param {NextFunction} next - Express next function
   */
  async getEmpStatus(req, res, next) {
    try {
      const { NationalNumber } = req.body;

      logger.info('GetEmpStatus request received', {
        nationalNumber: NationalNumber,
        ip: req.ip
      });

      const result = await ProcessStatusService.processStatus(NationalNumber);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

try {
  const controller = new EmpStatusController();
  module.exports = controller;
} catch (error) {
  console.error('Error instantiating EmpStatusController:', error);
  throw error;
}

