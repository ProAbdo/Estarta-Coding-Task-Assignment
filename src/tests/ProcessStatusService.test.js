const ProcessStatusService = require('../services/ProcessStatusService');
const { User, Salary } = require('../models');

// Mock dependencies
jest.mock('../models');
jest.mock('../utils/retry');
jest.mock('../services/CacheService');
jest.mock('../utils/logger');
jest.mock('../config/redis', () => ({
  connect: jest.fn(),
  get: jest.fn(),
  setEx: jest.fn(),
  del: jest.fn()
}));

describe('ProcessStatusService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock retry to just call the function directly
    const retry = require('../utils/retry');
    retry.mockImplementation(async (fn) => await fn());
    
    // Mock CacheService
    const CacheService = require('../services/CacheService');
    CacheService.get.mockResolvedValue(null);
    CacheService.set.mockResolvedValue();
    CacheService.getEmployeeStatusKey.mockImplementation((nationalNumber) => 
      `emp:status:${nationalNumber}`
    );
  });

  describe('processStatus', () => {
    it('should throw error for invalid national number', async () => {
      const retry = require('../utils/retry');
      retry.mockImplementation(async (fn) => await fn());
      User.findOne.mockResolvedValue(null);

      await expect(
        ProcessStatusService.processStatus('INVALID')
      ).rejects.toThrow('Invalid National Number');
    });

    it('should throw error for inactive user', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        nationalNumber: 'NAT1001',
        isActive: false,
        salaries: []
      };

      const retry = require('../utils/retry');
      retry.mockImplementation(async (fn) => await fn());
      User.findOne.mockResolvedValue(mockUser);

      await expect(
        ProcessStatusService.processStatus('NAT1001')
      ).rejects.toThrow('User is not Active');
    });

    it('should throw error for insufficient data', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        nationalNumber: 'NAT1001',
        isActive: true,
        salaries: [
          { id: 1, year: 2025, month: 1, salary: 1000 },
          { id: 2, year: 2025, month: 2, salary: 1100 }
        ]
      };

      const retry = require('../utils/retry');
      retry.mockImplementation(async (fn) => await fn());
      User.findOne.mockResolvedValue(mockUser);

      await expect(
        ProcessStatusService.processStatus('NAT1001')
      ).rejects.toThrow('INSUFFICIENT_DATA');
    });

    it('should process status correctly for valid user', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        nationalNumber: 'NAT1001',
        isActive: true,
        salaries: [
          { id: 1, year: 2025, month: 1, salary: 2000, toJSON: () => ({ id: 1, year: 2025, month: 1, salary: 2000 }) },
          { id: 2, year: 2025, month: 2, salary: 2100, toJSON: () => ({ id: 2, year: 2025, month: 2, salary: 2100 }) },
          { id: 3, year: 2025, month: 3, salary: 2200, toJSON: () => ({ id: 3, year: 2025, month: 3, salary: 2200 }) }
        ]
      };

      const retry = require('../utils/retry');
      retry.mockImplementation(async (fn) => await fn());
      User.findOne.mockResolvedValue(mockUser);

      const result = await ProcessStatusService.processStatus('NAT1001');

      expect(result).toHaveProperty('username', 'testuser');
      expect(result).toHaveProperty('email', 'test@example.com');
      expect(result).toHaveProperty('average_salary');
      expect(result).toHaveProperty('highest_salary');
      expect(result).toHaveProperty('total_salary');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('last_updated');
    });
  });
});
