const express = require('express');
const { Op } = require('sequelize');
const router = express.Router();

// Barcha savollarni olish
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, limit = 50, page = 1, random, isActive } = req.query;
    const Question = req.app.locals.db.Question;
    
    const where = {};
    
    // isActive filter
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    } else {
      where.isActive = true; // default
    }
    
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;

    // Random savollar olish
    if (random === 'true') {
      const allQuestions = await Question.findAll({
        where,
        attributes: ['id', 'questionText', 'options', 'category', 'difficulty', 'points']
      });
      
      // Random tanlash
      const shuffled = allQuestions.sort(() => 0.5 - Math.random());
      const randomQuestions = shuffled.slice(0, parseInt(limit));
      
      // Format questions for frontend (questionText -> question, extract correctAnswer)
      const formattedQuestions = randomQuestions.map(q => {
        const questionData = q.toJSON();
        const correctOption = questionData.options.findIndex(opt => opt.isCorrect === true);
        
        return {
          id: questionData.id,
          question: questionData.questionText,
          options: questionData.options.map(opt => opt.text),
          correctAnswer: correctOption,
          category: questionData.category,
          difficulty: questionData.difficulty,
          points: questionData.points
        };
      });
      
      res.json({
        success: true,
        questions: formattedQuestions,
        total: formattedQuestions.length
      });
      return;
    }

    // Oddiy pagination bilan olish
    const offset = (page - 1) * limit;
    
    const { count, rows: questions } = await Question.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      success: true,
      questions: questions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(count / limit),
        totalQuestions: count,
        hasNext: page * limit < count,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Savollarni olishda xato:', error);
    res.status(500).json({
      success: false,
      message: 'Savollarni olishda xato yuz berdi',
      error: error.message
    });
  }
});

// Bitta savolni ID bo'yicha olish
router.get('/:id', async (req, res) => {
  try {
    const Question = req.app.locals.db.Question;
    const question = await Question.findByPk(req.params.id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Savol topilmadi'
      });
    }

    res.json({
      success: true,
      data: question
    });
  } catch (error) {
    console.error('Savolni olishda xato:', error);
    res.status(500).json({
      success: false,
      message: 'Savolni olishda xato yuz berdi',
      error: error.message
    });
  }
});

// Yangi savol qo'shish
router.post('/', async (req, res) => {
  try {
    const Question = req.app.locals.db.Question;
    const { questionText, options, category, difficulty, points, explanation } = req.body;

    // Asosiy validatsiya
    if (!questionText || !options || !category) {
      return res.status(400).json({
        success: false,
        message: 'Savol matni, variantlar va kategoriya kiritilishi shart'
      });
    }

    // Variantlar validatsiyasi
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Kamida 2 ta variant bo\'lishi kerak'
      });
    }

    // To'g'ri javob borligini tekshirish
    const correctAnswers = options.filter(option => option.isCorrect);
    if (correctAnswers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Kamida bitta to\'g\'ri javob belgilanishi kerak'
      });
    }

    // Yangi savol yaratish
    const questionData = {
      questionText: questionText.trim(),
      options: options.map(option => ({
        text: option.text.trim(),
        isCorrect: Boolean(option.isCorrect)
      })),
      category: category.trim(),
      difficulty: difficulty || 'o\'rta',
      points: points || 1,
      explanation: explanation ? explanation.trim() : null
    };

    const savedQuestion = await Question.create(questionData);

    res.status(201).json({
      success: true,
      message: 'Savol muvaffaqiyatli qo\'shildi',
      data: savedQuestion
    });

  } catch (error) {
    console.error('Savol qo\'shishda xato:', error);
    
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
      message: 'Savol qo\'shishda xato yuz berdi',
      error: error.message
    });
  }
});

// Savolni yangilash
router.put('/:id', async (req, res) => {
  try {
    const Question = req.app.locals.db.Question;
    const { questionText, options, category, difficulty, points, explanation, isActive } = req.body;

    const question = await Question.findByPk(req.params.id);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Savol topilmadi'
      });
    }

    // To'g'ri javob borligini tekshirish (agar options yuborilgan bo'lsa)
    if (options) {
      const correctAnswers = options.filter(option => option.isCorrect);
      if (correctAnswers.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Kamida bitta to\'g\'ri javob belgilanishi kerak'
        });
      }
    }

    // Ma'lumotlarni yangilash
    const updateData = {};
    if (questionText) updateData.questionText = questionText.trim();
    if (options) updateData.options = options.map(option => ({
      text: option.text.trim(),
      isCorrect: Boolean(option.isCorrect)
    }));
    if (category) updateData.category = category.trim();
    if (difficulty) updateData.difficulty = difficulty;
    if (points !== undefined) updateData.points = points;
    if (explanation !== undefined) updateData.explanation = explanation ? explanation.trim() : null;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    await question.update(updateData);
    await question.reload();

    res.json({
      success: true,
      message: 'Savol muvaffaqiyatli yangilandi',
      data: question
    });

  } catch (error) {
    console.error('Savolni yangilashda xato:', error);
    
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
      message: 'Savolni yangilashda xato yuz berdi',
      error: error.message
    });
  }
});

// Savolni o'chirish (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const Question = req.app.locals.db.Question;
    const question = await Question.findByPk(req.params.id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Savol topilmadi'
      });
    }

    // Soft delete - faqat isActive ni false qilish
    await question.update({ isActive: false });

    res.json({
      success: true,
      message: 'Savol muvaffaqiyatli o\'chirildi'
    });

  } catch (error) {
    console.error('Savolni o\'chirishda xato:', error);
    res.status(500).json({
      success: false,
      message: 'Savolni o\'chirishda xato yuz berdi',
      error: error.message
    });
  }
});

// Kategoriyalar ro'yxatini olish
router.get('/categories/list', async (req, res) => {
  try {
    const Question = req.app.locals.db.Question;
    const categories = await Question.findAll({
      attributes: ['category'],
      where: { isActive: true },
      group: ['category'],
      raw: true
    });
    
    const categoryList = categories.map(item => item.category).sort();
    
    res.json({
      success: true,
      data: categoryList
    });
  } catch (error) {
    console.error('Kategoriyalarni olishda xato:', error);
    res.status(500).json({
      success: false,
      message: 'Kategoriyalarni olishda xato yuz berdi',
      error: error.message
    });
  }
});

// Statistika olish
router.get('/stats/overview', async (req, res) => {
  try {
    const Question = req.app.locals.db.Question;
    const sequelize = req.app.locals.db.sequelize;
    
    const totalQuestions = await Question.count({ where: { isActive: true } });
    
    const categories = await Question.findAll({
      attributes: ['category'],
      where: { isActive: true },
      group: ['category'],
      raw: true
    });
    const totalCategories = categories.length;
    
    const difficultyStats = await Question.findAll({
      attributes: [
        'difficulty',
        [sequelize.fn('COUNT', sequelize.col('*')), 'count']
      ],
      where: { isActive: true },
      group: ['difficulty'],
      order: [['difficulty', 'ASC']],
      raw: true
    });

    const categoryStats = await Question.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('*')), 'count']
      ],
      where: { isActive: true },
      group: ['category'],
      order: [[sequelize.fn('COUNT', sequelize.col('*')), 'DESC']],
      limit: 10,
      raw: true
    });

    res.json({
      success: true,
      data: {
        totalQuestions,
        totalCategories,
        difficultyStats,
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

module.exports = router;
