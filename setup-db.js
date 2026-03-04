const { testConnection, initializeDatabase } = require('./config/database');

async function setupDatabase() {
  console.log('Setting up database...\n');
  
  const connected = await testConnection();
  if (!connected) {
    console.log('\n⚠️  Database connection failed. Please check your network connection and database credentials.');
    console.log('You can run this script again later to initialize the database.\n');
    return;
  }
  
  await initializeDatabase();
  console.log('Database setup complete!\n');
}

setupDatabase();
