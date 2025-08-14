const { DataTypes } = require('sequelize');

const defineQuestion = (sequelize) => {
  const Question = sequelize.define('Question', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    questionText: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Savol matni kiritilishi shart'
        },
        len: {
          args: [10, 1000],
          msg: 'Savol kamida 10 ta belgidan iborat bo\'lishi kerak'
        }
      }
    },
    options: {
      type: DataTypes.JSONB,
      allowNull: false,
      validate: {
        isValidOptions(value) {
          if (!Array.isArray(value)) {
            throw new Error('Variantlar array formatida bo\'lishi kerak');
          }
          if (value.length < 2 || value.length > 6) {
            throw new Error('Kamida 2 ta, ko\'pi bilan 6 ta variant bo\'lishi kerak');
          }
          
          const correctAnswers = value.filter(option => option.isCorrect);
          if (correctAnswers.length === 0) {
            throw new Error('Kamida bitta to\'g\'ri javob bo\'lishi kerak');
          }

          // Har bir variant uchun tekshirish
          value.forEach(option => {
            if (!option.text || typeof option.text !== 'string') {
              throw new Error('Har bir variant matni bo\'lishi kerak');
            }
            if (typeof option.isCorrect !== 'boolean') {
              throw new Error('isCorrect boolean qiymat bo\'lishi kerak');
            }
          });
        }
      }
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Kategoriya kiritilishi shart'
        }
      }
    },
    difficulty: {
      type: DataTypes.ENUM('oson', 'o\'rta', 'qiyin'),
      defaultValue: 'o\'rta',
      allowNull: false
    },
    points: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: {
          args: 1,
          msg: 'Ball kamida 1 bo\'lishi kerak'
        },
        max: {
          args: 10,
          msg: 'Ball ko\'pi bilan 10 bo\'lishi kerak'
        }
      }
    },
    explanation: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    createdBy: {
      type: DataTypes.STRING(100),
      defaultValue: 'admin'
    }
  }, {
    tableName: 'questions',
    timestamps: true,
    indexes: [
      {
        fields: ['category']
      },
      {
        fields: ['difficulty']
      },
      {
        fields: ['isActive']
      },
      {
        fields: ['category', 'difficulty']
      }
    ]
  });

  return Question;
};

module.exports = defineQuestion;
