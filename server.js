const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection, initializeDatabase } = require('./config/database');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const progressRoutes = require('./routes/progress');

// Initialize Express app
const app = express();

// CORS Middleware - MUST BE FIRST before any other middleware
// Modified: Skip OPTIONS for /api/ai/chat to use custom handler
app.use((req, res, next) => {
  // Let /api/ai/chat OPTIONS requests pass through to custom handler
  if (req.method === 'OPTIONS' && req.path === '/api/ai/chat') {
   return next();
  }
  
 res.header('Access-Control-Allow-Origin', '*');
 res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
 res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
 res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
   return res.sendStatus(200);
  }
  
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Debug middleware for AI routes
app.use('/api/ai', (req, res, next) => {
  console.log('🔍 AI Route accessed:', req.method, req.path);
  next();
});

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'LMS API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'unknown'
  });
});

// API info route
app.get('/api', (req, res) => {
 res.json({
   success: true,
   message: 'LMS API v1',
    endpoints: {
      auth: '/api/auth',
      login: 'POST /api/auth/login',
     register: 'POST /api/auth/register',
     courses: '/api/courses',
     ai: 'POST /api/ai/chat'
    }
  });
});

// TEST ROUTE - Verify POST routing works
app.post('/api/test-post', (req, res) => {
 console.log('✅ TEST POST ROUTE HIT!');
 res.json({
   success: true,
   message: 'POST routing works!',
    body: req.body,
    timestamp: new Date().toISOString()
  });
});

// Database health check route
app.get('/api/health/db', async (req, res) => {
  try {
    const { testConnection } = require('./config/database');
    const connected = await testConnection();
    
    res.json({
      success: connected,
      database: connected ? 'Connected' : 'Disconnected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API Routes - CRITICAL: AI routes MUST come before wildcard routes
// AI routes must be registered BEFORE /:id wildcard routes in courses
app.post('/api/ai/chat', async (req, res) => {
  console.log('🤖 AI CHAT ROUTE HIT - Method:', req.method);
  console.log('Request headers:', JSON.stringify(req.headers));
  console.log('Request body:', JSON.stringify(req.body));
  
  try {
  const { prompt } = req.body;
   
  console.log('🤖 Received AI chat request');
  console.log('Prompt:', prompt ? 'Present' : 'Missing');
   
   if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
   }

  console.log('🤖 Forwarding request to Hugging Face API...');
  console.log('Token exists:', process.env.HUGGINGFACE_TOKEN ? 'YES' : 'NO');
   
  const response = await fetch('https://router.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
    method: 'POST',
    headers: {
       'Authorization': `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       inputs: prompt,
       parameters: {
         max_new_tokens: 300,
         temperature: 0.8,
         top_p: 0.95,
        return_full_text: false,
         do_sample: true,
        repetition_penalty: 1.2
       }
     })
   });

  console.log('Hugging Face API Response Status:', response.status);

   if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Hugging Face API Error:', errorData);
    return res.status(response.status).json(errorData);
   }

  const result = await response.json();
  console.log('✅ AI Response received');
  console.log('Response:', JSON.stringify(result).substring(0, 100));
   
  res.json(result);
  } catch (error) {
  console.error('❌ Proxy Error:', error);
  console.error('Error stack:', error.stack);
  res.status(500).json({ 
    error: 'Failed to get AI response',
     details: error.message 
   });
  }
});

// Other API Routes (these have wildcards like /:id that can interfere)
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', progressRoutes);

// AI Health Check Route (must be before catch-all routes)
app.get('/api/ai/health', (req, res) => {
  console.log('✅ AI health check requested');
  res.json({
    success: true,
    message: 'AI endpoint is available',
    chatEndpoint: 'POST /api/ai/chat',
    timestamp: new Date().toISOString()
  });
});

// Hugging Face AI Proxy Route (to avoid CORS issues)
// Note: OPTIONS is handled by CORS middleware above
app.post('/api/ai/chat', async (req, res) => {
  console.log('🤖 AI CHAT ROUTE HIT - Method:', req.method);
  console.log('Request headers:', JSON.stringify(req.headers));
  console.log('Request body:', JSON.stringify(req.body));
  
  try {
    const { prompt } = req.body;
    
    console.log('🤖 Received AI chat request');
    console.log('Prompt:', prompt ? 'Present' : 'Missing');
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('🤖 Forwarding request to Hugging Face API...');
    console.log('Token exists:', process.env.HUGGINGFACE_TOKEN ? 'YES' : 'NO');
    
    const response = await fetch('https://router.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 300,
          temperature: 0.8,
          top_p: 0.95,
          return_full_text: false,
          do_sample: true,
          repetition_penalty: 1.2
        }
      })
    });

    console.log('Hugging Face API Response Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Hugging Face API Error:', errorData);
      return res.status(response.status).json(errorData);
    }

    const result = await response.json();
    console.log('✅ AI Response received');
    console.log('Response:', JSON.stringify(result).substring(0, 100));
    
    res.json(result);
  } catch (error) {
    console.error('❌ Proxy Error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to get AI response',
      details: error.message 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 10000;

async function startServer() {
  // Test database connection
  await testConnection();
  
  // Initialize database schema
  await initializeDatabase();
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📚 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 http://localhost:${PORT}\n`);
  });
}

startServer();

module.exports = app;
