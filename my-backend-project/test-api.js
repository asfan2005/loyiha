// API test script
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test ma'lumotlari
const testQuestion = {
  questionText: "JavaScript-da 'var', 'let' va 'const' o'rtasidagi asosiy farq nima?",
  options: [
    {
      text: "Hech qanday farq yo'q",
      isCorrect: false
    },
    {
      text: "var - function scope, let va const - block scope",
      isCorrect: true
    },
    {
      text: "Faqat const o'zgarmas",
      isCorrect: false
    },
    {
      text: "let faqat looplarda ishlatiladi",
      isCorrect: false
    }
  ],
  category: "JavaScript",
  difficulty: "o'rta",
  points: 2,
  explanation: "var - function scope, let va const - block scope ga ega. const qiymati o'zgartirilmaydi."
};

// Test funksiyalari
async function testAPI() {
  console.log('🧪 API Test boshlandi...\n');

  try {
    // 1. Server holatini tekshirish
    console.log('1️⃣ Server holatini tekshirish...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server ishlayapti:', healthResponse.data);
    console.log('');

    // 2. Yangi savol qo'shish
    console.log('2️⃣ Yangi savol qo\'shish...');
    const createResponse = await axios.post(`${BASE_URL}/api/questions`, testQuestion);
    console.log('✅ Savol qo\'shildi:', createResponse.data);
    const questionId = createResponse.data.data._id;
    console.log('📝 Savol ID:', questionId);
    console.log('');

    // 3. Barcha savollarni olish
    console.log('3️⃣ Barcha savollarni olish...');
    const getAllResponse = await axios.get(`${BASE_URL}/api/questions`);
    console.log('✅ Savollar soni:', getAllResponse.data.data.length);
    console.log('📊 Pagination:', getAllResponse.data.pagination);
    console.log('');

    // 4. Bitta savolni ID bo'yicha olish
    console.log('4️⃣ Bitta savolni olish...');
    const getOneResponse = await axios.get(`${BASE_URL}/api/questions/${questionId}`);
    console.log('✅ Savol:', getOneResponse.data.data.questionText);
    console.log('');

    // 5. Savolni yangilash
    console.log('5️⃣ Savolni yangilash...');
    const updateData = {
      difficulty: "qiyin",
      points: 3
    };
    const updateResponse = await axios.put(`${BASE_URL}/api/questions/${questionId}`, updateData);
    console.log('✅ Yangilandi:', updateResponse.data.message);
    console.log('');

    // 6. Kategoriyalar ro'yxatini olish
    console.log('6️⃣ Kategoriyalar ro\'yxati...');
    const categoriesResponse = await axios.get(`${BASE_URL}/api/questions/categories/list`);
    console.log('✅ Kategoriyalar:', categoriesResponse.data.data);
    console.log('');

    // 7. Statistika olish
    console.log('7️⃣ Statistika olish...');
    const statsResponse = await axios.get(`${BASE_URL}/api/questions/stats/overview`);
    console.log('✅ Statistika:', statsResponse.data.data);
    console.log('');

    // 8. Savolni o'chirish (soft delete)
    console.log('8️⃣ Savolni o\'chirish...');
    const deleteResponse = await axios.delete(`${BASE_URL}/api/questions/${questionId}`);
    console.log('✅ O\'chirildi:', deleteResponse.data.message);
    console.log('');

    console.log('🎉 Barcha testlar muvaffaqiyatli o\'tdi!');

  } catch (error) {
    console.error('❌ Test xatosi:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Test xato holatlarni
async function testErrorCases() {
  console.log('\n🧪 Xato holatlarni test qilish...\n');

  try {
    // 1. Bo'sh ma'lumot bilan savol yaratish
    console.log('1️⃣ Bo\'sh ma\'lumot bilan savol yaratish...');
    try {
      await axios.post(`${BASE_URL}/api/questions`, {});
    } catch (error) {
      console.log('✅ Xato to\'g\'ri qaytarildi:', error.response.data.message);
    }

    // 2. Mavjud bo'lmagan ID bilan savol olish
    console.log('2️⃣ Mavjud bo\'lmagan ID bilan savol olish...');
    try {
      await axios.get(`${BASE_URL}/api/questions/507f1f77bcf86cd799439011`);
    } catch (error) {
      console.log('✅ 404 xatosi to\'g\'ri qaytarildi:', error.response.data.message);
    }

    // 3. To'g'ri javobsiz savol yaratish
    console.log('3️⃣ To\'g\'ri javobsiz savol yaratish...');
    try {
      const badQuestion = {
        questionText: "Test savol",
        options: [
          { text: "Variant 1", isCorrect: false },
          { text: "Variant 2", isCorrect: false }
        ],
        category: "Test"
      };
      await axios.post(`${BASE_URL}/api/questions`, badQuestion);
    } catch (error) {
      console.log('✅ Validatsiya xatosi to\'g\'ri qaytarildi:', error.response.data.message);
    }

    console.log('\n🎉 Xato holatlar testi ham muvaffaqiyatli!');

  } catch (error) {
    console.error('❌ Xato holatlar testida xato:', error.message);
  }
}

// Asosiy test funksiyasi
async function runAllTests() {
  console.log('='.repeat(50));
  console.log('📋 API TESTING BOSHLANDI');
  console.log('='.repeat(50));

  // MongoDB ishlab turganini tekshirish
  console.log('⚠️  MongoDB ishlab turganiga ishonch hosil qiling!');
  console.log('📝 MongoDB connection string: mongodb://localhost:27017/test_system\n');

  await testAPI();
  await testErrorCases();

  console.log('\n' + '='.repeat(50));
  console.log('✅ BARCHA TESTLAR TUGADI');
  console.log('='.repeat(50));
}

// Testni ishga tushirish
if (require.main === module) {
  runAllTests();
}

module.exports = { testAPI, testErrorCases };
