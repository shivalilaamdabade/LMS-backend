const { pool } = require('../config/database');

class Enrollment {
  static async create({ student_id, course_id }) {
    const [result] = await pool.execute(
      'INSERT INTO enrollments (student_id, course_id, status) VALUES (?, ?, ?)',
      [student_id, course_id, 'active']
    );
    return result.insertId;
  }

  static async findByStudentId(studentId) {
    const [rows] = await pool.execute(`
      SELECT e.*, c.title, c.description, c.thumbnail_url, c.category, u.name as instructor_name
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE e.student_id = ? AND e.status = 'active'
      ORDER BY e.enrollment_date DESC
    `, [studentId]);
    return rows;
  }

  static async findByCourseId(courseId) {
    const [rows] = await pool.execute(`
      SELECT e.*, u.name as student_name, u.email as student_email
      FROM enrollments e
      JOIN users u ON e.student_id = u.id
      WHERE e.course_id = ?
      ORDER BY e.enrollment_date DESC
    `, [courseId]);
    return rows;
  }

  static async checkEnrollment(studentId, courseId) {
    const [rows] = await pool.execute(
      'SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?',
      [studentId, courseId]
    );
    return rows[0];
  }

  static async updateStatus(id, status) {
    await pool.execute(
      'UPDATE enrollments SET status = ? WHERE id = ?',
      [status, id]
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM enrollments WHERE id = ?', [id]);
  }
}

module.exports = Enrollment;
