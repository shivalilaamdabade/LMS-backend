const { pool } = require('../config/database');

class Progress {
  static async create({ user_id, course_id, lesson_id, completed = false }) {
    const [result] = await pool.execute(
      `INSERT INTO progress (user_id, course_id, lesson_id, completed) 
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP`,
      [user_id, course_id, lesson_id, completed]
    );
    return result.insertId;
  }

  static async markAsComplete(userId, courseId, lessonId) {
    await pool.execute(
      `INSERT INTO progress (user_id, course_id, lesson_id, completed, last_watched_timestamp) 
       VALUES (?, ?, ?, true, CURRENT_TIMESTAMP)
       ON DUPLICATE KEY UPDATE completed = true, last_watched_timestamp = CURRENT_TIMESTAMP`,
      [userId, courseId, lessonId]
    );
  }

  static async getProgressByCourse(userId, courseId) {
    const [rows] = await pool.execute(`
      SELECT p.*, l.title as lesson_title, l.order_number as lesson_order
      FROM progress p
      JOIN lessons l ON p.lesson_id = l.id
      WHERE p.user_id = ? AND p.course_id = ?
      ORDER BY l.order_number
    `, [userId, courseId]);
    return rows;
  }

  static async getProgressPercentage(userId, courseId) {
    // Get total lessons in the course
    const [totalRows] = await pool.execute(
      'SELECT COUNT(*) as total FROM lessons WHERE course_id = ?',
      [courseId]
    );
    const totalLessons = totalRows[0]?.total || 0;

    if (totalLessons === 0) return 0;

    // Get completed lessons
    const [completedRows] = await pool.execute(
      'SELECT COUNT(*) as completed FROM progress WHERE user_id = ? AND course_id = ? AND completed = true',
      [userId, courseId]
    );
    const completedLessons = completedRows[0]?.completed || 0;

    return Math.round((completedLessons / totalLessons) * 100);
  }

  static async getLastWatchedLesson(userId, courseId) {
    const [rows] = await pool.execute(`
      SELECT p.lesson_id, l.title, l.youtube_url, l.order_number, p.last_watched_timestamp
      FROM progress p
      JOIN lessons l ON p.lesson_id = l.id
      WHERE p.user_id = ? AND p.course_id = ?
      ORDER BY p.last_watched_timestamp DESC
      LIMIT 1
    `, [userId, courseId]);
    return rows[0];
  }

  static async getCompletedLessons(userId, courseId) {
    const [rows] = await pool.execute(
      'SELECT lesson_id FROM progress WHERE user_id = ? AND course_id = ? AND completed = true',
      [userId, courseId]
    );
    return rows.map(row => row.lesson_id);
  }

  static async updateProgress(userId, courseId, lessonId, data) {
    await pool.execute(
      `UPDATE progress 
       SET completed = ?, last_watched_timestamp = CURRENT_TIMESTAMP 
       WHERE user_id = ? AND course_id = ? AND lesson_id = ?`,
      [data.completed, userId, courseId, lessonId]
    );
  }
}

module.exports = Progress;
