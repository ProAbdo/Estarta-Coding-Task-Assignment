module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/migrations/',
    '/src/tests/'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/migrations/**',
    '!src/tests/**',
    '!src/config/**'
  ],
  testMatch: [
    '**/src/tests/**/*.test.js'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js']
};
