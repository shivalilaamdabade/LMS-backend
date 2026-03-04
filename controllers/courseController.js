const Course = require('../models/Course');
const Section = require('../models/Section');
const Lesson = require('../models/Lesson');

// Get all courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    
    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Get all courses error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get single course with sections and lessons
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findWithSectionsAndLessons(req.params.id);
    
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Create new course (instructor/admin only)
exports.createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail_url, category } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide title and description' 
      });
    }

    // Create course
    const courseId = await Course.create({
      title,
      description,
      thumbnail_url,
      category,
      instructor_id: req.user.id
    });

    const course = await Course.findById(courseId);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Update course (instructor/admin only)
exports.updateCourse = async (req, res) => {
  try {
    const { title, description, thumbnail_url, category } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }

    // Check if user is the instructor or admin
    if (req.user.role !== 'admin' && course.instructor_id !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this course' 
      });
    }

    await Course.update(req.params.id, {
      title,
      description,
      thumbnail_url,
      category
    });

    const updatedCourse = await Course.findById(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Delete course (instructor/admin only)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }

    // Check if user is the instructor or admin
    if (req.user.role !== 'admin' && course.instructor_id !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this course' 
      });
    }

    await Course.delete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get all lessons for a course
exports.getCourseLessons = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }

    const lessons = await Lesson.findByCourseId(req.params.id);

    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons
    });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Add section to course
exports.addSection = async (req, res) => {
  try {
    const { title, order_number } = req.body;
    const courseId = req.params.id;

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
        message: 'Not authorized' 
      });
    }

    const sectionId = await Section.create({
      course_id: courseId,
      title,
      order_number
    });

    const section = await Section.findById(sectionId);

    res.status(201).json({
      success: true,
      message: 'Section added successfully',
      data: section
    });
  } catch (error) {
    console.error('Add section error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Add lesson to section
exports.addLesson = async (req, res) => {
  try {
    const { title, youtube_url, order_number, duration } = req.body;
    const sectionId = req.params.sectionId;
    const courseId = req.params.courseId;

    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({ 
        success: false, 
        message: 'Section not found' 
      });
    }

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
        message: 'Not authorized' 
      });
    }

    const lessonId = await Lesson.create({
      section_id: sectionId,
      course_id: courseId,
      title,
      youtube_url,
      order_number,
      duration
    });

    const lesson = await Lesson.findById(lessonId);

    res.status(201).json({
      success: true,
      message: 'Lesson added successfully',
      data: lesson
    });
  } catch (error) {
    console.error('Add lesson error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
