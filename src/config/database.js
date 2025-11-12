const { Sequelize } = require('sequelize');
require('dotenv').config();

function createSequelizeInstance() {
  console.log('DB Config:', {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    database: process.env.DB_NAME || 'student_senior_db',
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
  });
  
  const common = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 5432),
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: true
      } : false,
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
    process.env.DB_NAME || 'student_senior_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    common
  );

  return db;
}

module.exports = { createSequelizeInstance };