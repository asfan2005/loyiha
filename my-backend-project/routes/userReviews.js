const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();

// Barcha tasdiqlanmagan sharhlarni olish (admin uchun)
router.get('/', async (req, res) => {
  try {
    const UserReview = req.app.locals.db.UserReview;
    const TestResult = req.app.locals.db.TestResult;
    const { 
      limit = 50, 
      page = 1, 
      isApproved,
      isActive,
      rating,
      sortBy = 'createdAt',
      order = 'DESC'
    } = req.query;

    const where = {};
    
    // Filtrlash
    if (isApproved !== undefined) {
      where.isApproved = isApproved === 'true';
    }
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }
    if (rating) {
      where.rating = parseInt(rating);
    }

    // Pagination
    const offset = (page - 1) * limit;
    
    const { count, rows: reviews } = await UserReview.findAndCountAll({
      where,
      include: [{
        model: TestResult,
        as: 'testResult',
        attributes: ['id', 'userName', 'percentage', 'correctAnswers', 'totalQuestions']
      }],
      order: [[sortBy, order]],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      success: true,
      reviews: reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalReviews: count,
        hasNext: page * limit < count,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Sharhlarni olishda xato:', error);
    res.status(500).json({
      success: false,
      message: 'Sharhlarni olishda xato yuz berdi',
      error: error.message
    });
  }
});

// Tasdiqlangan sharhlarni olish (public)
router.get('/approved', async (req, res) => {
  try {
    const UserReview = req.app.locals.db.UserReview;
    const { limit = 10 } = req.query;
    
    const reviews = await UserReview.findAll({
      where: {
        isApproved: true,
        isActive: true
      },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      attributes: {
        exclude: ['ipAddress', 'isApproved', 'isActive']
      }
    });

    res.json({
      success: true,
      reviews: reviews
    });
  } catch (error) {
    console.error('Tasdiqlangan sharhlarni olishda xato:', error);
    res.status(500).json({
      success: false,
      message: 'Sharhlarni olishda xato yuz berdi',
      error: error.message
    });
  }
});

// Yangi sharh qo'shish
router.post('/', async (req, res) => {
  try {
    const UserReview = req.app.locals.db.UserReview;
    const {
      userName,
      userEmail,
      rating,
      comment,
      testResultId
    } = req.body;

    // Asosiy validatsiya
    if (!userName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Ism, reyting va izoh kiritilishi shart'
      });
    }

    // IP address olish
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Bir IP dan ko'p sharh yuborilishini cheklash (24 soat ichida)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const recentReview = await UserReview.findOne({
      where: {
        ipAddress,
        createdAt: { [Op.gte]: yesterday }
      }
    });

    if (recentReview) {
      return res.status(429).json({
        success: false,
        message: 'Siz yaqinda sharh qoldirganingiz. Iltimos, keyinroq urinib ko\'ring.'
      });
    }

    // Yangi sharh yaratish
    const review = await UserReview.create({
      userName: userName.trim(),
      userEmail: userEmail ? userEmail.trim() : null,
      rating: parseInt(rating),
      comment: comment.trim(),
      testResultId: testResultId || null,
      ipAddress,
      isApproved: false, // Admin tasdiqlashi kerak
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Sharhingiz muvaffaqiyatli qabul qilindi. Admin tasdiqlashidan so\'ng ko\'rsatiladi.',
      data: {
        id: review.id,
        userName: review.userName,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt
      }
    });

  } catch (error) {
    console.error('Sharh qo\'shishda xato:', error);
    
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
      message: 'Sharh qo\'shishda xato yuz berdi',
      error: error.message
    });
  }
});

// Sharhni tasdiqlash/rad etish (admin uchun)
router.put('/:id', async (req, res) => {
  try {
    const UserReview = req.app.locals.db.UserReview;
    const { isApproved, isActive } = req.body;

    const review = await UserReview.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Sharh topilmadi'
      });
    }

    const updateData = {};
    if (isApproved !== undefined) updateData.isApproved = Boolean(isApproved);
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    await review.update(updateData);
    await review.reload();

    res.json({
      success: true,
      message: 'Sharh muvaffaqiyatli yangilandi',
      data: review
    });

  } catch (error) {
    console.error('Sharhni yangilashda xato:', error);
    res.status(500).json({
      success: false,
      message: 'Sharhni yangilashda xato yuz berdi',
      error: error.message
    });
  }
});

// Sharhni o'chirish (admin uchun)
router.delete('/:id', async (req, res) => {
  try {
    const UserReview = req.app.locals.db.UserReview;
    const review = await UserReview.findByPk(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Sharh topilmadi'
      });
    }

    await review.destroy();

    res.json({
      success: true,
      message: 'Sharh muvaffaqiyatli o\'chirildi'
    });

  } catch (error) {
    console.error('Sharhni o\'chirishda xato:', error);
    res.status(500).json({
      success: false,
      message: 'Sharhni o\'chirishda xato yuz berdi',
      error: error.message
    });
  }
});

// Reyting statistikasini olish
router.get('/stats/ratings', async (req, res) => {
  try {
    const UserReview = req.app.locals.db.UserReview;
    const sequelize = req.app.locals.db.sequelize;
    
    // Umumiy o'rtacha reyting
    const avgRating = await UserReview.findOne({
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'average']
      ],
      where: {
        isApproved: true,
        isActive: true
      },
      raw: true
    });
    
    // Reyting taqsimoti
    const ratingDistribution = await UserReview.findAll({
      attributes: [
        'rating',
        [sequelize.fn('COUNT', sequelize.col('*')), 'count']
      ],
      where: {
        isApproved: true,
        isActive: true
      },
      group: ['rating'],
      order: [['rating', 'DESC']],
      raw: true
    });
    
    // Jami sharhlar soni
    const totalReviews = await UserReview.count({
      where: {
        isApproved: true,
        isActive: true
      }
    });
    
    res.json({
      success: true,
      data: {
        averageRating: avgRating.average || 0,
        totalReviews,
        ratingDistribution
      }
    });
  } catch (error) {
    console.error('Reyting statistikasini olishda xato:', error);
    res.status(500).json({
      success: false,
      message: 'Statistikani olishda xato yuz berdi',
      error: error.message
    });
  }
});

module.exports = router;
