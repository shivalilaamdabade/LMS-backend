const express = require('express');
const router = express.Router();
const {
  markLessonComplete,
  getCourseProgress,
  getProgressPercentage,
  getLastWatchedLesson,
  updateProgress
} = require('../controllers/progressController');
const authMiddleware = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

router.post('/lesson/complete', markLessonComplete);
router.get('/:courseId', getCourseProgress);
router.get('/:courseId/percentage', getProgressPercentage);
router.get('/:courseId/last-watched', getLastWatchedLesson);
router.put('/update', updateProgress);

module.exports = router;
