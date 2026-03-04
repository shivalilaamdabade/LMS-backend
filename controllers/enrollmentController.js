const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// Enroll in a course
exports.enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.checkEnrollment(studentId, courseId);
    if (existingEnrollment) {
      return res.status(400).json({ 
        success: false, 
        message: 'Already enrolled in this course' 
      });
    }

    // Create enrollment
    const enrollmentId = await Enrollment.create({
      student_id: studentId,
      course_id: courseId
    });

    const enrollment = await Enrollment.checkEnrollment(studentId, courseId);

    res.status(201).json({
      success: true,
      message: 'Successfully enrolled in the course',
      data: enrollment
    });
  } catch (error) {
    console.error('Enroll course error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during enrollment' 
    });
  }
};

// Get all enrolled courses for current student
exports.getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.findByStudentId(req.user.id);
    
    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    console.error('Get my courses error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get all students enrolled in a course (instructor only)
exports.getCourseStudents = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }

    // Check authorization
    if (req.user.role !== 'admin' && course.instructor_id !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view this information' 
      });
    }

    const enrollments = await Enrollment.findByCourseId(courseId);

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    console.error('Get course students error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Check enrollment status
exports.checkEnrollmentStatus = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const studentId = req.user.id;

    const enrollment = await Enrollment.checkEnrollment(studentId, courseId);

    res.status(200).json({
      success: true,
      data: {
        isEnrolled: !!enrollment,
        enrollment
      }
    });
  } catch (error) {
    console.error('Check enrollment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
