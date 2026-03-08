const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (userId) => {
  try {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    });
    console.log('Token generated successfully for user:', userId);
    return token;
  } catch (error) {
    console.error('JWT sign error:', error);
    throw error;
  }
};

// Register new user
exports.register = async (req, res) => {
  try {
    console.log('Register attempt:', req.body);
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }

    // Check if user already exists
    console.log('Checking if user exists:', email);
    let existingUser;
    try {
      existingUser = await User.findByEmail(email);
    } catch (dbError) {
      console.error('Database error during findByEmail:', dbError);
      throw new Error('Database error: ' + dbError.message);
    }
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // Hash password
    console.log('Hashing password...');
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (hashError) {
      console.error('Bcrypt hash error:', hashError);
      throw new Error('Password hashing failed: ' + hashError.message);
    }

    // Create user
    console.log('Creating user in database...');
    let userId;
    try {
      userId = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'student'
      });
      console.log('User created with ID:', userId);
    } catch (createError) {
      console.error('Database error during user creation:', createError);
      throw new Error('Failed to create user: ' + createError.message);
    }

    // Generate token
    let token;
    try {
      token = generateToken(userId);
    } catch (tokenError) {
      console.error('Token generation error:', tokenError);
      throw new Error('Token generation failed: ' + tokenError.message);
    }

    // Get created user
    const user = await User.findById(userId);

    console.log('Registration successful for:', email);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('\n=== REGISTER ERROR ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Request body:', req.body);
    console.error('=====================\n');
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration',
      error: error.message,
      debug: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email and password' 
      });
    }

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    delete user.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
