const { Client } = require('pg');

// Test direct database connection with your credentials
const client = new Client({
  host: 'dpg-d4a6g6buibrs73c8av30-a.oregon-postgres.render.com',
  port: 5432,
  user: 'wetoo_user',
  password: 'KsHHuF2UrOXSfHzG9B72BvyrjA0BJ1fc',
  database: 'wetoo',
  ssl: {
    rejectUnauthorized: false
  }
});

async function testConnection() {
  try {
    console.log('Testing direct database connection...');
    await client.connect();
    console.log('✅ Direct database connection successful!');
    
    const res = await client.query('SELECT NOW()');
    console.log('Current time from database:', res.rows[0].now);
    
    await client.end();
    console.log('✅ Direct connection test completed');
  } catch (error) {
    console.error('❌ Direct database connection failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Error details:', error);
  }
}

testConnection();
