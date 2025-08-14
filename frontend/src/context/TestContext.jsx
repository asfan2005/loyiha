import React, { createContext, useContext, useReducer } from 'react';
import { questionsAPI } from '../services/api';

const TestContext = createContext();

const initialState = {
  testQuestions: [],
  currentQuestionIndex: 0,
  answers: [],
  timeRemaining: 600, // 10 minutes in seconds
  testStartTime: null,
  testEndTime: null,
  testResult: null,
  isTestActive: false,
  adminLoggedIn: false,
  isLoadingQuestions: false,
  questionsError: null
};

const testReducer = (state, action) => {
  switch (action.type) {
    case 'START_LOADING_QUESTIONS':
      return {
        ...state,
        isLoadingQuestions: true,
        questionsError: null
      };
    
    case 'QUESTIONS_LOADED':
      return {
        ...state,
        testQuestions: action.payload,
        currentQuestionIndex: 0,
        answers: new Array(action.payload.length).fill(null),
        timeRemaining: 600,
        testStartTime: Date.now(),
        isTestActive: true,
        testResult: null,
        isLoadingQuestions: false,
        questionsError: null
      };
    
    case 'QUESTIONS_ERROR':
      return {
        ...state,
        isLoadingQuestions: false,
        questionsError: action.payload,
        isTestActive: false
      };
    
    case 'ANSWER_QUESTION':
      const newAnswers = [...state.answers];
      newAnswers[action.payload.questionIndex] = action.payload.answer;
      return {
        ...state,
        answers: newAnswers
      };
    
    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.testQuestions.length - 1)
      };
    
    case 'PREVIOUS_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0)
      };
    
    case 'GO_TO_QUESTION':
      return {
        ...state,
        currentQuestionIndex: action.payload
      };
    
    case 'UPDATE_TIMER':
      return {
        ...state,
        timeRemaining: Math.max(0, state.timeRemaining - 1)
      };
    
    case 'FINISH_TEST':
      return {
        ...state,
        isTestActive: false,
        testEndTime: Date.now(),
        testResult: action.payload
      };
    
    case 'RESET_TEST':
      return {
        ...state,
        testQuestions: [],
        currentQuestionIndex: 0,
        answers: [],
        timeRemaining: 600,
        testStartTime: null,
        testEndTime: null,
        testResult: null,
        isTestActive: false
      };
    
    case 'LOGIN_ADMIN':
      return {
        ...state,
        adminLoggedIn: true
      };
    
    case 'LOGOUT_ADMIN':
      return {
        ...state,
        adminLoggedIn: false
      };
    
    default:
      return state;
  }
};

export const TestProvider = ({ children }) => {
  const [state, dispatch] = useReducer(testReducer, initialState);

  const startTest = async () => {
    dispatch({ type: 'START_LOADING_QUESTIONS' });
    
    try {
      // API dan 20 ta random savollarni olish
      const response = await questionsAPI.getAll({ 
        limit: 20, 
        isActive: true,
        random: true 
      });
      
      if (response.questions && response.questions.length > 0) {
        // Savollarni formatlash (API already formats them correctly)
        const formattedQuestions = response.questions;
        
        dispatch({ type: 'QUESTIONS_LOADED', payload: formattedQuestions });
      } else {
        throw new Error('Savollar topilmadi');
      }
    } catch (error) {
      console.error('Savollarni yuklashda xato:', error);
      dispatch({ 
        type: 'QUESTIONS_ERROR', 
        payload: error.message || 'Savollarni yuklashda xato yuz berdi' 
      });
    }
  };

  return (
    <TestContext.Provider value={{ state, dispatch, startTest }}>
      {children}
    </TestContext.Provider>
  );
};

export const useTest = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTest must be used within TestProvider');
  }
  return context;
};
