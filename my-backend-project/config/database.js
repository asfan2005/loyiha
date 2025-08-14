const { Sequelize } = require('sequelize');

const connectDB = async () => {
  try {
    // Environment variables dan PostgreSQL ma'lumotlarini olish
    const dbConfig = {
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'loyihaenglishmock',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    };

    const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: dbConfig.dialect,
      logging: dbConfig.logging,
      pool: dbConfig.pool
    });

    // Ma'lumotlar bazasiga ulanishni tekshirish
    await sequelize.authenticate();
    console.log(`✅ PostgreSQL ga muvaffaqiyatli ulanildi: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await sequelize.close();
        console.log('🔒 PostgreSQL ulanishi yopildi');
        process.exit(0);
      } catch (err) {
        console.error('❌ PostgreSQL ulanishini yopishda xato:', err);
        process.exit(1);
      }
    });

    return sequelize;

  } catch (error) {
    console.error('❌ PostgreSQL ga ulanishda xato:', error.message);
    console.error('Database config:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER
    });
    process.exit(1);
  }
};

module.exports = connectDB;
