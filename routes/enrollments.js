const express = require('express');
const router = express.Router();
const {
  enrollCourse,
  getMyCourses,
  getCourseStudents,
  checkEnrollmentStatus
} = require('../controllers/enrollmentController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.post('/:courseId/enroll', enrollCourse);
router.get('/my-courses', getMyCourses);
router.get('/course/:courseId/students', getCourseStudents);
router.get('/course/:courseId/status', checkEnrollmentStatus);

module.exports = router;
