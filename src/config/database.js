const { Sequelize } = require('sequelize');
require('dotenv').config();

function createSequelizeInstance() {
  // Use Render environment variables directly
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = Number(process.env.DB_PORT) || 5432;
  const dbName = process.env.DB_NAME || 'student_senior_db';
  const dbUser = process.env.DB_USER || 'root';
  const dbPass = process.env.DB_PASS || '';
  
  console.log('DB Config:', {
    host: dbHost,
    port: dbPort,
    database: dbName,
    username: dbUser,
    password: dbPass ? '****' : ''
  });
  
  const common = {
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      },
      connectTimeout: 60000
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000
    }
  };

  const db = new Sequelize(
    dbName,
    dbUser,
    dbPass,
    common
  );

  return db;
}

module.exports = { createSequelizeInstance };