# Test System Backend API Documentation

## O'rnatish va Ishga tushirish

### Talablar
- Node.js 14+ versiyasi
- PostgreSQL ma'lumotlar bazasi
- npm yoki yarn paket menejeri

### O'rnatish

1. Loyihani klonlash:
```bash
git clone <repository-url>
cd my-backend-project
```

2. Kerakli paketlarni o'rnatish:
```bash
npm install
```

3. `.env` faylini yaratish va sozlash:
```bash
cp env-example.txt .env
```

`.env` faylida quyidagilarni sozlang:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=test_system_db
DB_USER=your_username
DB_PASSWORD=your_password
NODE_ENV=development
PORT=3000
```

4. Ma'lumotlar bazasini yaratish va migratsiyalarni bajarish:
```bash
npm run db:sync
```

5. Serverni ishga tushirish:
```bash
npm start
```

Development rejimida:
```bash
npm run dev
```

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Asosiy Endpoints

#### Health Check
```
GET /health
```
Server holatini tekshirish

---

## 📚 Savollar (Questions) API

### Barcha savollarni olish
```
GET /api/questions
```

Query parametrlari:
- `category` (string) - Kategoriya bo'yicha filtrlash
- `difficulty` (string) - Qiyinlik darajasi ('oson', 'o\'rta', 'qiyin')
- `limit` (number) - Sahifadagi savollar soni (default: 50)
- `page` (number) - Sahifa raqami (default: 1)
- `random` (boolean) - Random savollarni olish (true/false)
- `isActive` (boolean) - Faol savollarni filtrlash

Javob:
```json
{
  "success": true,
  "questions": [
    {
      "id": 1,
      "question": "Savol matni",
      "options": ["Variant A", "Variant B", "Variant C", "Variant D"],
      "correctAnswer": 0,
      "category": "Grammar",
      "difficulty": "o'rta",
      "points": 1
    }
  ],
  "total": 20
}
```

### Bitta savolni olish
```
GET /api/questions/:id
```

Javob:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "questionText": "Savol matni",
    "options": [
      { "text": "Variant A", "isCorrect": true },
      { "text": "Variant B", "isCorrect": false },
      { "text": "Variant C", "isCorrect": false },
      { "text": "Variant D", "isCorrect": false }
    ],
    "category": "Grammar",
    "difficulty": "o'rta",
    "points": 1,
    "explanation": "Tushuntirish",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Yangi savol qo'shish (Admin)
```
POST /api/questions
```

Request body:
```json
{
  "questionText": "Savol matni",
  "options": [
    { "text": "Variant A", "isCorrect": true },
    { "text": "Variant B", "isCorrect": false },
    { "text": "Variant C", "isCorrect": false },
    { "text": "Variant D", "isCorrect": false }
  ],
  "category": "Grammar",
  "difficulty": "o'rta",
  "points": 1,
  "explanation": "Tushuntirish (ixtiyoriy)"
}
```

Javob:
```json
{
  "success": true,
  "message": "Savol muvaffaqiyatli qo'shildi",
  "data": { ... }
}
```

### Savolni yangilash (Admin)
```
PUT /api/questions/:id
```

Request body:
```json
{
  "questionText": "Yangilangan savol matni",
  "options": [
    { "text": "Yangi variant A", "isCorrect": false },
    { "text": "Yangi variant B", "isCorrect": true },
    { "text": "Yangi variant C", "isCorrect": false },
    { "text": "Yangi variant D", "isCorrect": false }
  ],
  "category": "Vocabulary",
  "difficulty": "qiyin",
  "points": 2,
  "explanation": "Yangilangan tushuntirish",
  "isActive": true
}
```

### Savolni o'chirish (Admin)
```
DELETE /api/questions/:id
```

Javob:
```json
{
  "success": true,
  "message": "Savol muvaffaqiyatli o'chirildi"
}
```

### Kategoriyalar ro'yxatini olish
```
GET /api/questions/categories/list
```

Javob:
```json
{
  "success": true,
  "data": ["Grammar", "Vocabulary", "Reading", "Listening"]
}
```

### Statistika olish
```
GET /api/questions/stats/overview
```

Javob:
```json
{
  "success": true,
  "data": {
    "totalQuestions": 150,
    "totalCategories": 4,
    "difficultyStats": [
      { "difficulty": "oson", "count": 50 },
      { "difficulty": "o'rta", "count": 60 },
      { "difficulty": "qiyin", "count": 40 }
    ],
    "categoryStats": [
      { "category": "Grammar", "count": 40 },
      { "category": "Vocabulary", "count": 35 }
    ]
  }
}
```

---

## 📊 Test Natijalari (Test Results) API

### Test natijasini saqlash
```
POST /api/test-results
```

Request body:
```json
{
  "userName": "Foydalanuvchi ismi",
  "userEmail": "user@example.com",
  "totalQuestions": 20,
  "correctAnswers": 15,
  "wrongAnswers": 5,
  "skippedQuestions": 0,
  "totalScore": 15,
  "percentage": 75,
  "timeTaken": 600,
  "startTime": "2024-01-01T10:00:00.000Z",
  "endTime": "2024-01-01T10:10:00.000Z",
  "testDetails": [
    {
      "questionId": 1,
      "question": "Savol matni",
      "userAnswer": 0,
      "correctAnswer": 0,
      "isCorrect": true,
      "points": 1
    }
  ],
  "category": "Umumiy",
  "difficulty": "o'rta",
  "status": "completed"
}
```

### Barcha test natijalarini olish (Admin)
```
GET /api/test-results
```

Query parametrlari:
- `limit` (number) - Sahifadagi natijalar soni (default: 50)
- `page` (number) - Sahifa raqami (default: 1)
- `sortBy` (string) - Saralash mezoni (default: 'createdAt')
- `order` (string) - Saralash tartibi ('ASC' yoki 'DESC')
- `userName` (string) - Foydalanuvchi ismi bo'yicha filtrlash
- `status` (string) - Status bo'yicha filtrlash
- `fromDate` (date) - Boshlang'ich sana
- `toDate` (date) - Tugash sanasi

### Bitta test natijasini olish
```
GET /api/test-results/:id
```

### Test natijalari statistikasi
```
GET /api/test-results/stats/overview
```

Javob:
```json
{
  "success": true,
  "data": {
    "totalTests": 500,
    "totalUsers": 250,
    "averagePercentage": 72.5,
    "averageCorrectAnswers": 14.5,
    "averageTimeTaken": 540,
    "dailyStats": [
      { "date": "2024-01-01", "count": 25, "avgPercentage": 70 }
    ],
    "topResults": [
      {
        "id": 1,
        "userName": "John Doe",
        "percentage": 95,
        "correctAnswers": 19,
        "totalQuestions": 20
      }
    ],
    "categoryStats": [
      { "category": "Grammar", "count": 150, "avgPercentage": 75 }
    ]
  }
}
```

### Foydalanuvchi natijalarini olish
```
GET /api/test-results/user/:userName
```

Query parametrlari:
- `limit` (number) - Natijalar soni limiti (default: 10)

### Test natijasini o'chirish (Admin)
```
DELETE /api/test-results/:id
```

---

## 💬 Foydalanuvchi Sharhlari (User Reviews) API

### Yangi sharh qo'shish
```
POST /api/reviews
```

Request body:
```json
{
  "userName": "Foydalanuvchi ismi",
  "userEmail": "user@example.com",
  "rating": 5,
  "comment": "Ajoyib test tizimi!",
  "testResultId": 123
}
```

### Barcha sharhlarni olish (Admin)
```
GET /api/reviews
```

Query parametrlari:
- `limit` (number) - Sahifadagi sharhlar soni (default: 50)
- `page` (number) - Sahifa raqami (default: 1)
- `isApproved` (boolean) - Tasdiqlangan sharhlar
- `isActive` (boolean) - Faol sharhlar
- `rating` (number) - Reyting bo'yicha filtrlash (1-5)
- `sortBy` (string) - Saralash mezoni
- `order` (string) - Saralash tartibi

### Tasdiqlangan sharhlarni olish (Public)
```
GET /api/reviews/approved
```

Query parametrlari:
- `limit` (number) - Sharhlar soni limiti (default: 10)

### Sharhni yangilash (Admin)
```
PUT /api/reviews/:id
```

Request body:
```json
{
  "isApproved": true,
  "isActive": true
}
```

### Sharhni o'chirish (Admin)
```
DELETE /api/reviews/:id
```

### Reyting statistikasi
```
GET /api/reviews/stats/ratings
```

Javob:
```json
{
  "success": true,
  "data": {
    "averageRating": 4.5,
    "totalReviews": 150,
    "ratingDistribution": [
      { "rating": 5, "count": 80 },
      { "rating": 4, "count": 40 },
      { "rating": 3, "count": 20 },
      { "rating": 2, "count": 8 },
      { "rating": 1, "count": 2 }
    ]
  }
}
```

---

## 🔒 Xatolar va Status Kodlari

### Success Status Codes
- `200 OK` - Muvaffaqiyatli so'rov
- `201 Created` - Yangi resurs yaratildi

### Error Status Codes
- `400 Bad Request` - Noto'g'ri so'rov formati
- `404 Not Found` - Resurs topilmadi
- `429 Too Many Requests` - Juda ko'p so'rovlar
- `500 Internal Server Error` - Server xatosi

### Xato javobi formati
```json
{
  "success": false,
  "message": "Xato tavsifi",
  "errors": ["Batafsil xato xabarlari"],
  "error": "Texnik xato ma'lumotlari"
}
```

---

## 📝 Ma'lumotlar Modellari

### Question Model
```javascript
{
  id: Integer (Primary Key, Auto Increment),
  questionText: Text (Required, 10-1000 characters),
  options: JSONB (Array of {text: String, isCorrect: Boolean}),
  category: String (Required, max 100 characters),
  difficulty: Enum ('oson', 'o\'rta', 'qiyin'),
  points: Integer (1-10, default: 1),
  explanation: Text (Optional),
  isActive: Boolean (default: true),
  createdBy: String (default: 'admin'),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### TestResult Model
```javascript
{
  id: Integer (Primary Key, Auto Increment),
  userName: String (Required, 2-100 characters),
  userEmail: String (Optional, valid email),
  totalQuestions: Integer,
  correctAnswers: Integer,
  wrongAnswers: Integer,
  skippedQuestions: Integer,
  totalScore: Integer,
  percentage: Float (0-100),
  timeTaken: Integer (seconds),
  startTime: DateTime,
  endTime: DateTime,
  testDetails: JSONB (Array of question details),
  category: String (Optional),
  difficulty: String (Optional),
  status: Enum ('completed', 'timeout', 'abandoned'),
  ipAddress: String (Optional),
  userAgent: Text (Optional),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### UserReview Model
```javascript
{
  id: Integer (Primary Key, Auto Increment),
  userName: String (Required, 2-100 characters),
  userEmail: String (Optional, valid email),
  rating: Integer (Required, 1-5),
  comment: Text (Required, 10-1000 characters),
  testResultId: Integer (Foreign Key, Optional),
  isApproved: Boolean (default: false),
  isActive: Boolean (default: true),
  ipAddress: String (Optional),
  createdAt: DateTime,
  updatedAt: DateTime
}
```

---

## 🚀 Deployment

### Production muhitida ishga tushirish

1. Production environment sozlamalari:
```bash
NODE_ENV=production
PORT=3000
DB_HOST=your_production_db_host
DB_PORT=5432
DB_NAME=your_production_db
DB_USER=your_production_user
DB_PASSWORD=your_production_password
```

2. PM2 bilan ishga tushirish:
```bash
npm install -g pm2
pm2 start index.js --name "test-system-backend"
pm2 save
pm2 startup
```

3. Nginx konfiguratsiyasi:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📞 Aloqa va Yordam

Savollar yoki muammolar bo'lsa, quyidagi manzillarga murojaat qiling:
- Email: support@example.com
- GitHub Issues: [repository-url]/issues

## 📄 Litsenziya

MIT License