import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '../context/TestContext';
import { questionsAPI, testResultsAPI, reviewsAPI, formatError } from '../services/api';

const AdminPanel = () => {
  const { dispatch } = useTest();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('questions');
  const [questionsList, setQuestionsList] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    questionText: '',
    options: [
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false },
      { text: '', isCorrect: false }
    ],
    category: '',
    difficulty: 'o\'rta',
    points: 1,
    explanation: ''
  });

  // API funksiyalari
  const loadQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await questionsAPI.getAll();
      if (response.success) {
        setQuestionsList(response.data);
      } else {
        setError('Savollarni yuklashda xato yuz berdi');
      }
    } catch (err) {
      setError(formatError(err));
      console.error('Savollarni yuklash xatosi:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await questionsAPI.getCategories();
      if (response.success) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Kategoriyalarni yuklash xatosi:', err);
    }
  };

  const loadTestResults = async () => {
    try {
      setLoading(true);
      const response = await testResultsAPI.getAll({ limit: 100 });
      if (response.success) {
        setTestResults(response.results);
      }
    } catch (err) {
      console.error('Test natijalarini yuklash xatosi:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewsAPI.getAll({ limit: 100 });
      if (response.success) {
        setReviews(response.reviews);
      }
    } catch (err) {
      console.error('Sharhlarni yuklash xatosi:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const [questionsStats, testStats, reviewStats] = await Promise.all([
        questionsAPI.getStats(),
        testResultsAPI.getStats(),
        reviewsAPI.getRatingStats()
      ]);
      
      setStatistics({
        questions: questionsStats.data,
        tests: testStats.data,
        reviews: reviewStats.data
      });
    } catch (err) {
      console.error('Statistikani yuklash xatosi:', err);
    }
  };

  // Komponent yuklanganda ma'lumotlarni olish
  useEffect(() => {
    loadQuestions();
    loadCategories();
    loadTestResults();
    loadReviews();
    loadStatistics();
  }, []);

  const logout = () => {
    dispatch({ type: 'LOGOUT_ADMIN' });
    navigate('/');
  };

  const handleQuestionsView = () => {
    setActiveTab('questions');
    setMobileMenuOpen(false);
  };

  const handleAddQuestion = () => {
    setActiveTab('add');
    setMobileMenuOpen(false);
  };

  // Mobile menu click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [mobileMenuOpen]);

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Bu savolni o\'chirishni xohlaysizmi?')) {
      try {
        setSubmitting(true);
        const response = await questionsAPI.delete(id);
        if (response.success) {
          setQuestionsList(questionsList.filter(q => q._id !== id));
          alert('Savol muvaffaqiyatli o\'chirildi!');
        } else {
          alert('Savolni o\'chirishda xato yuz berdi');
        }
      } catch (err) {
        alert('Savolni o\'chirishda xato: ' + formatError(err));
        console.error('Delete xatosi:', err);
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleEditQuestion = (question) => {
    // Backend formatiga o'tkazish
    setEditingQuestion({
      ...question,
      questionText: question.questionText,
      options: question.options || [],
      category: question.category || '',
      difficulty: question.difficulty || 'o\'rta',
      points: question.points || 1,
      explanation: question.explanation || ''
    });
    setActiveTab('edit');
  };

  const handleSaveEdit = async () => {
    if (!editingQuestion.questionText.trim() || editingQuestion.options.some(opt => !opt.text.trim())) {
      alert('Barcha maydonlarni to\'ldiring');
      return;
    }

    // To'g'ri javob borligini tekshirish
    const hasCorrectAnswer = editingQuestion.options.some(opt => opt.isCorrect);
    if (!hasCorrectAnswer) {
      alert('Kamida bitta to\'g\'ri javob belgilanishi kerak');
      return;
    }

    try {
      setSubmitting(true);
      const response = await questionsAPI.update(editingQuestion._id, editingQuestion);
      if (response.success) {
        setQuestionsList(questionsList.map(q => 
          q._id === editingQuestion._id ? response.data : q
        ));
        setEditingQuestion(null);
        setActiveTab('questions');
        alert('Savol muvaffaqiyatli yangilandi!');
      } else {
        alert('Savolni yangilashda xato yuz berdi');
      }
    } catch (err) {
      alert('Savolni yangilashda xato: ' + formatError(err));
      console.error('Update xatosi:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveReview = async (reviewId) => {
    try {
      const response = await reviewsAPI.update(reviewId, { isApproved: true });
      if (response.success) {
        setReviews(reviews.map(r => 
          r.id === reviewId ? { ...r, isApproved: true } : r
        ));
        alert('Sharh tasdiqlandi!');
      }
    } catch (err) {
      alert('Sharhni tasdiqlashda xato: ' + formatError(err));
    }
  };

  const handleRejectReview = async (reviewId) => {
    try {
      const response = await reviewsAPI.update(reviewId, { isApproved: false, isActive: false });
      if (response.success) {
        setReviews(reviews.map(r => 
          r.id === reviewId ? { ...r, isApproved: false, isActive: false } : r
        ));
        alert('Sharh rad etildi!');
      }
    } catch (err) {
      alert('Sharhni rad etishda xato: ' + formatError(err));
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Bu sharhni o\'chirishni xohlaysizmi?')) return;
    
    try {
      const response = await reviewsAPI.delete(reviewId);
      if (response.success) {
        setReviews(reviews.filter(r => r.id !== reviewId));
        alert('Sharh o\'chirildi!');
      }
    } catch (err) {
      alert('Sharhni o\'chirishda xato: ' + formatError(err));
    }
  };

  const handleDeleteTestResult = async (resultId) => {
    if (!confirm('Bu test natijasini o\'chirishni xohlaysizmi?')) return;
    
    try {
      const response = await testResultsAPI.delete(resultId);
      if (response.success) {
        setTestResults(testResults.filter(r => r.id !== resultId));
        alert('Test natijasi o\'chirildi!');
      }
    } catch (err) {
      alert('Test natijasini o\'chirishda xato: ' + formatError(err));
    }
  };

  const handleAddNewQuestion = async () => {
    if (!newQuestion.questionText.trim() || newQuestion.options.some(opt => !opt.text.trim())) {
      alert('Barcha maydonlarni to\'ldiring');
      return;
    }

    if (!newQuestion.category.trim()) {
      alert('Kategoriya tanlanishi kerak');
      return;
    }

    // To'g'ri javob borligini tekshirish
    const hasCorrectAnswer = newQuestion.options.some(opt => opt.isCorrect);
    if (!hasCorrectAnswer) {
      alert('Kamida bitta to\'g\'ri javob belgilanishi kerak');
      return;
    }

    try {
      setSubmitting(true);
      const response = await questionsAPI.create(newQuestion);
      if (response.success) {
        setQuestionsList([...questionsList, response.data]);
        setNewQuestion({
          questionText: '',
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
          ],
          category: '',
          difficulty: 'o\'rta',
          points: 1,
          explanation: ''
        });
        alert('Yangi savol muvaffaqiyatli qo\'shildi!');
        setActiveTab('questions');
      } else {
        alert('Savol qo\'shishda xato yuz berdi');
      }
    } catch (err) {
      alert('Savol qo\'shishda xato: ' + formatError(err));
      console.error('Create xatosi:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const tabs = [
    { id: 'questions', name: 'Savollar ro\'yxati', icon: '📋' },
    { id: 'add', name: 'Yangi savol', icon: '➕' },
    { id: 'edit', name: 'Savolni tahrirlash', icon: '✏️', hidden: !editingQuestion },
    { id: 'results', name: 'Test natijalari', icon: '📊' },
    { id: 'reviews', name: 'Foydalanuvchi sharhlari', icon: '💬' },
    { id: 'statistics', name: 'Statistika', icon: '📈' }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-2xl shadow-2xl border-b border-white/50 z-50 shrink-0 h-[70px] sm:h-[80px] lg:h-[90px] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg sm:shadow-xl animate-pulse">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                  Admin Panel
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base font-medium leading-tight">IELTS Mock Test savollarini boshqarish</p>
              </div>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden group relative flex items-center justify-center w-10 h-10 text-gray-700 hover:text-indigo-600 bg-white/80 backdrop-blur-sm hover:bg-indigo-50 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 border border-gray-200/50"
              >
                <svg className={`w-5 h-5 transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
            {/* Desktop Buttons */}
            <div className="hidden sm:flex items-center space-x-2 lg:space-x-3">
              {/* Questions List Button */}
              <button
                onClick={handleQuestionsView}
                className={`group relative flex items-center px-3 lg:px-4 py-2 lg:py-2.5 text-gray-700 hover:text-white bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 hover:from-blue-500 hover:via-indigo-600 hover:to-purple-700 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 overflow-hidden ${
                  activeTab === 'questions' ? 'ring-2 ring-indigo-400 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white' : ''
                }`}
                title="Savollar ro'yxati"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <svg className="relative w-4 h-4 lg:mr-1.5 transition-all duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span className="relative text-sm font-semibold hidden lg:inline">Savollar ro'yxati</span>
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></div>
              </button>

              {/* Add Question Button */}
              <button
                onClick={handleAddQuestion}
                className={`group relative flex items-center px-3 lg:px-4 py-2 lg:py-2.5 text-gray-700 hover:text-white bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 hover:from-emerald-500 hover:via-teal-600 hover:to-cyan-700 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 overflow-hidden ${
                  activeTab === 'add' ? 'ring-2 ring-emerald-400 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white' : ''
                }`}
                title="Yangi savol"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <svg className="relative w-4 h-4 lg:mr-1.5 transition-all duration-300 group-hover:rotate-90 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="relative text-sm font-semibold hidden lg:inline">Yangi savol</span>
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></div>
              </button>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="group relative flex items-center px-3 lg:px-4 py-2 lg:py-2.5 text-gray-700 hover:text-white bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 hover:from-red-500 hover:via-red-600 hover:to-red-700 rounded-xl transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 hover:-translate-y-0.5 overflow-hidden"
                title="Chiqish"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-700 to-red-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <svg className="relative w-4 h-4 lg:mr-1.5 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="relative text-sm font-semibold hidden lg:inline">Chiqish</span>
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300"></div>
              </button>
            </div>

            {/* Mobile Menu Button (Visible only on mobile) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden group relative flex items-center justify-center w-10 h-10 text-gray-700 hover:text-indigo-600 bg-white/80 backdrop-blur-sm hover:bg-indigo-50 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 border border-gray-200/50"
            >
              <svg className={`w-5 h-5 transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="sm:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-2xl shadow-2xl border-t border-gray-200/50 z-40 animate-slide-down"
          >
            <div className="px-4 py-3 space-y-2">
              {/* Mobile Admin Title */}
              <div className="border-b border-gray-200/50 pb-3 mb-3">
                <h2 className="text-lg font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Admin Panel
                </h2>
                <p className="text-xs text-gray-600 font-medium">IELTS Mock Test savollarini boshqarish</p>
              </div>

              {/* Mobile Menu Items */}
              <button
                onClick={handleQuestionsView}
                className={`group w-full flex items-center px-4 py-3 text-gray-700 hover:text-white bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-500 hover:to-indigo-600 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg ${
                  activeTab === 'questions' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' : ''
                }`}
              >
                <svg className="w-5 h-5 mr-3 transition-all duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span className="font-semibold text-sm">Savollar ro'yxati</span>
              </button>

              <button
                onClick={handleAddQuestion}
                className={`group w-full flex items-center px-4 py-3 text-gray-700 hover:text-white bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-500 hover:to-teal-600 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg ${
                  activeTab === 'add' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' : ''
                }`}
              >
                <svg className="w-5 h-5 mr-3 transition-all duration-300 group-hover:rotate-90 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="font-semibold text-sm">Yangi savol</span>
              </button>

              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="group w-full flex items-center px-4 py-3 text-gray-700 hover:text-white bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-500 hover:to-pink-600 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg"
              >
                <svg className="w-5 h-5 mr-3 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-semibold text-sm">Chiqish</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="flex-1 flex flex-col max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 w-full">
        {/* Content */}
        <div className="w-full bg-white/95 backdrop-blur-2xl rounded-xl sm:rounded-2xl shadow-xl border border-white/70 relative min-h-[600px]">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none"></div>
          {/* Questions List Tab */}
          {activeTab === 'questions' && (
            <div className="relative w-full flex flex-col p-3 sm:p-4 lg:p-6">
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 8.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-red-700 font-medium">{error}</span>
                    <button 
                      onClick={loadQuestions}
                      className="ml-auto px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm font-medium"
                    >
                      Qayta urinish
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                <div>
                  <h2 className="text-lg sm:text-xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Savollar ro'yxati
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5 font-medium">
                    Jami {questionsList.length} ta savol mavjud
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('add')}
                  className="group relative flex items-center justify-center px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 min-h-[36px]"
                >
                  <svg className="w-4 h-4 mr-1.5 transition-all duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="hidden sm:inline">Yangi savol qo'shish</span>
                  <span className="sm:hidden font-bold">Qo'shish</span>
                </button>
              </div>

              <div className="w-full space-y-3 sm:space-y-4 pr-2 pb-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      <span className="text-gray-600 font-medium">Savollar yuklanmoqda...</span>
                    </div>
                  </div>
                ) : questionsList.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Hozircha savollar yo'q</h3>
                    <p className="mt-1 text-sm text-gray-500">Birinchi savolni qo'shish uchun tugmani bosing.</p>
                    <div className="mt-6">
                      <button
                        onClick={() => setActiveTab('add')}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Yangi savol
                      </button>
                    </div>
                  </div>
                ) : (
                  questionsList.map((question, index) => (
                    <div key={question._id} className="group relative bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 border border-gray-200/50 rounded-2xl p-4 sm:p-5 hover:shadow-xl hover:border-indigo-400/70 transition-all duration-300 hover:scale-[1.01] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    <div className="relative flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 space-y-2 sm:space-y-0">
                      <div className="flex items-center">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-3 shadow-lg transition-all duration-300 group-hover:scale-110">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg">Savol {index + 1}</h3>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditQuestion(question)}
                          className="group relative flex items-center justify-center p-2 text-blue-600 hover:text-white bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-600 hover:to-indigo-600 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 min-w-[32px] min-h-[32px]"
                          title="Tahrirlash"
                        >
                          <svg className="w-4 h-4 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question._id)}
                          disabled={submitting}
                          className="group relative flex items-center justify-center p-2 text-red-600 hover:text-white bg-gradient-to-r from-red-100 to-pink-100 hover:from-red-600 hover:to-pink-600 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 min-w-[32px] min-h-[32px] disabled:opacity-50 disabled:cursor-not-allowed"
                          title="O'chirish"
                        >
                          <svg className="w-4 h-4 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <p className="relative text-gray-800 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4 font-semibold">
                      {question.questionText}
                    </p>
                    
                    <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {question.options.map((option, optionIndex) => (
                        <div key={`${question._id}-option-${optionIndex}-${option.text}`} className={`relative text-sm sm:text-base p-3 sm:p-4 rounded-xl flex items-center shadow-md transition-all duration-300 transform hover:scale-[1.02] min-h-[50px] ${
                          option.isCorrect 
                            ? 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white border border-green-400' 
                            : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border border-gray-300 hover:from-indigo-100 hover:to-purple-100 hover:border-indigo-300'
                        }`}>
                          <div className={`relative w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center mr-3 font-bold text-xs sm:text-sm shadow-sm ${
                            option.isCorrect 
                              ? 'bg-white/30 backdrop-blur-sm text-white' 
                              : 'bg-white text-gray-700'
                          }`}>
                            {String.fromCharCode(65 + optionIndex)}
                          </div>
                          <span className="relative flex-1 font-semibold leading-snug">{option.text}</span>
                          {option.isCorrect && (
                            <svg className="w-4 h-4 text-white ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Add Question Tab */}
          {activeTab === 'add' && (
            <div className="relative w-full flex flex-col p-3 sm:p-4 lg:p-6">
              <div className="mb-4 sm:mb-5">
                <h2 className="text-lg sm:text-xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Yangi savol qo'shish
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 font-medium">
                  Yangi test savoli yarating
                </p>
              </div>
              
              <div className="w-full space-y-4 sm:space-y-5 pr-2 pb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Savol matni
                  </label>
                  <div className="relative">
                    <textarea
                      rows={4}
                      value={newQuestion.questionText}
                      onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gradient-to-br from-gray-50 to-white focus:from-white focus:to-indigo-50 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 text-sm sm:text-base text-gray-900 placeholder-gray-400 resize-none shadow-inner hover:shadow-lg min-h-[100px]"
                      placeholder="Savol matnini kiriting..."
                    />
                  </div>
                </div>

                {/* Kategoriya va Qiyinlik */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                      Kategoriya
                    </label>
                    <input
                      type="text"
                      value={newQuestion.category}
                      onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gradient-to-br from-gray-50 to-white focus:from-white focus:to-indigo-50 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 text-sm sm:text-base text-gray-900 placeholder-gray-400"
                      placeholder="Masalan: JavaScript, HTML, CSS"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                      Qiyinlik darajasi
                    </label>
                    <select
                      value={newQuestion.difficulty}
                      onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gradient-to-br from-gray-50 to-white focus:from-white focus:to-indigo-50 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 text-sm sm:text-base text-gray-900"
                    >
                      <option value="oson">Oson</option>
                      <option value="o'rta">O'rta</option>
                      <option value="qiyin">Qiyin</option>
                    </select>
                  </div>
                </div>

                {/* Ball va Tushuntirish */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                      Ball (1-10)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={newQuestion.points}
                      onChange={(e) => setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) || 1 })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gradient-to-br from-gray-50 to-white focus:from-white focus:to-indigo-50 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 text-sm sm:text-base text-gray-900"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">
                      Tushuntirish (ixtiyoriy)
                    </label>
                    <input
                      type="text"
                      value={newQuestion.explanation}
                      onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gradient-to-br from-gray-50 to-white focus:from-white focus:to-indigo-50 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 text-sm sm:text-base text-gray-900 placeholder-gray-400"
                      placeholder="To'g'ri javob uchun tushuntirish"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Javob variantlari
                  </label>
                  <div className="space-y-3">
                    {newQuestion.options.map((option, index) => (
                      <div key={`new-option-${index}-${option.text}`} className="group relative bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/20 backdrop-blur-sm rounded-xl border border-gray-200/70 p-3 sm:p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01] overflow-hidden">
                        <div className="relative flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-md ${
                            option.isCorrect
                              ? 'border-green-500 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white' 
                              : 'border-gray-300 text-gray-700 bg-gradient-to-br from-gray-100 to-gray-200'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) => {
                              const newOptions = [...newQuestion.options];
                              newOptions[index] = { ...newOptions[index], text: e.target.value };
                              setNewQuestion({ ...newQuestion, options: newOptions });
                            }}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 text-sm text-gray-900 placeholder-gray-400 min-h-[40px]"
                            placeholder={`${String.fromCharCode(65 + index)} variantini kiriting...`}
                          />
                          <button
                            onClick={() => {
                              const newOptions = newQuestion.options.map((opt, i) => ({
                                ...opt,
                                isCorrect: i === index
                              }));
                              setNewQuestion({ ...newQuestion, options: newOptions });
                            }}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 ${
                              option.isCorrect
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-indigo-500 hover:text-white'
                            }`}
                          >
                            <span className="hidden sm:inline text-xs">
                              {option.isCorrect ? 'To\'g\'ri ✓' : 'Tanlash'}
                            </span>
                            <span className="sm:hidden">
                              {option.isCorrect ? '✓' : 'Tanlash'}
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setNewQuestion({
                      questionText: '',
                      options: [
                        { text: '', isCorrect: false },
                        { text: '', isCorrect: false },
                        { text: '', isCorrect: false },
                        { text: '', isCorrect: false }
                      ],
                      category: '',
                      difficulty: 'o\'rta',
                      points: 1,
                      explanation: ''
                    })}
                    disabled={submitting}
                    className="group px-4 py-2 text-gray-600 hover:text-red-600 bg-gray-100 hover:bg-red-50 rounded-lg font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 border border-gray-200 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Tozalash
                    </span>
                  </button>
                  <button
                    onClick={handleAddNewQuestion}
                    disabled={submitting}
                    className="group px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center justify-center">
                      {submitting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1.5"></div>
                      ) : (
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                      {submitting ? 'Qo\'shilmoqda...' : 'Savolni qo\'shish'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Question Tab */}
          {activeTab === 'edit' && editingQuestion && (
            <div className="relative w-full flex flex-col p-3 sm:p-4 lg:p-6">
              <div className="mb-4 sm:mb-5">
                <h2 className="text-lg sm:text-xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Savolni tahrirlash
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 font-medium">
                  Mavjud savolni yangilang
                </p>
              </div>
              
              <div className="w-full space-y-4 sm:space-y-5 pr-2 pb-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Savol matni
                  </label>
                  <div className="relative">
                    <textarea
                      rows={4}
                      value={editingQuestion.questionText}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, questionText: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gradient-to-br from-gray-50 to-white focus:from-white focus:to-blue-50 focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-sm sm:text-base text-gray-900 placeholder-gray-400 resize-none shadow-inner hover:shadow-lg min-h-[100px]"
                      placeholder="Savol matnini kiriting..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">
                    Javob variantlari
                  </label>
                  <div className="space-y-3">
                    {editingQuestion.options.map((option, index) => (
                      <div key={`edit-${editingQuestion._id}-option-${index}-${option.text}`} className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-3 sm:p-4 shadow-md hover:shadow-lg transition-all duration-300">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                            option.isCorrect
                              ? 'border-blue-500 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg' 
                              : 'border-gray-300 text-gray-600 bg-white'
                          }`}>
                            {String.fromCharCode(65 + index)}
                          </div>
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) => {
                              const newOptions = [...editingQuestion.options];
                              newOptions[index] = { ...newOptions[index], text: e.target.value };
                              setEditingQuestion({ ...editingQuestion, options: newOptions });
                            }}
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50/50 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:bg-white transition-all duration-300 text-sm text-gray-900 placeholder-gray-400 min-h-[40px]"
                            placeholder={`${String.fromCharCode(65 + index)} variantini kiriting...`}
                          />
                          <button
                            onClick={() => {
                              const newOptions = editingQuestion.options.map((opt, i) => ({
                                ...opt,
                                isCorrect: i === index
                              }));
                              setEditingQuestion({ ...editingQuestion, options: newOptions });
                            }}
                            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 ${
                              option.isCorrect
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-blue-500 hover:text-white'
                            }`}
                          >
                            <span className="hidden sm:inline text-xs">
                              {option.isCorrect ? 'To\'g\'ri ✓' : 'Tanlash'}
                            </span>
                            <span className="sm:hidden">
                              {option.isCorrect ? '✓' : 'Tanlash'}
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setEditingQuestion(null);
                      setActiveTab('questions');
                    }}
                    disabled={submitting}
                    className="group px-4 py-2 text-gray-600 hover:text-red-600 bg-gray-100 hover:bg-red-50 rounded-lg font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 border border-gray-200 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Bekor qilish
                    </span>
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={submitting}
                    className="group px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center justify-center">
                      {submitting ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1.5"></div>
                      ) : (
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {submitting ? 'Saqlanmoqda...' : 'O\'zgarishlarni saqlash'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Test Results Tab */}
          {activeTab === 'results' && (
            <div className="relative w-full flex flex-col p-3 sm:p-4 lg:p-6">
              <div className="mb-4 sm:mb-5">
                <h2 className="text-lg sm:text-xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Test Natijalari
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 font-medium">
                  Barcha test natijalarini ko'ring va boshqaring
                </p>
              </div>
              
              <div className="w-full overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700">
                  <thead className="text-xs uppercase bg-gradient-to-r from-indigo-50 to-purple-50 text-gray-700">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Foydalanuvchi</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">To'g'ri javoblar</th>
                      <th className="px-4 py-3">Foiz</th>
                      <th className="px-4 py-3">Vaqt</th>
                      <th className="px-4 py-3">Sana</th>
                      <th className="px-4 py-3">Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testResults.map((result, index) => (
                      <tr key={result.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3 font-medium">{result.userName}</td>
                        <td className="px-4 py-3">{result.userEmail || '-'}</td>
                        <td className="px-4 py-3">
                          {result.correctAnswers}/{result.totalQuestions}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            result.percentage >= 80 ? 'bg-green-100 text-green-800' :
                            result.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {result.percentage?.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {Math.floor(result.timeTaken / 60)}:{(result.timeTaken % 60).toString().padStart(2, '0')}
                        </td>
                        <td className="px-4 py-3">
                          {new Date(result.createdAt).toLocaleDateString('uz-UZ')}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDeleteTestResult(result.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            O'chirish
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {testResults.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Hali test natijalari yo'q
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="relative w-full flex flex-col p-3 sm:p-4 lg:p-6">
              <div className="mb-4 sm:mb-5">
                <h2 className="text-lg sm:text-xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Foydalanuvchi Sharhlari
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 font-medium">
                  Sharhlarni ko'ring va tasdiqlang
                </p>
              </div>
              
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl shadow-md p-4 sm:p-5 border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-gray-800">{review.userName}</h3>
                        <p className="text-xs text-gray-500">{review.userEmail || 'Email kiritilmagan'}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-5 h-5 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('uz-UZ')}
                      </span>
                      
                      <div className="flex space-x-2">
                        {!review.isApproved && (
                          <>
                            <button
                              onClick={() => handleApproveReview(review.id)}
                              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-colors"
                            >
                              Tasdiqlash
                            </button>
                            <button
                              onClick={() => handleRejectReview(review.id)}
                              className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-xs font-medium transition-colors"
                            >
                              Rad etish
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-colors"
                        >
                          O'chirish
                        </button>
                      </div>
                    </div>
                    
                    {review.isApproved && (
                      <div className="mt-2">
                        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          ✓ Tasdiqlangan
                        </span>
                      </div>
                    )}
                  </div>
                ))}
                
                {reviews.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Hali sharhlar yo'q
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'statistics' && statistics && (
            <div className="relative w-full flex flex-col p-3 sm:p-4 lg:p-6">
              <div className="mb-4 sm:mb-5">
                <h2 className="text-lg sm:text-xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Statistika
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 font-medium">
                  Tizim statistikasi va tahlil
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {/* Savollar statistikasi */}
                <div className="bg-white rounded-xl shadow-md p-4">
                  <h3 className="font-bold text-gray-700 mb-3">📚 Savollar</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Jami savollar:</span>
                      <span className="font-bold">{statistics.questions?.totalQuestions || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kategoriyalar:</span>
                      <span className="font-bold">{statistics.questions?.totalCategories || 0}</span>
                    </div>
                  </div>
                </div>
                
                {/* Test natijalari statistikasi */}
                <div className="bg-white rounded-xl shadow-md p-4">
                  <h3 className="font-bold text-gray-700 mb-3">📊 Test natijalari</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Jami testlar:</span>
                      <span className="font-bold">{statistics.tests?.totalTests || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">O'rtacha natija:</span>
                      <span className="font-bold">{statistics.tests?.averagePercentage?.toFixed(1) || 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Foydalanuvchilar:</span>
                      <span className="font-bold">{statistics.tests?.totalUsers || 0}</span>
                    </div>
                  </div>
                </div>
                
                {/* Sharhlar statistikasi */}
                <div className="bg-white rounded-xl shadow-md p-4">
                  <h3 className="font-bold text-gray-700 mb-3">💬 Sharhlar</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Jami sharhlar:</span>
                      <span className="font-bold">{statistics.reviews?.totalReviews || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">O'rtacha reyting:</span>
                      <span className="font-bold">⭐ {statistics.reviews?.averageRating?.toFixed(1) || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Qiyinlik darajasi bo'yicha savollar */}
              {statistics.questions?.difficultyStats && (
                <div className="bg-white rounded-xl shadow-md p-4 mb-4">
                  <h3 className="font-bold text-gray-700 mb-3">Qiyinlik darajasi bo'yicha savollar</h3>
                  <div className="space-y-2">
                    {statistics.questions.difficultyStats.map((stat) => (
                      <div key={stat.difficulty} className="flex justify-between items-center">
                        <span className="text-gray-600 capitalize">{stat.difficulty}:</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${(stat.count / statistics.questions.totalQuestions) * 100}%` }}
                            />
                          </div>
                          <span className="font-bold text-sm">{stat.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Top natijalar */}
              {statistics.tests?.topResults && statistics.tests.topResults.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-4">
                  <h3 className="font-bold text-gray-700 mb-3">🏆 Eng yaxshi natijalar</h3>
                  <div className="space-y-2">
                    {statistics.tests.topResults.slice(0, 5).map((result, index) => (
                      <div key={result.id} className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-500">#{index + 1}</span>
                          <span className="text-gray-700">{result.userName}</span>
                        </div>
                        <span className="font-bold text-indigo-600">{result.percentage?.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      
    </div>
  );
};

export default AdminPanel;
