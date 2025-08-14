import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '../context/TestContext';

const ResultPage = () => {
  const { state, dispatch } = useTest();
  const navigate = useNavigate();
  const { testResult } = state;

  // Redirect to home if no test result
  React.useEffect(() => {
    if (!testResult) {
      navigate('/');
    }
  }, [testResult, navigate]);

  if (!testResult) {
    return null; // Component will unmount due to navigation
  }

  const { correct, total, percentage, duration, answers, questions } = testResult;
  
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} daqiqa ${remainingSeconds} soniya`;
  };

  const getScoreMessage = () => {
    if (percentage >= 90) return { message: "A'lo natija!", color: "text-green-600", bg: "bg-green-50" };
    if (percentage >= 80) return { message: "Yaxshi natija!", color: "text-blue-600", bg: "bg-blue-50" };
    if (percentage >= 70) return { message: "Qoniqarli natija!", color: "text-yellow-600", bg: "bg-yellow-50" };
    if (percentage >= 60) return { message: "O'rtacha natija!", color: "text-orange-600", bg: "bg-orange-50" };
    return { message: "Takror harakat qiling!", color: "text-red-600", bg: "bg-red-50" };
  };

  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const scoreInfo = getScoreMessage();

  const retakeTest = () => {
    dispatch({ type: 'RESET_TEST' });
    navigate('/');
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center">
            Test Natijangiz
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Results Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Header with score */}
          <div className={`${scoreInfo.bg} px-6 sm:px-8 py-8 text-center`}>
            <div className="mb-4">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${scoreInfo.bg} border-4 ${scoreInfo.color.replace('text-', 'border-')} mb-4`}>
                <svg className={`w-10 h-10 ${scoreInfo.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className={`text-3xl sm:text-4xl font-bold ${scoreInfo.color} mb-2`}>
                {percentage}%
              </h2>
              <p className={`text-xl font-semibold ${scoreInfo.color}`}>
                {scoreInfo.message}
              </p>
            </div>
          </div>

          {/* Detailed Stats */}
          <div className="px-6 sm:px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {/* Correct Answers */}
              <div className="text-center p-6 bg-green-50 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-600">{correct}</h3>
                <p className="text-green-700 font-medium">To'g'ri javoblar</p>
                <p className="text-sm text-green-600">/{total} ta savoldan</p>
              </div>

              {/* Time Spent */}
              <div className="text-center p-6 bg-blue-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-blue-600">{formatDuration(duration)}</h3>
                <p className="text-blue-700 font-medium">Sarflangan vaqt</p>
                <p className="text-sm text-blue-600">10 daqiqadan</p>
              </div>

              {/* Score Percentage */}
              <div className="text-center p-6 bg-purple-50 rounded-xl">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className={`text-2xl font-bold ${getScoreColor()}`}>{percentage}%</h3>
                <p className="text-purple-700 font-medium">Umumiy ball</p>
                <p className="text-sm text-purple-600">100% dan</p>
              </div>
            </div>

            {/* Performance Analysis */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Natijalar tahlili</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">To'g'ri javoblar:</span>
                  <span className="font-semibold text-green-600">{correct} ta</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Noto'g'ri javoblar:</span>
                  <span className="font-semibold text-red-600">{total - correct} ta</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Jami savollar:</span>
                  <span className="font-semibold text-gray-900">{total} ta</span>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>To'g'ri javoblar foizi</span>
                    <span>{percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        percentage >= 80 ? 'bg-green-500' : 
                        percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={retakeTest}
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Qayta Test Topshirish
              </button>
              
              <button
                onClick={goHome}
                className="flex items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Bosh Sahifaga Qaytish
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Question Review */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4">
            <h3 className="text-xl font-semibold text-white">Savollar bo'yicha batafsil ma'lumot</h3>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {questions.map((question, index) => {
                const userAnswer = answers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                const wasAnswered = userAnswer !== null;
                
                return (
                  <div key={question.id} className={`p-4 rounded-lg border-l-4 ${
                    !wasAnswered ? 'border-gray-400 bg-gray-50' :
                    isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        Savol {index + 1}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {!wasAnswered ? (
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                            Javob berilmadi
                          </span>
                        ) : isCorrect ? (
                          <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded-full flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            To'g'ri
                          </span>
                        ) : (
                          <span className="text-xs bg-red-200 text-red-700 px-2 py-1 rounded-full flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Noto'g'ri
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-800 text-sm mb-3">{question.question}</p>
                    
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isUserAnswer = userAnswer === optionIndex;
                        const isCorrectAnswer = question.correctAnswer === optionIndex;
                        const letter = String.fromCharCode(65 + optionIndex);
                        
                        return (
                          <div key={optionIndex} className={`text-sm p-2 rounded flex items-center ${
                            isCorrectAnswer ? 'bg-green-100 text-green-800' :
                            isUserAnswer && !isCorrect ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            <span className="font-semibold mr-2">{letter})</span>
                            <span className="flex-1">{option}</span>
                            {isCorrectAnswer && (
                              <svg className="w-4 h-4 text-green-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                            {isUserAnswer && !isCorrect && (
                              <svg className="w-4 h-4 text-red-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 IELTS Mock Test Platform. Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ResultPage;
