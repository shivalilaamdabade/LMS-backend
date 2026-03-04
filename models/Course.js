const { pool } = require('../config/database');

class Course {
  static async create({ title, description, thumbnail_url, category, instructor_id }) {
    const [result] = await pool.execute(
      'INSERT INTO courses (title, description, thumbnail_url, category, instructor_id) VALUES (?, ?, ?, ?, ?)',
      [title, description, thumbnail_url, category, instructor_id]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await pool.execute(`
      SELECT c.*, u.name as instructor_name 
      FROM courses c 
      LEFT JOIN users u ON c.instructor_id = u.id 
      ORDER BY c.created_at DESC
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(`
      SELECT c.*, u.name as instructor_name 
      FROM courses c 
      LEFT JOIN users u ON c.instructor_id = u.id 
      WHERE c.id = ?
    `, [id]);
    return rows[0];
  }

  static async findByCategory(category) {
    const [rows] = await pool.execute(`
      SELECT c.*, u.name as instructor_name 
      FROM courses c 
      LEFT JOIN users u ON c.instructor_id = u.id 
      WHERE c.category = ?
      ORDER BY c.created_at DESC
    `, [category]);
    return rows;
  }

  static async update(id, { title, description, thumbnail_url, category }) {
    await pool.execute(
      `UPDATE courses 
       SET title = ?, description = ?, thumbnail_url = ?, category = ? 
       WHERE id = ?`,
      [title, description, thumbnail_url, category, id]
    );
  }

  static async delete(id) {
    await pool.execute('DELETE FROM courses WHERE id = ?', [id]);
  }

  static async findWithSectionsAndLessons(courseId) {
    // Get course details
    const [courseRows] = await pool.execute(`
      SELECT c.*, u.name as instructor_name 
      FROM courses c 
      LEFT JOIN users u ON c.instructor_id = u.id 
      WHERE c.id = ?
    `, [courseId]);
    
    if (!courseRows || courseRows.length === 0) {
      return null;
    }

    const course = courseRows[0];

    // Get sections
    const [sections] = await pool.execute(
      'SELECT * FROM sections WHERE course_id = ? ORDER BY order_number',
      [courseId]
    );

    // Get lessons for each section
    for (const section of sections) {
      const [lessons] = await pool.execute(
        'SELECT * FROM lessons WHERE section_id = ? ORDER BY order_number',
        [section.id]
      );
      section.lessons = lessons || [];
    }

    course.sections = sections;
    return course;
  }

  static async countTotalLessons(courseId) {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) as total FROM lessons WHERE course_id = ?',
      [courseId]
    );
    return rows[0]?.total || 0;
  }
}

module.exports = Course;
