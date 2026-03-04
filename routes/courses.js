const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseLessons,
  addSection,
  addLesson
} = require('../controllers/courseController');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.get('/:id/lessons', getCourseLessons);

// Protected routes (instructor/admin only)
router.post('/', authMiddleware, roleCheck('instructor', 'admin'), createCourse);
router.put('/:id', authMiddleware, roleCheck('instructor', 'admin'), updateCourse);
router.delete('/:id', authMiddleware, roleCheck('instructor', 'admin'), deleteCourse);

// Add section to course
router.post('/:id/sections', authMiddleware, roleCheck('instructor', 'admin'), addSection);

// Add lesson to section
router.post('/:courseId/sections/:sectionId/lessons', authMiddleware, roleCheck('instructor', 'admin'), addLesson);

module.exports = router;
