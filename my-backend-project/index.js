const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Ma'lumotlar bazasi ulanishi
const connectDB = require('./config/database');
const defineQuestion = require('./models/Question');
const defineTestResult = require('./models/TestResult');
const defineUserReview = require('./models/UserReview');

const app = express();
const PORT = process.env.PORT || 3000;

// Global variables uchun
let db = {};

// Ma'lumotlar bazasiga ulanish va modellarni sozlash
const initializeDatabase = async () => {
  try {
    const sequelize = await connectDB();
    
    // Modellarni e'lon qilish
    db.Question = defineQuestion(sequelize);
    db.TestResult = defineTestResult(sequelize);
    db.UserReview = defineUserReview(sequelize);
    db.sequelize = sequelize;
    
    // Associations
    if (db.UserReview.associate) {
      db.UserReview.associate(db);
    }
    
    // Jadvallarni yaratish (development mode da)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: false }); // force: true jadvallerni qayta yaratadi
      console.log('📊 Ma\'lumotlar bazasi jadvallari muvaffaqiyatli sinxronlashtirildi');
    }
    
    // Global app ga db ni biriktirish
    app.locals.db = db;
    
  } catch (error) {
    console.error('❌ Ma\'lumotlar bazasini ishga tushirishda xato:', error);
    process.exit(1);
  }
};

initializeDatabase();

// Route'lar
const questionRoutes = require('./routes/questions');
const testResultRoutes = require('./routes/testResults');
const userReviewRoutes = require('./routes/userReviews');

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Test System Backend API ishlamoqda!',
    version: '1.0.0',
    endpoints: {
      questions: '/api/questions',
      testResults: '/api/test-results',
      reviews: '/api/reviews',
      health: '/health'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/questions', questionRoutes);
app.use('/api/test-results', testResultRoutes);
app.use('/api/reviews', userReviewRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint topilmadi',
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /api/questions',
      'POST /api/questions',
      'GET /api/questions/:id',
      'PUT /api/questions/:id',
      'DELETE /api/questions/:id',
      'GET /api/test-results',
      'POST /api/test-results',
      'GET /api/test-results/:id',
      'GET /api/test-results/stats',
      'GET /api/reviews',
      'POST /api/reviews',
      'PUT /api/reviews/:id',
      'DELETE /api/reviews/:id'
    ]
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server xatosi:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Ichki server xatosi',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal qabul qilindi, serverni yopish...');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server muvaffaqiyatli ishga tushdi!`);
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`📊 API Documentation: http://localhost:${PORT}/`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/health`);
  console.log(`❓ Questions API: http://localhost:${PORT}/api/questions`);
});
