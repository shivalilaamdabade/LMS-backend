const { pool } = require('./config/database');

async function checkAndFixUsersTable() {
  try {
    const connection = await pool.getConnection();
    
    // Check existing columns
    const [columns] = await connection.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'defaultdb' 
      AND TABLE_NAME = 'users'
      ORDER BY ORDINAL_POSITION
    `);
    
    console.log('Current columns in users table:');
    columns.forEach(col => console.log(`  - ${col.COLUMN_NAME}`));
    
    // Check if 'name' column exists
    const hasNameColumn = columns.some(col => col.COLUMN_NAME === 'name');
    const hasUsernameColumn = columns.some(col => col.COLUMN_NAME === 'username');
    const hasRoleColumn = columns.some(col => col.COLUMN_NAME === 'role');
    
    if (!hasNameColumn) {
      if (hasUsernameColumn) {
        console.log('\nRenaming username column to name...');
        await connection.query('ALTER TABLE users CHANGE COLUMN username name VARCHAR(255) NOT NULL');
        console.log('✓ Column renamed successfully!');
      } else {
        console.log('\nAdding name column...');
        await connection.query('ALTER TABLE users ADD COLUMN name VARCHAR(255) NOT NULL AFTER id');
        console.log('✓ Column added successfully!');
      }
    } else {
      console.log('\n✓ name column already exists!');
    }
    
    if (!hasRoleColumn) {
      console.log('Adding role column...');
      await connection.query("ALTER TABLE users ADD COLUMN role ENUM('student', 'instructor', 'admin') DEFAULT 'student' AFTER password");
      console.log('✓ role column added successfully!');
    } else {
      console.log('✓ role column already exists!');
    }
    
    // Make phone column nullable or add default value
    const hasPhoneColumn = columns.some(col => col.COLUMN_NAME === 'phone');
    if (hasPhoneColumn) {
      console.log('Making phone column optional...');
      await connection.query('ALTER TABLE users MODIFY COLUMN phone VARCHAR(20) NULL');
      console.log('✓ phone column is now optional!');
    }
    
    connection.release();
    console.log('Database schema fixed!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkAndFixUsersTable();
