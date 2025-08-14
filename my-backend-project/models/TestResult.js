const { DataTypes } = require('sequelize');

const defineTestResult = (sequelize) => {
  const TestResult = sequelize.define('TestResult', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Foydalanuvchi ismi kiritilishi shart'
        },
        len: {
          args: [2, 100],
          msg: 'Ism kamida 2 ta belgidan iborat bo\'lishi kerak'
        }
      }
    },
    userEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'To\'g\'ri email formatini kiriting'
        }
      }
    },
    totalQuestions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    correctAnswers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    wrongAnswers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    skippedQuestions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    totalScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    percentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    timeTaken: {
      type: DataTypes.INTEGER, // seconds
      allowNull: false,
      defaultValue: 0
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    testDetails: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      // Bu yerda har bir savol va javoblar saqlanadi
      // Format: [{ questionId, question, userAnswer, correctAnswer, isCorrect, points }]
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    difficulty: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('completed', 'timeout', 'abandoned'),
      defaultValue: 'completed'
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    userAgent: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'test_results',
    timestamps: true,
    indexes: [
      {
        fields: ['userName']
      },
      {
        fields: ['userEmail']
      },
      {
        fields: ['percentage']
      },
      {
        fields: ['createdAt']
      },
      {
        fields: ['status']
      }
    ]
  });

  return TestResult;
};

module.exports = defineTestResult;
