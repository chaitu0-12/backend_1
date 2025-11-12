const { Client } = require('pg');
const fs = require('fs');
require('dotenv').config();

// Database configuration from environment variables
const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  }
});

async function importSchema() {
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully!');
    
    // Read the schema file
    const schema = fs.readFileSync('postgresql_schema.sql', 'utf8');
    
    // Split the schema into individual statements
    const statements = schema.split(';').filter(stmt => stmt.trim() !== '');
    
    console.log(`Executing ${statements.length} statements...`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim() + ';';
      if (statement.length > 1) {
        try {
          await client.query(statement);
          console.log(`✓ Statement ${i + 1} executed successfully`);
        } catch (err) {
          console.log(`⚠️  Statement ${i + 1} failed (may be expected):`, err.message);
        }
      }
    }
    
    console.log('Schema import completed!');
  } catch (err) {
    console.error('Error importing schema:', err);
  } finally {
    await client.end();
  }
}

importSchema();
