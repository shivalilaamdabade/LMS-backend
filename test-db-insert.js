const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDatabaseInsert() {
  let connection;
  
  try {
    console.log('🔍 Testing Database Connection...\n');
    console.log('Config:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD ? '***' : 'MISSING',
      database: process.env.DB_NAME
    });
    
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: false,
      connectTimeout: 10000,
      multipleStatements: true
    });
    
    console.log('\n✅ Connected to database!\n');
    
    // Test INSERT
    const testData = {
      name: `Test User ${Date.now()}`,
      email: `test${Date.now()}@example.com`,
      password: 'hashedpassword123',
      role: 'student'
    };
    
    console.log('📝 Attempting INSERT...');
    console.log('Data:', testData);
    
    const [result] = await connection.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [testData.name, testData.email, testData.password, testData.role]
    );
    
    console.log('\n✅ INSERT SUCCESSFUL!\n');
    console.log('Result:', {
      insertId: result.insertId,
      affectedRows: result.affectedRows,
      changedRows: result.changedRows
    });
    
    // Verify the insert
    const [rows] = await connection.execute(
      'SELECT id, name, email, role FROM users WHERE id = ?',
      [result.insertId]
    );
    
    console.log('\n📋 Retrieved record:', rows[0]);
    console.log('\n✨ All tests passed!\n');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED!\n');
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    console.error('Errno:', error.errno);
    console.error('SQL State:', error.sqlState);
    console.error('\nStack trace:', error.stack);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔒 Connection closed\n');
    }
  }
}

testDatabaseInsert();
