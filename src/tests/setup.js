// Test setup file
process.env.NODE_ENV = 'test';
process.env.API_TOKEN = 'test-token';
process.env.DB_NAME = 'getempstatus_test_db';
process.env.REDIS_HOST = 'localhost';
process.env.REDIS_PORT = '6379';
process.env.PORT = '3001'; // Use different port for tests to avoid conflicts
