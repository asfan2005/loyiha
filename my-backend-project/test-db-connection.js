const dotenv = require('dotenv');
const { Sequelize } = require('sequelize');

// Environment variables ni yuklash
dotenv.config();

const testConnection = async () => {
  console.log('🔍 PostgreSQL ulanishini tekshirish...\n');

  // Environment variables ni ko'rsatish
  console.log('📋 Database Configuration:');
  console.log(`   Host: ${process.env.DB_HOST}`);
  console.log(`   Port: ${process.env.DB_PORT}`);
  console.log(`   Database: ${process.env.DB_NAME}`);
  console.log(`   User: ${process.env.DB_USER}`);
  console.log(`   Password: ${'*'.repeat(process.env.DB_PASS?.length || 0)}\n`);

  try {
    // Sequelize instance yaratish
    const sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: console.log
      }
    );

    // Ulanishni tekshirish
    console.log('🔄 Ma\'lumotlar bazasiga ulanmoqda...');
    await sequelize.authenticate();
    console.log('✅ PostgreSQL ga muvaffaqiyatli ulanildi!');

    // Database versiyasini olish
    const [results] = await sequelize.query('SELECT version()');
    console.log('📊 PostgreSQL Version:', results[0].version);

    // Mavjud jadvallarni ko'rsatish
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\n📋 Mavjud jadvallar:');
    if (tables.length > 0) {
      tables.forEach(table => console.log(`   - ${table.table_name}`));
    } else {
      console.log('   Hozircha jadvallar mavjud emas');
    }

    // Ulanishni yopish
    await sequelize.close();
    console.log('\n🔒 Ma\'lumotlar bazasi ulanishi yopildi');
    console.log('🎉 Test muvaffaqiyatli yakunlandi!');

  } catch (error) {
    console.error('❌ Ma\'lumotlar bazasiga ulanishda xato:');
    console.error('   Error:', error.message);
    
    if (error.original) {
      console.error('   Detail:', error.original.message);
    }

    console.log('\n🔧 Yechim tavsiyalari:');
    console.log('1. PostgreSQL server ishlaganligini tekshiring');
    console.log('2. Database mavjudligini tekshiring');
    console.log('3. User va password to\'g\'riligini tekshiring');
    console.log('4. Host va Port to\'g\'riligini tekshiring');
    console.log('5. .env faylida barcha qiymatlar to\'g\'ri kiritilganligini tekshiring');
    
    process.exit(1);
  }
};

// Test ni ishga tushirish
testConnection();
