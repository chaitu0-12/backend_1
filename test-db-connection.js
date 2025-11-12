const { createSequelizeInstance } = require('./src/config/database');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const db = createSequelizeInstance();
    
    await db.authenticate();
    console.log('✅ Database connection successful!');
    
    // Test a simple query
    const [results] = await db.query('SELECT version()');
    console.log('Database version:', results[0].version);
    
    await db.close();
    console.log('✅ Connection test completed successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error stack:', error.stack);
  }
}

testConnection();
