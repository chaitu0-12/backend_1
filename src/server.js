const http = require('http');
const dotenv = require('dotenv');

// Load environment variables as early as possible
dotenv.config();

// Debug environment variables
console.log('=== ENVIRONMENT VARIABLES DEBUG ===');
console.log('DB_HOST:', process.env.DB_HOST || 'NOT SET');
console.log('DB_PORT:', process.env.DB_PORT || 'NOT SET');
console.log('DB_NAME:', process.env.DB_NAME || 'NOT SET');
console.log('DB_USER:', process.env.DB_USER || 'NOT SET');
console.log('DB_PASS:', process.env.DB_PASS ? '****' : 'NOT SET');
console.log('NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
console.log('PORT:', process.env.PORT || 'NOT SET');
console.log('===================================');

const createApp = require('./app');
const { connectAndSync } = require('./models');

const port = process.env.PORT || 4000;
const host = process.env.HOST || '0.0.0.0'; // Bind to all interfaces by default

async function startServer() {
  try {
    console.log('Starting WE TOO API server...');
    
    // Connect to database and sync models
    await connectAndSync();
    console.log('✅ Databases connected and synced');
    
    const app = createApp();
    const server = http.createServer(app);
    
    server.listen(port, host, () => {
      console.log(`✅ WE TOO API listening on ${host}:${port}`);
    });
    
    // Handle server errors
    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      if (error.syscall !== 'listen') {
        throw error;
      }
      
      switch (error.code) {
        case 'EACCES':
          console.error(`❌ Port ${port} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`❌ Port ${port} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });
    
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
}

startServer();