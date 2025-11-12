const { Sequelize } = require('sequelize');
require('dotenv').config();

// Debug environment variables
console.log('=== DATABASE CONFIG DEBUG ===');
console.log('DB_HOST from env:', process.env.DB_HOST);
console.log('DB_PORT from env:', process.env.DB_PORT);
console.log('DB_NAME from env:', process.env.DB_NAME);
console.log('DB_USER from env:', process.env.DB_USER);
console.log('DB_PASS from env:', process.env.DB_PASS ? '****' : 'NOT SET');
console.log('===============================');

function createSequelizeInstance() {
  // Use Render environment variables directly with explicit fallbacks for your database
  const dbHost = process.env.DB_HOST || 'dpg-d4a6g6buibrs73c8av30-a.oregon-postgres.render.com';
  const dbPort = Number(process.env.DB_PORT) || 5432;
  const dbName = process.env.DB_NAME || 'wetoo';
  const dbUser = process.env.DB_USER || 'wetoo_user';
  const dbPass = process.env.DB_PASS || 'KsHHuF2UrOXSfHzG9B72BvyrjA0BJ1fc';
  
  console.log('DB Config:', {
    host: dbHost,
    port: dbPort,
    database: dbName,
    username: dbUser,
    password: dbPass ? '****' : ''
  });
  
  // Force the dialect to be postgres
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

  // Create the database connection with explicit protocol
  const db = new Sequelize(
    dbName,
    dbUser,
    dbPass,
    common
  );

  return db;
}

module.exports = { createSequelizeInstance };