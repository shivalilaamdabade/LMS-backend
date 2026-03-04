const { pool } = require('../config/database');

class Lesson {
  static async create({ section_id, course_id, title, youtube_url, order_number, duration }) {
    const [result] = await pool.execute(
      'INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) VALUES (?, ?, ?, ?, ?, ?)',
      [section_id, course_id, title, youtube_url, order_number, duration]
    );
    return result.insertId;
  }

  static async findByCourseId(courseId) {
    const [rows] = await pool.execute(
      `SELECT l.*, s.title as section_title 
       FROM lessons l 
       JOIN sections s ON l.section_id = s.id 
       WHERE l.course_id = ? 
       ORDER BY s.order_number, l.order_number`,
      [courseId]
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT l.*, s.title as section_title 
       FROM lessons l 
       JOIN sections s ON l.section_id = s.id 
       WHERE l.id = ?`,
      [id]
    );
    return rows[0];
  }

  static async findBySectionId(sectionId) {
    const [rows] = await pool.execute(
      'SELECT * FROM lessons WHERE section_id = ? ORDER BY order_number',
      [sectionId]
    );
    return rows;
  }

  static async update(id, { title, youtube_url, order_number, duration }) {
    await pool.execute(
      'UPDATE lessons SET title = ?, youtube_url = ?, order_number = ?, duration = ? WHERE id = ?',
      [title, youtube_url, order_number, duration, id]
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM lessons WHERE id = ?', [id]);
  }

  static async findNextLesson(courseId, currentOrderNumber) {
    const [rows] = await pool.execute(
      `SELECT l.* FROM lessons l 
       JOIN sections s ON l.section_id = s.id 
       WHERE l.course_id = ? AND (s.order_number > (SELECT s2.order_number FROM sections s2 JOIN lessons l2 ON l2.section_id = s2.id WHERE l2.id = ?) OR (s.order_number = (SELECT s3.order_number FROM sections s3 JOIN lessons l3 ON l3.section_id = s3.id WHERE l3.id = ?) AND l.order_number > ?))
       ORDER BY s.order_number, l.order_number 
       LIMIT 1`,
      [courseId, currentOrderNumber, currentOrderNumber, currentOrderNumber]
    );
    return rows[0];
  }

  static async findPreviousLesson(courseId, currentOrderNumber) {
    const [rows] = await pool.execute(
      `SELECT l.* FROM lessons l 
       JOIN sections s ON l.section_id = s.id 
       WHERE l.course_id = ? AND (s.order_number < (SELECT s2.order_number FROM sections s2 JOIN lessons l2 ON l2.section_id = s2.id WHERE l2.id = ?) OR (s.order_number = (SELECT s3.order_number FROM sections s3 JOIN lessons l3 ON l3.section_id = s3.id WHERE l3.id = ?) AND l.order_number < ?))
       ORDER BY s.order_number DESC, l.order_number DESC 
       LIMIT 1`,
      [courseId, currentOrderNumber, currentOrderNumber, currentOrderNumber]
    );
    return rows[0];
  }
}

module.exports = Lesson;
