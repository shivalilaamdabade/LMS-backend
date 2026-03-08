const { pool } = require('../config/database');

class User {
  static async create({ name, email, password, role = 'student' }) {
    try {
      if (!pool) {
        throw new Error('Database pool not initialized');
      }
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, password, role]
      );
      console.log('User.create successful, insertId:', result.insertId);
      return result.insertId;
    } catch (error) {
      console.error('Error in User.create:', error.message);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      if (!pool) {
        throw new Error('Database pool not initialized');
      }
      const [rows] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0];
    } catch (error) {
      console.error('Error in User.findByEmail:', error.message);
      throw error;
    }
  }

  static async findById(id) {
    try {
      if (!pool) {
        throw new Error('Database pool not initialized');
      }
      const [rows] = await pool.execute(
        'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Error in User.findById:', error.message);
      throw error;
    }
  }

  static async findAll() {
    try {
      if (!pool) {
        throw new Error('Database pool not initialized');
      }
      const [rows] = await pool.execute(
        'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
      );
      return rows;
    } catch (error) {
      console.error('Error in User.findAll:', error.message);
      throw error;
    }
  }
}

module.exports = User;
