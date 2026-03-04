const { pool } = require('../config/database');

class Section {
  static async create({ course_id, title, order_number }) {
    const [result] = await pool.execute(
      'INSERT INTO sections (course_id, title, order_number) VALUES (?, ?, ?)',
      [course_id, title, order_number]
    );
    return result.insertId;
  }

  static async findByCourseId(courseId) {
    const [rows] = await pool.execute(
      'SELECT * FROM sections WHERE course_id = ? ORDER BY order_number',
      [courseId]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM sections WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async update(id, { title, order_number }) {
    await pool.execute(
      'UPDATE sections SET title = ?, order_number = ? WHERE id = ?',
      [title, order_number, id]
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM sections WHERE id = ?', [id]);
  }
}

module.exports = Section;
