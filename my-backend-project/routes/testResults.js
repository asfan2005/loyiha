const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();

// Yangi test natijasini saqlash
router.post('/', async (req, res) => {
  try {
    const TestResult = req.app.locals.db.TestResult;
    const {
      userName,
      userEmail,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      skippedQuestions,
      totalScore,
      percentage,
      timeTaken,
      startTime,
      endTime,
      testDetails,
      category,
      difficulty,
      status
    } = req.body;

    // Asosiy validatsiya
    if (!userName || !totalQuestions) {
      return res.status(400).json({
        success: false,
        message: 'Foydalanuvchi ismi va savollar soni kiritilishi shart'
      });
    }

    // IP address va user agent olish
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Test natijasini saqlash
    const testResult = await TestResult.create({
      userName: userName.trim(),
      userEmail: userEmail ? userEmail.trim() : null,
      totalQuestions,
      correctAnswers: correctAnswers || 0,
      wrongAnswers: wrongAnswers || 0,
      skippedQuestions: skippedQuestions || 0,
      totalScore: totalScore || 0,
      percentage: percentage || 0,
      timeTaken: timeTaken || 0,
      startTime: startTime || new Date(),
      endTime: endTime || new Date(),
      testDetails: testDetails || [],
      category,
      difficulty,
      status: status || 'completed',
      ipAddress,
      userAgent
    });

    res.status(201).json({
      success: true,
      message: 'Test natijasi muvaffaqiyatli saqlandi',
      data: testResult
    });

  } catch (error) {
    console.error('Test natijasini saqlashda xato:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Ma\'lumotlar validatsiyadan o\'tmadi',
        errors: errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Test natijasini saqlashda xato yuz berdi',
      error: error.message
    });
  }
});

// Barcha test natijalarini olish (admin uchun)
router.get('/', async (req, res) => {
  try {
    const TestResult = req.app.locals.db.TestResult;
    const { 
      limit = 50, 
      page = 1, 
      sortBy = 'createdAt', 
      order = 'DESC',
      userName,
      status,
      fromDate,
      toDate
    } = req.query;

    const where = {};
    
    // Filtrlash
    if (userName) {
      where.userName = { [Op.iLike]: `%${userName}%` };
    }
    if (status) {
      where.status = status;
    }
    if (fromDate || toDate) {
      where.createdAt = {};
      if (fromDate) where.createdAt[Op.gte] = new Date(fromDate);
      if (toDate) where.createdAt[Op.lte] = new Date(toDate);
    }

    // Pagination
    const offset = (page - 1) * limit;
    
    const { count, rows: results } = await TestResult.findAndCountAll({
      where,
      order: [[sortBy, order]],
      limit: parseInt(limit),
      offset: offset,
      attributes: {
        exclude: ['testDetails', 'userAgent'] // Katta ma'lumotlarni chiqarib tashlash
      }
    });

    res.json({
      success: true,
      results: results,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalResults: count,
        hasNext: page * limit < count,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Test natijalarini olishda xato:', error);
    res.status(500).json({
      success: false,
      message: 'Test natijalarini olishda xato yuz berdi',
      error: error.message
    });
  }
});

// Bitta test natijasini ID bo'yicha olish
router.get('/:id', async (req, res) => {
  try {
    const TestResult = req.app.locals.db.TestResult;
    const result = await TestResult.findByPk(req.params.id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Test natijasi topilmadi'
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Test natijasini olishda xato:', error);
    res.status(500).json({
      success: false,
      message: 'Test natijasini olishda xato yuz berdi',
      error: error.message
    });
  }
});

// Statistika olish
router.get('/stats/overview', async (req, res) => {
  try {
    const TestResult = req.app.locals.db.TestResult;
    const sequelize = req.app.locals.db.sequelize;
    
    // Umumiy statistika
    const totalTests = await TestResult.count();
    const totalUsers = await TestResult.count({
      distinct: true,
      col: 'userName'
    });
    
    // O'rtacha natijalar
    const averageStats = await TestResult.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('percentage')), 'avgPercentage'],
        [sequelize.fn('AVG', sequelize.col('correctAnswers')), 'avgCorrect'],
        [sequelize.fn('AVG', sequelize.col('timeTaken')), 'avgTime']
      ],
      raw: true
    });
    
    // Oxirgi 7 kunlik statistika
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const dailyStats = await TestResult.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('*')), 'count'],
        [sequelize.fn('AVG', sequelize.col('percentage')), 'avgPercentage']
      ],
      where: {
        createdAt: { [Op.gte]: lastWeek }
      },
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
      raw: true
    });
    
    // Eng yaxshi natijalar
    const topResults = await TestResult.findAll({
      attributes: ['id', 'userName', 'percentage', 'correctAnswers', 'totalQuestions', 'createdAt'],
      order: [['percentage', 'DESC']],
      limit: 10
    });
    
    // Kategoriya bo'yicha statistika
    const categoryStats = await TestResult.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('*')), 'count'],
        [sequelize.fn('AVG', sequelize.col('percentage')), 'avgPercentage']
      ],
      where: {
        category: { [Op.ne]: null }
      },
      group: ['category'],
      order: [[sequelize.fn('COUNT', sequelize.col('*')), 'DESC']],
      raw: true
    });
    
    res.json({
      success: true,
      data: {
        totalTests,
        totalUsers,
        averagePercentage: averageStats.avgPercentage || 0,
        averageCorrectAnswers: averageStats.avgCorrect || 0,
        averageTimeTaken: averageStats.avgTime || 0,
        dailyStats,
        topResults,
        categoryStats
      }
    });
  } catch (error) {
    console.error('Statistikani olishda xato:', error);
    res.status(500).json({
      success: false,
      message: 'Statistikani olishda xato yuz berdi',
      error: error.message
    });
  }
});

// Foydalanuvchining oxirgi natijalarini olish
router.get('/user/:userName', async (req, res) => {
  try {
    const TestResult = req.app.locals.db.TestResult;
    const { limit = 10 } = req.query;
    
    const results = await TestResult.findAll({
      where: {
        userName: { [Op.iLike]: req.params.userName }
      },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      attributes: {
        exclude: ['testDetails', 'userAgent', 'ipAddress']
      }
    });
    
    res.json({
      success: true,
      results: results
    });
  } catch (error) {
    console.error('Foydalanuvchi natijalarini olishda xato:', error);
    res.status(500).json({
      success: false,
      message: 'Foydalanuvchi natijalarini olishda xato yuz berdi',
      error: error.message
    });
  }
});

// Test natijasini o'chirish (admin uchun)
router.delete('/:id', async (req, res) => {
  try {
    const TestResult = req.app.locals.db.TestResult;
    const result = await TestResult.findByPk(req.params.id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Test natijasi topilmadi'
      });
    }

    await result.destroy();

    res.json({
      success: true,
      message: 'Test natijasi muvaffaqiyatli o\'chirildi'
    });

  } catch (error) {
    console.error('Test natijasini o\'chirishda xato:', error);
    res.status(500).json({
      success: false,
      message: 'Test natijasini o\'chirishda xato yuz berdi',
      error: error.message
    });
  }
});

module.exports = router;
