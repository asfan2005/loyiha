import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '../context/TestContext';
import { 
  Header, 
  WelcomeSection, 
  TestInfoSection, 
  StatisticsSection, 
  UserReviewsSection, 
  Footer 
} from './';

const HomePage = () => {
  const { startTest: contextStartTest } = useTest();
  const navigate = useNavigate();
  const [showNameModal, setShowNameModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const handleStartTest = () => {
    // Avval foydalanuvchi ismini so'rash
    setShowNameModal(true);
  };

  const startTest = async () => {
    if (!userName.trim()) {
      alert('Iltimos, ismingizni kiriting');
      return;
    }
    
    setIsStarting(true);
    // Foydalanuvchi ma'lumotlarini saqlash
    localStorage.setItem('userName', userName.trim());
    if (userEmail.trim()) {
      localStorage.setItem('userEmail', userEmail.trim());
    }
    
    try {
      await contextStartTest();
      navigate('/test');
    } catch (error) {
      console.error('Test boshlashda xato:', error);
      alert('Test boshlashda xato yuz berdi. Iltimos qayta urinib ko\'ring.');
    } finally {
      setIsStarting(false);
    }
  };

  const goToAdmin = () => {
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header onAdminClick={goToAdmin} />
      
      <main className="flex-1 w-full">
        <WelcomeSection />
        <TestInfoSection startTest={handleStartTest} />
        <StatisticsSection />
        <UserReviewsSection />
      </main>
      
      <Footer />

      {/* Foydalanuvchi ismi modal */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Test boshlash</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
                  Ismingiz <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Ismingizni kiriting"
                  required
                  autoFocus
                />
              </div>
              
              <div>
                <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email (ixtiyoriy)
                </label>
                <input
                  type="email"
                  id="userEmail"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="email@example.com"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowNameModal(false);
                  setUserName('');
                  setUserEmail('');
                }}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors"
                disabled={isStarting}
              >
                Bekor qilish
              </button>
              <button
                onClick={startTest}
                disabled={!userName.trim() || isStarting}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                  !userName.trim() || isStarting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isStarting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Yuklanmoqda...
                  </span>
                ) : (
                  'Testni boshlash'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;