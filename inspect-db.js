const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create a direct connection to the database
const sequelize = new Sequelize(
  process.env.DB_NAME || 'wetoo',
  process.env.DB_USER || 'wetoo_user',
  process.env.DB_PASS || 'KsHHuF2UrOXSfHzG9B72BvyrjA0BJ1fc',
  {
    host: process.env.DB_HOST || 'dpg-d4a6g6buibrs73c8av30-a.oregon-postgres.render.com',
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
);

async function inspectDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    
    // Check senior_feedback table columns
    console.log('\n=== COLUMNS IN SENIOR_FEEDBACK TABLE ===');
    const columns = await sequelize.query(
      `SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'senior_feedback' ORDER BY ordinal_position`,
      { type: sequelize.QueryTypes.SELECT }
    );
    
    console.log('Columns:', JSON.stringify(columns, null, 2));
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error inspecting database:', error.message);
    process.exit(1);
  }
}

inspectDatabase();