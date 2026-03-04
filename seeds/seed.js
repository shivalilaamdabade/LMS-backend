const bcrypt = require('bcryptjs');
const { pool, initializeDatabase } = require('../config/database');

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  // Initialize database schema first
  await initializeDatabase();

  try {
    const connection = await pool.getConnection();
    console.log('✓ Connected to database\n');

    // Clear existing data (in reverse order of dependencies)
    console.log('🗑️  Clearing existing data...');
    await connection.query('DELETE FROM progress');
    await connection.query('DELETE FROM enrollments');
    await connection.query('DELETE FROM lessons');
    await connection.query('DELETE FROM sections');
    await connection.query('DELETE FROM courses');
    await connection.query('DELETE FROM users');
    console.log('✓ Existing data cleared\n');

    // Create users
    console.log('👥 Creating users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const [user1] = await connection.execute(
      `INSERT INTO users (name, email, password, role) 
       VALUES ('John Instructor', 'instructor@lms.com', ?, 'instructor')`,
      [hashedPassword]
    );
    const instructorId = user1.insertId;

    const [user2] = await connection.execute(
      `INSERT INTO users (name, email, password, role) 
       VALUES ('Alice Student', 'student@lms.com', ?, 'student')`,
      [hashedPassword]
    );
    const studentId = user2.insertId;

    const [user3] = await connection.execute(
      `INSERT INTO users (name, email, password, role) 
       VALUES ('Admin User', 'admin@lms.com', ?, 'admin')`,
      [hashedPassword]
    );
    const adminId = user3.insertId;

    console.log(`   Created ${instructorId}: John Instructor (instructor@lms.com / password123)`);
    console.log(`   Created ${studentId}: Alice Student (student@lms.com / password123)`);
    console.log(`   Created ${adminId}: Admin User (admin@lms.com / password123)\n`);

    // Create courses
    console.log('📚 Creating courses...');
    
    // Course 1: Complete Java Programming Masterclass
    const [course1] = await connection.execute(
      `INSERT INTO courses (title, description, thumbnail_url, category, instructor_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        'Complete Java Programming Masterclass',
        'Master Java programming from basics to advanced concepts. Learn OOP, Data Structures, Collections, Exception Handling, and build real-world applications. This comprehensive course covers everything you need to become a professional Java developer.',
        'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=400&fit=crop',
        'Programming',
        instructorId
      ]
    );
    const javaCourseId = course1.insertId;
    console.log(`   ✓ Java Programming course created`);

    // Course 2: Full-Stack Web Development
    const [course2] = await connection.execute(
      `INSERT INTO courses (title, description, thumbnail_url, category, instructor_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        'Full-Stack Web Development Bootcamp',
        'Become a full-stack developer with React, Node.js, Express, and databases. Build modern web applications from scratch.',
        'https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&h=400&fit=crop',
        'Web Development',
        instructorId
      ]
    );
    const webDevCourseId = course2.insertId;
    console.log(`   ✓ Web Development course created`);

    // Course 3: Python for Data Science
    const [course3] = await connection.execute(
      `INSERT INTO courses (title, description, thumbnail_url, category, instructor_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        'Python for Data Science and Machine Learning',
        'Master Python programming, data analysis, visualization, and machine learning with practical projects.',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
        'Data Science',
        instructorId
      ]
    );
    const pythonCourseId = course3.insertId;
    console.log(`   ✓ Python Data Science course created`);

    // Course 4: Artificial Intelligence & Machine Learning
    const [course4] = await connection.execute(
      `INSERT INTO courses (title, description, thumbnail_url, category, instructor_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        'Artificial Intelligence & Machine Learning Masterclass',
        'Learn AI and ML from scratch. Master neural networks, deep learning, NLP, and computer vision with hands-on projects.',
        'https://images.unsplash.com/photo-1555255707-c0796608725b?w=600&h=400&fit=crop',
        'Artificial Intelligence',
        instructorId
      ]
    );
    const aiCourseId = course4.insertId;
    console.log(`   ✓ AI & ML course created`);

    // Course 5: SQL Database Mastery
    const [course5] = await connection.execute(
      `INSERT INTO courses (title, description, thumbnail_url, category, instructor_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        'SQL Database Mastery - From Beginner to Advanced',
        'Master SQL databases, query optimization, stored procedures, triggers, and database design. Learn MySQL, PostgreSQL concepts.',
        'https://images.unsplash.com/photo-1544383835-ba6b4f64c9c8?w=600&h=400&fit=crop',
        'Database',
        instructorId
      ]
    );
    const sqlCourseId = course5.insertId;
    console.log(`   ✓ SQL Database course created\n`);

    // JAVA COURSE - Comprehensive Structure
    console.log('📖 Creating Java Course Content...');
    
    // Section 1: Introduction to Java
    const [section1] = await connection.execute(
      `INSERT INTO sections (course_id, title, order_number) VALUES (?, ?, ?)`,
      [javaCourseId, 'Introduction to Java', 1]
    );
    const section1Id = section1.insertId;

    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section1Id, javaCourseId, 'What is Java? - Overview and History', 'https://www.youtube.com/watch?v=eIrMbAQSU34', 1, '10:00']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section1Id, javaCourseId, 'Installing Java JDK and Setup', 'https://www.youtube.com/watch?v=xk4_1vDrzzo', 2, '8:30']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section1Id, javaCourseId, 'Your First Java Program - Hello World', 'https://www.youtube.com/watch?v=TGeRSDfNZ4I', 3, '12:15']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section1Id, javaCourseId, 'How Java Works - JVM, JRE, JDK', 'https://www.youtube.com/watch?v=U2mxNkXqCvM', 4, '15:00']
    );

    // Section 2: Java Basics
    const [section2] = await connection.execute(
      `INSERT INTO sections (course_id, title, order_number) VALUES (?, ?, ?)`,
      [javaCourseId, 'Java Programming Fundamentals', 2]
    );
    const section2Id = section2.insertId;

    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section2Id, javaCourseId, 'Variables and Data Types in Java', 'https://www.youtube.com/watch?v=JWgcTUVVdKI', 1, '18:20']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section2Id, javaCourseId, 'Operators in Java - Arithmetic, Logical, Relational', 'https://www.youtube.com/watch?v=QKzgOjxJy3g', 2, '16:45']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section2Id, javaCourseId, 'Control Flow - If-Else Statements', 'https://www.youtube.com/watch?v=Zm4DsTWfJWE', 3, '14:30']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section2Id, javaCourseId, 'Switch Statement and Patterns', 'https://www.youtube.com/watch?v=dChT43yqWCs', 4, '12:00']
    );

    // Section 3: Loops and Arrays
    const [section3] = await connection.execute(
      `INSERT INTO sections (course_id, title, order_number) VALUES (?, ?, ?)`,
      [javaCourseId, 'Loops and Arrays', 3]
    );
    const section3Id = section3.insertId;

    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section3Id, javaCourseId, 'For Loop in Java', 'https://www.youtube.com/watch?v=VQoTvGzZmPc', 1, '15:30']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section3Id, javaCourseId, 'While and Do-While Loops', 'https://www.youtube.com/watch?v=bUesRNXHyIk', 2, '13:45']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section3Id, javaCourseId, 'Arrays in Java - Single and Multi-dimensional', 'https://www.youtube.com/watch?v=VpTEAXWrKLg', 3, '20:00']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section3Id, javaCourseId, 'Enhanced For Loop (For-Each)', 'https://www.youtube.com/watch?v=6iF8Xb7Z3wQ', 4, '11:20']
    );

    // Section 4: Object-Oriented Programming (OOP)
    const [section4] = await connection.execute(
      `INSERT INTO sections (course_id, title, order_number) VALUES (?, ?, ?)`,
      [javaCourseId, 'Object-Oriented Programming Concepts', 4]
    );
    const section4Id = section4.insertId;

    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section4Id, javaCourseId, 'Introduction to OOP - Classes and Objects', 'https://www.youtube.com/watch?v=w3kcSTPEaAo', 1, '22:00']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section4Id, javaCourseId, 'Constructors in Java', 'https://www.youtube.com/watch?v=QKzgOjxJy3g', 2, '18:30']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section4Id, javaCourseId, 'Encapsulation and Access Modifiers', 'https://www.youtube.com/watch?v=OwmBHUwHBec', 3, '16:45']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section4Id, javaCourseId, 'Inheritance and Polymorphism', 'https://www.youtube.com/watch?v=pVqWPhD7yWI', 4, '25:00']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section4Id, javaCourseId, 'Abstraction - Abstract Classes and Interfaces', 'https://www.youtube.com/watch?v=CYNlEi4vLHw', 5, '20:15']
    );

    // Section 5: Advanced Java Concepts
    const [section5] = await connection.execute(
      `INSERT INTO sections (course_id, title, order_number) VALUES (?, ?, ?)`,
      [javaCourseId, 'Advanced Java Topics', 5]
    );
    const section5Id = section5.insertId;

    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section5Id, javaCourseId, 'Exception Handling in Java', 'https://www.youtube.com/watch?v=QKzgOjxJy3g', 1, '19:30']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section5Id, javaCourseId, 'Collections Framework - List, Set, Map', 'https://www.youtube.com/watch?v=9CS1WjP12Iw', 2, '28:00']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section5Id, javaCourseId, 'Generics in Java', 'https://www.youtube.com/watch?v=OwtTDVDVPSs', 3, '17:45']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section5Id, javaCourseId, 'File Handling and I/O Operations', 'https://www.youtube.com/watch?v=fuMRNHdCxKk', 4, '21:30']
    );

    console.log('   ✓ Java course content created (5 sections, 20 lessons)\n');

    // AI & ML COURSE - Comprehensive Structure
    console.log('🤖 Creating AI & ML Course Content...');
    
    // Section 1: Introduction to AI & ML
    const [section6] = await connection.execute(
      `INSERT INTO sections (course_id, title, order_number) VALUES (?, ?, ?)`,
      [aiCourseId, 'Introduction to AI and Machine Learning', 1]
    );
    const section6Id = section6.insertId;

    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section6Id, aiCourseId, 'What is AI? - Overview and Applications', 'https://www.youtube.com/watch?v=ad79fYnrEAM', 1, '12:30']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section6Id, aiCourseId, 'Machine Learning Basics - Supervised vs Unsupervised', 'https://www.youtube.com/watch?v=4qLTpWd8vRU', 2, '15:45']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section6Id, aiCourseId, 'Python for AI - Setup and Libraries', 'https://www.youtube.com/watch?v=gpwyAfuM-VA', 3, '18:20']
    );

    // Section 2: Neural Networks
    const [section7] = await connection.execute(
      `INSERT INTO sections (course_id, title, order_number) VALUES (?, ?, ?)`,
      [aiCourseId, 'Neural Networks and Deep Learning', 2]
    );
    const section7Id = section7.insertId;

    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section7Id, aiCourseId, 'Introduction to Neural Networks', 'https://www.youtube.com/watch?v=aircAruvnKk', 1, '20:00']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section7Id, aiCourseId, 'Backpropagation Explained', 'https://www.youtube.com/watch?v=Ilg3gGewQ5U', 2, '17:30']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section7Id, aiCourseId, 'Building Your First Neural Network', 'https://www.youtube.com/watch?v=tOHyVnAT6vw', 3, '22:15']
    );

    console.log('   ✓ AI & ML course content created (2 sections, 6 lessons)\n');

    // SQL COURSE - Comprehensive Structure
    console.log('💾 Creating SQL Course Content...');
    
    // Section 1: SQL Fundamentals
    const [section8] = await connection.execute(
      `INSERT INTO sections (course_id, title, order_number) VALUES (?, ?, ?)`,
      [sqlCourseId, 'SQL Fundamentals', 1]
    );
    const section8Id = section8.insertId;

    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section8Id, sqlCourseId, 'Introduction to Databases and SQL', 'https://www.youtube.com/watch?v=HXV31QK_QYI', 1, '10:00']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section8Id, sqlCourseId, 'SELECT Statement and WHERE Clause', 'https://www.youtube.com/watch?v=7S_tz1z_5bA', 2, '14:30']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section8Id, sqlCourseId, 'INSERT, UPDATE, DELETE Operations', 'https://www.youtube.com/watch?v=ph3XGhtsDaM', 3, '16:45']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section8Id, sqlCourseId, 'Aggregate Functions - COUNT, SUM, AVG', 'https://www.youtube.com/watch?v=qyTEnCbnhOA', 4, '13:20']
    );

    // Section 2: Advanced SQL
    const [section9] = await connection.execute(
      `INSERT INTO sections (course_id, title, order_number) VALUES (?, ?, ?)`,
      [sqlCourseId, 'Advanced SQL Queries', 2]
    );
    const section9Id = section9.insertId;

    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section9Id, sqlCourseId, 'JOINs - INNER, LEFT, RIGHT, FULL', 'https://www.youtube.com/watch?v=9hVyIGDrFNY', 1, '20:00']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section9Id, sqlCourseId, 'Subqueries and CTEs', 'https://www.youtube.com/watch?v=f3ZjefGP1lA', 2, '18:30']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section9Id, sqlCourseId, 'Stored Procedures and Functions', 'https://www.youtube.com/watch?v=WGOdwSQTaLw', 3, '22:00']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section9Id, sqlCourseId, 'Query Optimization Techniques', 'https://www.youtube.com/watch?v=0h655zcXZr4', 4, '19:45']
    );

    console.log('   ✓ SQL course content created (2 sections, 8 lessons)\n');

    // WEB DEVELOPMENT COURSE - Comprehensive Structure
    console.log('🌐 Creating Web Development Course Content...');
    
    // Section 1: HTML & CSS Fundamentals
    const [section10] = await connection.execute(
      `INSERT INTO sections (course_id, title, order_number) VALUES (?, ?, ?)`,
      [webDevCourseId, 'HTML & CSS Fundamentals', 1]
    );
    const section10Id = section10.insertId;

    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section10Id, webDevCourseId, 'Introduction to Web Development', 'https://www.youtube.com/watch?v=kUMe1FH4CHE', 1, '12:00']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section10Id, webDevCourseId, 'HTML Basics - Tags, Elements, and Attributes', 'https://www.youtube.com/watch?v=pVNw2aKFJBE', 2, '18:30']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section10Id, webDevCourseId, 'Forms and Input Validation', 'https://www.youtube.com/watch?v=fNcJuPIZ2WE', 3, '15:45']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section10Id, webDevCourseId, 'CSS Basics - Selectors and Properties', 'https://www.youtube.com/watch?v=1Rs2ND1ryYc', 4, '20:00']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section10Id, webDevCourseId, 'Box Model and Layout Techniques', 'https://www.youtube.com/watch?v=rIO53DDqjNk', 5, '16:30']
    );

    // Section 2: Responsive Design with Flexbox & Grid
    const [section11] = await connection.execute(
      `INSERT INTO sections (course_id, title, order_number) VALUES (?, ?, ?)`,
      [webDevCourseId, 'Responsive Design with Flexbox and CSS Grid', 2]
    );
    const section11Id = section11.insertId;

    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section11Id, webDevCourseId, 'Flexbox Fundamentals', 'https://www.youtube.com/watch?v=fYq5PXgSsbE', 1, '22:00']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section11Id, webDevCourseId, 'Building Layouts with Flexbox', 'https://www.youtube.com/watch?v=9BUfCzzlTmg', 2, '19:30']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section11Id, webDevCourseId, 'CSS Grid Complete Guide', 'https://www.youtube.com/watch?v=jV8B24rKD5o', 3, '25:00']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section11Id, webDevCourseId, 'Responsive Web Design Principles', 'https://www.youtube.com/watch?v=srvUrASNj0s', 4, '17:45']
    );

    // Section 3: JavaScript Essentials
    const [section12] = await connection.execute(
      `INSERT INTO sections (course_id, title, order_number) VALUES (?, ?, ?)`,
      [webDevCourseId, 'JavaScript Programming Essentials', 3]
    );
    const section12Id = section12.insertId;

    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section12Id, webDevCourseId, 'JavaScript Basics - Variables and Data Types', 'https://www.youtube.com/watch?v=W6NZfCO5SIk', 1, '20:00']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section12Id, webDevCourseId, 'Functions and Scope in JavaScript', 'https://www.youtube.com/watch?v=xGWTDaBusQ0', 2, '18:30']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section12Id, webDevCourseId, 'Arrays and Objects', 'https://www.youtube.com/watch?v/oigfaZ8ApsM', 3, '22:15']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section12Id, webDevCourseId, 'DOM Manipulation Basics', 'https://www.youtube.com/watch?v=y17RuWkWdn8', 4, '21:00']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section12Id, webDevCourseId, 'Event Handling and Listeners', 'https://www.youtube.com/watch?v=XF1-mnlOfCs', 5, '19:30']
    );

    // Section 4: Advanced JavaScript & ES6+
    const [section13] = await connection.execute(
      `INSERT INTO sections (course_id, title, order_number) VALUES (?, ?, ?)`,
      [webDevCourseId, 'Advanced JavaScript and ES6+', 4]
    );
    const section13Id = section13.insertId;

    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section13Id, webDevCourseId, 'ES6 Arrow Functions and Destructuring', 'https://www.youtube.com/watch?v=NCwa_xi0Uuc', 1, '16:45']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section13Id, webDevCourseId, 'Promises and Async/Await', 'https://www.youtube.com/watch?v=ZYb_ZU8LNxs', 2, '20:30']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section13Id, webDevCourseId, 'Fetch API and AJAX', 'https://www.youtube.com/watch?v=cuEtnrL9-H0', 3, '18:00']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section13Id, webDevCourseId, 'Modules and Import/Export', 'https://www.youtube.com/watch?v=cRHQNNcYf6s', 4, '15:30']
    );

    // Section 5: React.js Fundamentals
    const [section14] = await connection.execute(
      `INSERT INTO sections (course_id, title, order_number) VALUES (?, ?, ?)`,
      [webDevCourseId, 'React.js Fundamentals', 5]
    );
    const section14Id = section14.insertId;

    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section14Id, webDevCourseId, 'Introduction to React and Components', 'https://www.youtube.com/watch?v=Tn65PIeEeI4', 1, '22:00']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section14Id, webDevCourseId, 'JSX Syntax and Rendering', 'https://www.youtube.com/watch?v/qz0aGYrrlhU', 2, '18:30']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section14Id, webDevCourseId, 'State and Props in React', 'https://www.youtube.com/watch?v=5ekdpvOB3nk', 3, '21:15']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section14Id, webDevCourseId, 'Handling Events in React', 'https://www.youtube.com/watch?v=nuHQxREaK0A', 4, '17:00']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section14Id, webDevCourseId, 'React Hooks - useState and useEffect', 'https://www.youtube.com/watch?v=O6P86uwtdrY', 5, '24:30']
    );

    // Section 6: Node.js & Express Backend
    const [section15] = await connection.execute(
      `INSERT INTO sections (course_id, title, order_number) VALUES (?, ?, ?)`,
      [webDevCourseId, 'Node.js and Express Backend Development', 6]
    );
    const section15Id = section15.insertId;

    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section15Id, webDevCourseId, 'Introduction to Node.js', 'https://www.youtube.com/watch?v=TlB_eWDSMt4', 1, '20:00']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section15Id, webDevCourseId, 'Building REST APIs with Express', 'https://www.youtube.com/watch?v=L72fhGm1tfE', 2, '25:30']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section15Id, webDevCourseId, 'Middleware in Express', 'https://www.youtube.com/watch?v=SccSCuHhOw0', 3, '18:45']
    );
    await connection.execute(
      `INSERT INTO lessons (section_id, course_id, title, youtube_url, order_number, duration) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [section15Id, webDevCourseId, 'Connecting to Databases with MongoDB', 'https://www.youtube.com/watch?v=ofw2FgLZW9Y', 4, '22:00']
    );

    console.log('   ✓ Web Development course content created (6 sections, 27 lessons)\n');

    // Create sample enrollment
    console.log('📝 Creating sample enrollments...');
    await connection.execute(
      `INSERT INTO enrollments (student_id, course_id, status) VALUES (?, ?, ?)`,
      [studentId, javaCourseId, 'active']
    );
    await connection.execute(
      `INSERT INTO enrollments (student_id, course_id, status) VALUES (?, ?, ?)`,
      [studentId, webDevCourseId, 'active']
    );
    console.log('   ✓ Sample enrollments created\n');

    connection.release();

    console.log('✅ Database seeding completed successfully!\n');
    console.log('📋 Summary:');
    console.log(`   • Users: 3 (1 admin, 1 instructor, 1 student)`);
    console.log(`   • Courses: 5 (Java, Web Dev, Python, AI & ML, SQL)`);
    console.log(`   • Sections: 15`);
    console.log(`   • Lessons: 61 total (20 Java + 27 Web Dev + 6 AI + 8 SQL)`);
    console.log(`   • Enrollments: 2`);
    console.log(`   • Progress records: 0\n`);
    
    console.log('🔐 Login credentials:');
    console.log('   Student: student@lms.com / password123');
    console.log('   Instructor: instructor@lms.com / password123');
    console.log('   Admin: admin@lms.com / password123\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    throw error;
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('✨ Done! You can now start the backend server.\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed database:', error);
    process.exit(1);
  });
