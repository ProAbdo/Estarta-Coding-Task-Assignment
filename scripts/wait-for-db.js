const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'getempstatus_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'rootpassword',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
  }
);

async function waitForDatabase(maxAttempts = 30, delay = 2000) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await sequelize.authenticate();
      console.log('Database connection established!');
      await sequelize.close();
      return true;
    } catch (error) {
      console.log(`Waiting for database... (${i + 1}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  console.error('Failed to connect to database after maximum attempts');
  process.exit(1);
}

waitForDatabase().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Error waiting for database:', error);
  process.exit(1);
});
