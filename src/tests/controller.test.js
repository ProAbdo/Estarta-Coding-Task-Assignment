const request = require('supertest');

// Mock dependencies BEFORE requiring server
jest.mock('../models', () => ({
  User: {},
  Salary: {},
  sequelize: {
    authenticate: jest.fn().mockResolvedValue(true),
    sync: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true)
  }
}));
jest.mock('../services/ProcessStatusService');
jest.mock('../utils/logger');
jest.mock('../config/redis', () => ({
  connect: jest.fn().mockResolvedValue(true),
  get: jest.fn().mockResolvedValue(null),
  setEx: jest.fn().mockResolvedValue(true),
  del: jest.fn().mockResolvedValue(true),
  on: jest.fn()
}));

// Create Express app for testing
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes and middleware
const routes = require('../routes');
app.use('/', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Error handler
const errorHandler = require('../middleware/errorHandler');
app.use(errorHandler);

describe('EmpStatusController', () => {
  const validToken = process.env.API_TOKEN || 'test-token';

  beforeEach(() => {
    jest.clearAllMocks();
    // Set API token for testing
    process.env.API_TOKEN = 'test-token';
  });

  describe('POST /api/GetEmpStatus', () => {
    it('should return 401 without token', async () => {
      const response = await request(app)
        .post('/api/GetEmpStatus')
        .send({ NationalNumber: 'NAT1001' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/api/GetEmpStatus')
        .set('Authorization', `Bearer ${validToken}`)
        .send({});

      expect(response.status).toBe(400);
    });

    it('should return 200 for valid request', async () => {
      const ProcessStatusService = require('../services/ProcessStatusService');
      ProcessStatusService.processStatus.mockResolvedValue({
        username: 'testuser',
        email: 'test@example.com',
        average_salary: 2000,
        highest_salary: 2200,
        total_salary: 6000,
        status: 'GREEN',
        last_updated: new Date().toISOString()
      });

      const response = await request(app)
        .post('/api/GetEmpStatus')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ NationalNumber: 'NAT1001' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('username');
      expect(response.body).toHaveProperty('status');
    });
  });

  describe('GET /health', () => {
    it('should return 200', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
    });
  });
});
