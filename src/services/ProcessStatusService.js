const { User, Salary } = require('../models');
const retry = require('../utils/retry');
const logger = require('../utils/logger');
const CacheService = require('./CacheService');

class ProcessStatusService {
  /**
   * Process employee status
   * @param {string} nationalNumber - National number
   * @returns {Promise<Object>} - Processed status result
   */
  async processStatus(nationalNumber) {
    // Check cache first
    const cacheKey = CacheService.getEmployeeStatusKey(nationalNumber);
    const cached = await CacheService.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Validate input
    if (!nationalNumber || typeof nationalNumber !== 'string') {
      throw new Error('Invalid National Number');
    }

    // Retrieve employee with retry mechanism
    const user = await retry(async () => {
      return await User.findOne({
        where: { nationalNumber },
        include: [{
          model: Salary,
          as: 'salaries',
          required: false
        }]
      });
    });

    // Check if user exists
    if (!user) {
      const error = new Error('Invalid National Number');
      error.statusCode = 404;
      throw error;
    }

    // Check if user is active
    if (!user.isActive) {
      const error = new Error('User is not Active');
      error.statusCode = 406;
      throw error;
    }

    // Check if user has at least 3 salary records
    if (!user.salaries || user.salaries.length < 3) {
      const error = new Error('INSUFFICIENT_DATA');
      error.statusCode = 422;
      throw error;
    }

    // Process salaries with adjustments
    let processedSalaries = user.salaries.map(salary => {
      let adjustedSalary = salary.salary;

      // December bonus: +10%
      if (salary.month === 12) {
        adjustedSalary = adjustedSalary * 1.10;
      }

      // Summer deduction (June, July, August): -5%
      if (salary.month === 6 || salary.month === 7 || salary.month === 8) {
        adjustedSalary = adjustedSalary * 0.95;
      }

      return {
        ...salary.toJSON(),
        adjustedSalary
      };
    });

    // Calculate total salary before tax
    let totalSalary = processedSalaries.reduce((sum, s) => sum + s.adjustedSalary, 0);

    // Apply tax if total > 10,000
    let taxAmount = 0;
    if (totalSalary > 10000) {
      taxAmount = totalSalary * 0.07;
      totalSalary = totalSalary - taxAmount;
    }

    // Calculate final metrics
    const averageSalary = totalSalary / processedSalaries.length;
    const highestSalary = Math.max(...processedSalaries.map(s => s.adjustedSalary));

    // Determine status
    let status;
    if (averageSalary > 2000) {
      status = 'GREEN';
    } else if (averageSalary === 2000) {
      status = 'ORANGE';
    } else {
      status = 'RED';
    }

    // Build result
    const result = {
      username: user.username,
      email: user.email,
      average_salary: Math.round(averageSalary * 100) / 100,
      highest_salary: Math.round(highestSalary * 100) / 100,
      total_salary: Math.round(totalSalary * 100) / 100,
      status: status,
      last_updated: new Date().toISOString()
    };

    // Cache the result
    await CacheService.set(cacheKey, result);

    logger.info('Employee status processed:', {
      nationalNumber,
      status,
      averageSalary
    });

    return result;
  }
}

module.exports = new ProcessStatusService();
