# GetEmpStatus - Express.js Backend Service

A complete Express.js backend service for processing employee status information using Sequelize (MySQL ORM) and Redis caching.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Docker Setup](#docker-setup)
- [Project Structure](#project-structure)
- [Postman Testing](#postman-testing)

## ✨ Features

- ✅ RESTful API with Express.js
- ✅ Sequelize ORM with MySQL database
- ✅ Redis caching layer (10-minute TTL)
- ✅ Bearer token authentication
- ✅ Retry mechanism for database operations (up to 3 retries with exponential backoff)
- ✅ File-based logging with Winston (logs stored in `logs/` folder)
- ✅ Input validation with express-validator
- ✅ Global error handling middleware
- ✅ Docker containerization (MySQL + Redis + Node.js)
- ✅ Database migrations and seeders with automatic setup
- ✅ Comprehensive test suite with Jest
- ✅ Postman collection for easy API testing

## 🏗️ Architecture

```
├── src/
│   ├── config/          # Database, Redis, and Sequelize configuration
│   ├── controllers/     # Handle HTTP requests and responses
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # Sequelize models (User, Salary) and associations
│   ├── routes/          # API routes definitions
│   ├── services/        # Business logic (status processing, caching)
│   ├── utils/           # Helpers (logger, retry mechanism)
│   ├── migrations/      # Database migrations and seeders
│   └── tests/           # Test files (unit and integration tests)
├── scripts/             # Utility scripts (wait-for-db, seed-if-empty)
├── logs/                # Application logs (error.log, combined.log)
├── server.js            # Express server entry point
├── Dockerfile           # Node.js image build
├── docker-compose.yml   # MySQL + Redis + Node.js setup
├── GetEmpStatus.postman_collection.json  # Postman collection
```

## 📦 Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher) or Docker
- Redis (v7 or higher) or Docker
- npm or yarn

## 🚀 Installation

### Option 1: Local Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/ProAbdo/Estarta-Coding-Task-Assignment.git
   cd getempstatus
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up MySQL database**

   - Create a MySQL database
   - Update `.env` with your database credentials

5. **Run migrations and seeders**

   ```bash
   npm run migrate
   npm run seed:if-empty
   ```

6. **Start Redis server**

   ```bash
   # On Windows/Linux/Mac with Redis installed
   redis-server
   ```

7. **Start the application**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

### Option 2: Docker Setup (Recommended)

1. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

2. **Build and start all services**

   ```bash
   docker-compose up
   ```

   This will:

   - Start MySQL database
   - Start Redis cache
   - Build and start the Node.js application
   - Run migrations and seeders automatically

## ⚙️ Configuration

Edit `.env` file with your configuration:

```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=getempstatus_db
DB_USER=root
DB_PASSWORD=rootpassword

REDIS_HOST=localhost
REDIS_PORT=6379

API_TOKEN=your-secret-token-here
LOG_LEVEL=info
```

## 📡 API Documentation

### Base URL

```
http://localhost:3000
```

### Authentication

All API requests require Bearer token authentication:

```
Authorization: Bearer your-secret-token-here
```

### Endpoints

#### Get Employee Status

**POST** `/api/GetEmpStatus`

Get employee status information with computed salary metrics.

**Request Body:**

```json
{
  "NationalNumber": "NAT1001"
}
```

**Success Response (200):**

```json
{
  "username": "jdoe",
  "email": "jdoe@example.com",
  "average_salary": 1800.0,
  "highest_salary": 2300.0,
  "total_salary": 9000.0,
  "status": "RED",
  "last_updated": "2025-01-05T16:00:00.000Z"
}
```

**Error Responses:**

- `400` - Validation error
- `401` - Unauthorized (missing or invalid token)
- `404` - Invalid National Number
- `406` - User is not Active
- `422` - INSUFFICIENT_DATA (less than 3 salary records)
- `500` - Internal server error

**Status Codes:**

- `GREEN` - Average salary > 2000
- `ORANGE` - Average salary = 2000
- `RED` - Average salary < 2000

#### Health Check

**GET** `/health`

Check if the service is running.

**Response:**

```json
{
  "status": "OK",
  "timestamp": "2025-01-05T16:00:00.000Z"
}
```

## 🧪 Testing

Run tests:

```bash
npm test
```

### Test Structure

- **Unit Tests**: `src/tests/validation.test.js`, `src/tests/ProcessStatusService.test.js`
- **Integration Tests**: `src/tests/controller.test.js`
- **Test Configuration**: `jest.config.js`
- **Test Setup**: `src/tests/setup.js`

## 📊 Business Logic

### Salary Processing

1. **December Bonus**: +10% bonus for month 12
2. **Summer Deduction**: -5% deduction for months 6, 7, 8
3. **Tax Deduction**: 7% tax if total salary > 10,000

### Status Calculation

- **GREEN**: Average salary > 2000
- **ORANGE**: Average salary = 2000
- **RED**: Average salary < 2000

### Cache Strategy

- Cache key format: `emp:status:{NationalNumber}`
- TTL: 10 minutes (600 seconds)
- Cache is checked before database query
- Automatic cache invalidation after TTL expires

### Retry Mechanism

- Maximum 3 retries for database operations
- Exponential backoff delay (1s, 2s, 4s)
- Logs all retry attempts
- Graceful error handling after max retries

### Logging

- Logs are written to `logs/` folder
- `error.log`: Only error-level logs
- `combined.log`: All application logs
- Log rotation: 5MB max file size, 5 files max
- Console output for development

## 🐳 Docker Setup

### Docker Compose Services

1. **mysql**: MySQL 8.0 database
2. **redis**: Redis 7 cache server
3. **app**: Node.js Express application

## 📁 Project Structure

```
getempstatus/
├── src/
│   ├── config/
│   │   ├── database.js        # Sequelize database connection
│   │   ├── redis.js           # Redis client connection
│   │   └── sequelize.js       # Sequelize CLI configuration
│   ├── controllers/
│   │   └── EmpStatusController.js  # Employee status controller
│   ├── middleware/
│   │   ├── auth.js            # Bearer token authentication
│   │   ├── validation.js      # Input validation with express-validator
│   │   └── errorHandler.js    # Global error handler middleware
│   ├── models/
│   │   ├── User.js            # User model (Users table)
│   │   ├── Salary.js          # Salary model (Salaries table)
│   │   └── index.js           # Model associations (User ↔ Salary)
│   ├── routes/
│   │   ├── index.js           # Main router
│   │   └── empStatus.js       # Employee status routes
│   ├── services/
│   │   ├── ProcessStatusService.js  # Business logic for status processing
│   │   └── CacheService.js          # Redis caching service
│   ├── utils/
│   │   ├── logger.js          # Winston logger (file-based logging)
│   │   └── retry.js           # Retry mechanism with exponential backoff
│   ├── migrations/
│   │   ├── 20250101000001-create-users.js
│   │   ├── 20250101000002-create-salaries.js
│   │   └── seeders/
│   │       ├── 20250101000001-seed-users.js
│   │       └── 20250101000002-seed-salaries.js
│   └── tests/
│       ├── controller.test.js
│       ├── ProcessStatusService.test.js
│       ├── validation.test.js
│       └── setup.js
├── scripts/
│   ├── wait-for-db.js         # Wait for database to be ready
│   └── seed-if-empty.js       # Seed database only if empty
├── logs/                      # Application logs (created automatically)
│   ├── error.log              # Error-level logs
│   └── combined.log           # All logs
├── server.js                  # Express server entry point
├── Dockerfile                 # Node.js Docker image
├── docker-compose.yml         # Docker services orchestration
├── package.json               # Dependencies and scripts
├── jest.config.js             # Jest test configuration
├── .sequelizerc               # Sequelize CLI configuration
├── GetEmpStatus.postman_collection.json  # Postman collection
├── POSTMAN_TESTING_GUIDE.md   # Detailed Postman testing guide
└── README.md                  # This file
```

## 🔧 Scripts

- `npm start` - Start the server
- `npm run dev` - Start with nodemon (auto-reload)
- `npm test` - Run tests with coverage
- `npm run migrate` - Run database migrations
- `npm run seed` - Run database seeders
- `npm run seed:if-empty` - Seed database only if empty (idempotent)
- `npm run migrate:undo` - Rollback last migration
- `npm run seed:undo` - Undo all seeders
- `npm run wait-for-db` - Wait for database connection (used in Docker)

## 📝 Postman Testing

### Quick Start

1. **Import Collection**: Import `GetEmpStatus.postman_collection.json` into Postman
2. **Send Request**: Use the pre-configured request in the collection

### Manual Request Setup

**Request:**

- Method: `POST`
- URL: `http://localhost:3000/api/GetEmpStatus`
- Headers:
  - `Authorization: Bearer your-secret-token-here`
  - `Content-Type: application/json`
- Body (JSON):
  ```json
  {
    "NationalNumber": "NAT1001"
  }
  ```

## 🐛 Troubleshooting

### Database Connection Issues

- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists

### Redis Connection Issues

- Verify Redis is running
- Check Redis host/port in `.env`
- Test connection: `redis-cli ping`

### Port Already in Use

- Change `PORT` in `.env`
- Or stop the process using the port

## 📊 Sample Data

The database is seeded with sample employee data:

- **12 Users** with various national numbers (NAT1001 - NAT1012)
- **55 Salary Records** across different months and years
- **Active/Inactive Users** for testing different scenarios
- **Various Salary Amounts** to test status calculations

### Test National Numbers

- `NAT1001` - jdoe (Active, 5 salaries) ✅
- `NAT1002` - asalem (Active, 5 salaries) ✅
- `NAT1003` - rhamdan (Inactive) ❌
- `NAT1004` - lbarakat (Active, 5 salaries) ✅
- `NAT1005` - mfaris (Active, 4 salaries) ✅
- `NAT1006` - nsaleh (Inactive) ❌
- `NAT1007` - zobeidat (Active, 7 salaries) ✅
- `NAT1008` - ahalaseh (Active, 6 salaries) ✅
- `NAT1009` - tkhalaf (Inactive) ❌
- `NAT1010` - sshaheen (Active, 6 salaries) ✅
- `NAT1011` - tmart (Inactive) ❌
- `NAT1012` - aali (Active - INSUFFICIENT_DATA ) ⚠️

---

**Built with using Express.js, Sequelize, MySQL, and Redis**
