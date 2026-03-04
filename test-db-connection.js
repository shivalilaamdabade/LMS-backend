const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  console.log('Testing database connection...\n');
  console.log('Host:', process.env.DB_HOST);
  console.log('Port:', process.env.DB_PORT);
  console.log('User:', process.env.DB_USER);
  console.log('Database:', process.env.DB_NAME);
  console.log('\nAttempting connection...\n');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: false
      }
    });

    console.log('✅ SUCCESS! Connected to MySQL database!');
    console.log('MySQL version:', connection.serverVersion);
    
    // List tables
    const [tables] = await connection.query(
      "SHOW TABLES"
    );
    console.log('\n📊 Tables in database:');
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`);
    });

    await connection.end();
    console.log('\n✅ Connection test completed successfully!');
    return true;

  } catch (error) {
    console.error('❌ FAILED! Connection error:');
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('\n⚠️  This means Aiven is blocking the connection.');
    console.error('\n📋 SOLUTION:');
    console.error('1. Go to https://console.aiven.io');
    console.error('2. Select your MySQL service');
    console.error('3. Find "Settings" → "Network" or "Security"');
    console.error('4. Add IP filter: 0.0.0.0/0');
    console.error('5. Save changes');
    console.error('\nOR contact Aiven support to enable external connections.');
    return false;
  }
}

testConnection();
