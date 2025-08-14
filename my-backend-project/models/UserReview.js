const { DataTypes } = require('sequelize');

const defineUserReview = (sequelize) => {
  const UserReview = sequelize.define('UserReview', {
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 1,
          msg: 'Reyting kamida 1 bo\'lishi kerak'
        },
        max: {
          args: 5,
          msg: 'Reyting ko\'pi bilan 5 bo\'lishi kerak'
        }
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Izoh kiritilishi shart'
        },
        len: {
          args: [10, 1000],
          msg: 'Izoh kamida 10 ta belgidan iborat bo\'lishi kerak'
        }
      }
    },
    testResultId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'test_results',
        key: 'id'
      }
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'user_reviews',
    timestamps: true,
    indexes: [
      {
        fields: ['rating']
      },
      {
        fields: ['isApproved']
      },
      {
        fields: ['isActive']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  // Associations
  UserReview.associate = (models) => {
    UserReview.belongsTo(models.TestResult, {
      foreignKey: 'testResultId',
      as: 'testResult'
    });
  };

  return UserReview;
};

module.exports = defineUserReview;
