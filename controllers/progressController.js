const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// Mark a lesson as complete
exports.markLessonComplete = async (req, res) => {
  try {
    const { courseId, lessonId } = req.body;
    const userId = req.user.id;

    // Verify lesson belongs to course
    const lesson = await Lesson.findById(lessonId);
    if (!lesson || lesson.course_id !== parseInt(courseId)) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lesson not found or does not belong to this course' 
      });
    }

    // Mark as complete
    await Progress.markAsComplete(userId, courseId, lessonId);

    // Get updated progress percentage
    const percentage = await Progress.getProgressPercentage(userId, courseId);

    res.status(200).json({
      success: true,
      message: 'Lesson marked as complete',
      data: {
        completed: true,
        progressPercentage: percentage
      }
    });
  } catch (error) {
    console.error('Mark lesson complete error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get progress for a course
exports.getCourseProgress = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }

    // Get all progress data
    const progressData = await Progress.getProgressByCourse(userId, courseId);
    const percentage = await Progress.getProgressPercentage(userId, courseId);
    const completedLessons = await Progress.getCompletedLessons(userId, courseId);

    res.status(200).json({
      success: true,
      data: {
        progress: progressData,
        percentage,
        completedLessons,
        totalLessons: progressData.length > 0 ? 
          Math.max(...progressData.map(p => p.lesson_order)) : 0
      }
    });
  } catch (error) {
    console.error('Get course progress error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get progress percentage
exports.getProgressPercentage = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;

    const percentage = await Progress.getProgressPercentage(userId, courseId);

    res.status(200).json({
      success: true,
      data: { percentage }
    });
  } catch (error) {
    console.error('Get progress percentage error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get last watched lesson
exports.getLastWatchedLesson = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const userId = req.user.id;

    const lastWatched = await Progress.getLastWatchedLesson(userId, courseId);

    res.status(200).json({
      success: true,
      data: lastWatched || null
    });
  } catch (error) {
    console.error('Get last watched lesson error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Update progress (for partial video watching)
exports.updateProgress = async (req, res) => {
  try {
    const { courseId, lessonId, completed } = req.body;
    const userId = req.user.id;

    await Progress.updateProgress(userId, courseId, lessonId, { completed });

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully'
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
