import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '../context/TestContext';
import { calculateScore } from '../data/questions';
import { testResultsAPI } from '../services/api';

const TestPage = () => {
  const { state, dispatch } = useTest();
  const navigate = useNavigate();
  const { testQuestions, currentQuestionIndex, answers, timeRemaining, isTestActive, isLoadingQuestions, questionsError } = state;
  const [timeWarning, setTimeWarning] = useState(false);

  const currentQuestion = testQuestions[currentQuestionIndex];
  const totalQuestions = testQuestions.length;

  // Redirect to home if no test is active
  useEffect(() => {
    if (!isTestActive || testQuestions.length === 0) {
      navigate('/');
    }
  }, [isTestActive, testQuestions.length, navigate]);

  // Timer effect
  useEffect(() => {
    if (!isTestActive || timeRemaining <= 0) {
      if (timeRemaining <= 0) {
        finishTest();
      }
      return;
    }

    const timer = setInterval(() => {
      dispatch({ type: 'UPDATE_TIMER' });
    }, 1000);

    // Warning when 2 minutes left
    if (timeRemaining <= 120 && !timeWarning) {
      setTimeWarning(true);
    }

    return () => clearInterval(timer);
  }, [timeRemaining, isTestActive, timeWarning, dispatch]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex) => {
    dispatch({
      type: 'ANSWER_QUESTION',
      payload: {
        questionIndex: currentQuestionIndex,
        answer: answerIndex
      }
    });
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      dispatch({ type: 'PREVIOUS_QUESTION' });
    }
  };

  const goToNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      dispatch({ type: 'NEXT_QUESTION' });
    }
  };

  const finishTest = async () => {
    const result = calculateScore(answers, testQuestions);
    const testDuration = Math.floor((Date.now() - state.testStartTime) / 1000);
    
    // Test natijalarini backend'ga yuborish
    try {
      // Foydalanuvchi ismini localStorage'dan olish yoki default qiymat berish
      const userName = localStorage.getItem('userName') || 'Mehmon';
      const userEmail = localStorage.getItem('userEmail') || null;
      
      // Test detallarini tayyorlash
      const testDetails = testQuestions.map((question, index) => ({
        questionId: question.id,
        question: question.question,
        userAnswer: answers[index],
        correctAnswer: question.correctAnswer,
        isCorrect: answers[index] === question.correctAnswer,
        points: answers[index] === question.correctAnswer ? (question.points || 1) : 0
      }));
      
      // Natijalarni backend'ga yuborish
      const testResultData = {
        userName,
        userEmail,
        totalQuestions: testQuestions.length,
        correctAnswers: result.correctAnswers,
        wrongAnswers: result.wrongAnswers,
        skippedQuestions: testQuestions.length - (result.correctAnswers + result.wrongAnswers),
        totalScore: result.score,
        percentage: result.percentage,
        timeTaken: testDuration,
        startTime: new Date(state.testStartTime),
        endTime: new Date(),
        testDetails,
        category: testQuestions[0]?.category || 'Umumiy',
        difficulty: 'o\'rta',
        status: 'completed'
      };
      
      await testResultsAPI.create(testResultData);
      console.log('Test natijasi muvaffaqiyatli saqlandi');
    } catch (error) {
      console.error('Test natijasini saqlashda xato:', error);
      // Xato bo'lsa ham testni tugatish davom etsin
    }
    
    dispatch({
      type: 'FINISH_TEST',
      payload: {
        ...result,
        duration: testDuration,
        answers: answers,
        questions: testQuestions
      }
    });
    navigate('/result');
  };

  const getAnsweredCount = () => {
    return answers.filter(answer => answer !== null).length;
  };

  // Loading state
  if (isLoadingQuestions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-12">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-indigo-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          <p className="mt-6 text-xl font-semibold text-gray-700">Savollar yuklanmoqda...</p>
          <p className="mt-2 text-sm text-gray-500">Ma'lumotlar bazasidan savollar olinmoqda</p>
        </div>
      </div>
    );
  }

  // Error state
  if (questionsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-12 max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Xatolik yuz berdi</h2>
          <p className="text-gray-600 mb-6">{questionsError}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }

  // No questions loaded
  if (!currentQuestion || testQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-12">
          <div className="animate-pulse">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-2xl shadow-2xl border-b border-white/50 z-50 shrink-0">
        {/* Extra Small Mobile: 0px-374px */}
        <div className="h-[56px] flex items-center px-3 py-2 block min-[375px]:hidden">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold text-gray-900 truncate">IELTS Test</h1>
              <span className="text-xs text-gray-600 whitespace-nowrap">
                {currentQuestionIndex + 1}/{totalQuestions}
              </span>
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs ${
              timeRemaining <= 120 ? 'bg-red-100 text-red-700' : 
              timeRemaining <= 300 ? 'bg-yellow-100 text-yellow-700' : 
              'bg-green-100 text-green-700'
            }`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-mono font-bold">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        </div>

        {/* Small Mobile: 375px-479px */}
        <div className="h-[60px] flex items-center px-4 py-2 hidden min-[375px]:block min-[480px]:hidden">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h1 className="text-base font-bold text-gray-900">IELTS Mock Test</h1>
              <span className="text-sm text-gray-600">
                Savol {currentQuestionIndex + 1} / {totalQuestions}
              </span>
            </div>
            <div className={`flex items-center space-x-2 px-2 py-1 rounded-lg text-sm ${
              timeRemaining <= 120 ? 'bg-red-100 text-red-700' : 
              timeRemaining <= 300 ? 'bg-yellow-100 text-yellow-700' : 
              'bg-green-100 text-green-700'
            }`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-mono font-bold">
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        </div>

        {/* Medium Mobile: 480px-639px */}
        <div className="h-[64px] flex items-center px-4 py-3 hidden min-[480px]:block min-[640px]:hidden">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-bold text-gray-900">IELTS Mock Test</h1>
              <span className="text-sm text-gray-600">
                Savol {currentQuestionIndex + 1} / {totalQuestions}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600">Progress:</span>
                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
                </span>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${
                timeRemaining <= 120 ? 'bg-red-100 text-red-700' : 
                timeRemaining <= 300 ? 'bg-yellow-100 text-yellow-700' : 
                'bg-green-100 text-green-700'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-mono font-bold">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Large Mobile: 640px-767px */}
        <div className="h-[68px] flex items-center px-5 py-3 hidden min-[640px]:block min-[768px]:hidden">
          <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-bold text-gray-900">IELTS Mock Test</h1>
              <span className="text-sm text-gray-600">
                  Savol {currentQuestionIndex + 1} / {totalQuestions}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Progress:</span>
                <div className="w-20 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
                </span>
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
                timeRemaining <= 120 ? 'bg-red-100 text-red-700' : 
                timeRemaining <= 300 ? 'bg-yellow-100 text-yellow-700' : 
                'bg-green-100 text-green-700'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-mono font-bold text-base">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>
              </div>

        {/* Tablet and Desktop: 768px+ */}
        <div className="h-[72px] flex items-center px-6 lg:px-8 py-4 hidden min-[768px]:block">
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">IELTS Mock Test</h1>
              <span className="text-sm text-gray-600">
                Savol {currentQuestionIndex + 1} / {totalQuestions}
              </span>
            </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Progress:</span>
                  <div className="w-24 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
                  </span>
                </div>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
                  timeRemaining <= 120 ? 'bg-red-100 text-red-700' : 
                  timeRemaining <= 300 ? 'bg-yellow-100 text-yellow-700' : 
                  'bg-green-100 text-green-700'
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-mono font-bold text-base">
                    {formatTime(timeRemaining)}
                  </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col w-full px-3 min-[375px]:px-4 min-[640px]:px-5 min-[768px]:px-6 lg:px-8 py-4 min-[480px]:py-5 min-[640px]:py-6 lg:py-8">
        <div className="flex-1 flex flex-col max-w-full min-[640px]:max-w-3xl min-[768px]:max-w-5xl mx-auto w-full">
        {/* Time Warning */}
        {timeWarning && timeRemaining > 60 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Diqqat!</strong> Test yakunlanishiga 2 daqiqadan kam vaqt qoldi.
                </p>
              </div>
            </div>
          </div>
        )}

          {/* Question Card */}
          <div className="flex-1 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/70 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>
            {/* Question Header */}
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 min-[375px]:px-5 min-[480px]:px-6 min-[640px]:px-8 py-4 min-[480px]:py-5 min-[640px]:py-6">
              <div className="relative flex items-center justify-between">
                <h2 className="text-white text-base min-[375px]:text-lg min-[480px]:text-xl font-black flex items-center">
                  <div className="w-8 h-8 min-[375px]:w-9 min-[375px]:h-9 min-[480px]:w-10 min-[480px]:h-10 bg-white/30 backdrop-blur-md rounded-xl min-[480px]:rounded-2xl flex items-center justify-center mr-2 min-[375px]:mr-3 shadow-lg animate-pulse-slow">
                    <span className="text-sm min-[375px]:text-base min-[480px]:text-lg font-bold">{currentQuestionIndex + 1}</span>
                  </div>
                  Savol
                </h2>
                <div className="flex items-center space-x-1 min-[375px]:space-x-2 text-white bg-white/20 backdrop-blur-sm px-2 min-[375px]:px-3 min-[480px]:px-4 py-1 min-[375px]:py-1.5 min-[480px]:py-2 rounded-lg min-[480px]:rounded-xl">
                  {answers[currentQuestionIndex] !== null ? (
                    <>
                      <svg className="w-4 h-4 min-[375px]:w-5 min-[375px]:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs min-[375px]:text-sm font-medium hidden min-[375px]:inline">Javob berildi</span>
                      <span className="text-xs font-medium min-[375px]:hidden">✓</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 min-[375px]:w-5 min-[375px]:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs min-[375px]:text-sm font-medium hidden min-[375px]:inline">Javob berilmadi</span>
                      <span className="text-xs font-medium min-[375px]:hidden">?</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Question Content */}
            <div className="relative h-full flex flex-col p-4 min-[375px]:p-5 min-[480px]:p-6 min-[640px]:p-8 min-[768px]:p-10">
              <div className="mb-6 min-[375px]:mb-7 min-[480px]:mb-8 min-[640px]:mb-10">
                <p className="text-base min-[375px]:text-lg min-[480px]:text-xl min-[640px]:text-2xl text-gray-900 leading-relaxed font-bold">
                  {currentQuestion.question}
                </p>
              </div>

            {/* Answer Options */}
            <div className="flex-1 space-y-3 min-[375px]:space-y-4 pr-2">
              {currentQuestion.options.map((option, index) => {
                const isSelected = answers[currentQuestionIndex] === index;
                const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                
                return (
                  <label
                    key={index}
                    className={`group relative flex items-start p-3 min-[375px]:p-4 min-[480px]:p-5 min-[640px]:p-6 rounded-2xl min-[480px]:rounded-3xl border-2 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 overflow-hidden ${
                      isSelected 
                        ? 'border-indigo-500 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl' 
                        : 'border-gray-300 hover:border-indigo-400 bg-gradient-to-br from-white via-gray-50 to-indigo-50/30'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 blur-xl"></span>
                    )}
                    <input
                      type="radio"
                      name="answer"
                      value={index}
                      checked={isSelected}
                      onChange={() => handleAnswerSelect(index)}
                      className="sr-only"
                    />
                    <div className={`relative flex-shrink-0 w-8 h-8 min-[375px]:w-9 min-[375px]:h-9 min-[480px]:w-10 min-[480px]:h-10 rounded-xl min-[480px]:rounded-2xl border-2 flex items-center justify-center mr-3 min-[375px]:mr-4 min-[480px]:mr-5 mt-0.5 font-bold text-sm min-[375px]:text-base transition-all duration-300 shadow-lg ${
                      isSelected 
                        ? 'border-white/50 bg-white/30 backdrop-blur-sm text-white' 
                        : 'border-gray-400 text-gray-700 bg-white group-hover:border-indigo-500 group-hover:text-indigo-700 group-hover:bg-gradient-to-br group-hover:from-indigo-100 group-hover:to-purple-100'
                    }`}>
                      {optionLetter}
                    </div>
                    <span className={`relative leading-relaxed text-sm min-[375px]:text-base min-[480px]:text-lg ${
                      isSelected ? 'font-bold text-white' : 'font-medium text-gray-900'
                    }`}>
                      {option}
                    </span>
                    {isSelected && (
                      <svg className="relative w-5 h-5 text-white ml-auto animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        </div>


        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="bg-white/95 backdrop-blur-2xl border-t border-white/50 shadow-2xl z-40 shrink-0">
        {/* Extra Small Mobile: 0px-374px */}
        <div className="h-[56px] flex items-center px-3 py-2 block min-[375px]:hidden">
          <div className="w-full flex items-center justify-between space-x-2">
            <button
              onClick={goToPrevious}
              disabled={currentQuestionIndex === 0}
              className={`group flex items-center justify-center px-2 py-1.5 rounded-md font-medium transition-all duration-300 text-xs ${
                currentQuestionIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400'
              }`}
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden min-[320px]:inline">Oldingi</span>
            </button>

            <div className="flex-1 text-center bg-gradient-to-r from-indigo-50 to-purple-50 px-2 py-1 rounded-md border border-indigo-100">
              <p className="text-xs font-semibold text-gray-700">
                <span className="text-indigo-600 font-bold">{getAnsweredCount()}</span>
                <span className="text-gray-500 mx-0.5">/</span>
                <span className="text-gray-600">{totalQuestions}</span>
              </p>
            </div>

            {currentQuestionIndex === totalQuestions - 1 ? (
              <button
                onClick={finishTest}
                className="group flex items-center justify-center px-2 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-md font-medium transition-all duration-300 text-xs"
              >
                <span className="hidden min-[320px]:inline mr-1">Tugatish</span>
                <span className="min-[320px]:hidden">✓</span>
                <svg className="w-3 h-3 hidden min-[320px]:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={goToNext}
                className="group flex items-center justify-center px-2 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-md font-medium transition-all duration-300 text-xs"
              >
                <span className="hidden min-[320px]:inline mr-1">Keyingi</span>
                <span className="min-[320px]:hidden">→</span>
                <svg className="w-3 h-3 hidden min-[320px]:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Small Mobile: 375px-479px */}
        <div className="h-[60px] flex items-center px-4 py-2 hidden min-[375px]:block min-[480px]:hidden">
          <div className="w-full flex items-center justify-between space-x-3">
              <button
                onClick={goToPrevious}
                disabled={currentQuestionIndex === 0}
              className={`group flex items-center justify-center px-3 py-1.5 rounded-lg font-medium transition-all duration-300 text-xs ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400'
                }`}
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
                <span>Oldingi</span>
              </button>

            <div className="flex-1 text-center bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                <p className="text-xs font-semibold text-gray-700">
                  <span className="text-indigo-600 font-bold">{getAnsweredCount()}</span>
                  <span className="text-gray-500 mx-1">/</span>
                  <span className="text-gray-600">{totalQuestions}</span>
                <span className="text-gray-500 ml-1">javob</span>
                </p>
              </div>

              {currentQuestionIndex === totalQuestions - 1 ? (
                <button
                  onClick={finishTest}
                className="group flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-300 text-xs"
                >
                <span className="mr-1">Tugatish</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={goToNext}
                className="group flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 text-xs"
                >
                  <span className="mr-1">Keyingi</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
        </div>

        {/* Medium Mobile and larger: 480px+ */}
        <div className="h-[64px] min-[640px]:h-[68px] min-[768px]:h-[72px] flex items-center px-4 min-[640px]:px-5 min-[768px]:px-6 lg:px-8 py-3 min-[640px]:py-4 hidden min-[480px]:block">
          <div className="w-full max-w-3xl min-[768px]:max-w-5xl mx-auto flex items-center justify-between space-x-3 min-[640px]:space-x-4">
            <button
              onClick={goToPrevious}
              disabled={currentQuestionIndex === 0}
              className={`group flex items-center justify-center px-3 min-[640px]:px-4 py-1.5 min-[640px]:py-2 rounded-lg font-medium transition-all duration-300 text-xs min-[640px]:text-sm ${
                currentQuestionIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400'
              }`}
            >
              <svg className="w-3 h-3 min-[640px]:w-4 min-[640px]:h-4 mr-1 min-[640px]:mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Oldingi</span>
            </button>

            <div className="flex-1 text-center bg-gradient-to-r from-indigo-50 to-purple-50 px-3 min-[640px]:px-4 py-1.5 min-[640px]:py-2 rounded-lg border border-indigo-100">
              <p className="text-xs min-[640px]:text-sm font-semibold text-gray-700">
                <span className="text-indigo-600 font-bold">{getAnsweredCount()}</span>
                <span className="text-gray-500 mx-1">/</span>
                <span className="text-gray-600">{totalQuestions}</span>
                <span className="text-gray-500 ml-1">javob berildi</span>
              </p>
            </div>

            {currentQuestionIndex === totalQuestions - 1 ? (
              <button
                onClick={finishTest}
                className="group flex items-center justify-center px-4 min-[640px]:px-5 py-1.5 min-[640px]:py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-all duration-300 text-xs min-[640px]:text-sm"
              >
                <span className="mr-1 min-[640px]:mr-1.5">Tugatish</span>
                <svg className="w-3 h-3 min-[640px]:w-4 min-[640px]:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={goToNext}
                className="group flex items-center justify-center px-4 min-[640px]:px-5 py-1.5 min-[640px]:py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 text-xs min-[640px]:text-sm"
              >
                <span className="mr-1 min-[640px]:mr-1.5">Keyingi</span>
                <svg className="w-3 h-3 min-[640px]:w-4 min-[640px]:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TestPage;
