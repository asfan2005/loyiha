export const questions = [
  {
    id: 1,
    question: "What is the main purpose of the IELTS test?",
    options: [
      "To test English language proficiency for academic and immigration purposes",
      "To measure intelligence quotient",
      "To assess mathematical skills",
      "To evaluate computer literacy"
    ],
    correctAnswer: 0
  },
  {
    id: 2,
    question: "Which of the following is NOT a section of the IELTS test?",
    options: [
      "Listening",
      "Reading", 
      "Writing",
      "Mathematics"
    ],
    correctAnswer: 3
  },
  {
    id: 3,
    question: "How long does the IELTS Speaking test typically last?",
    options: [
      "5-10 minutes",
      "11-14 minutes",
      "15-20 minutes",
      "25-30 minutes"
    ],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "What does IELTS stand for?",
    options: [
      "International English Language Testing System",
      "International Education Language Test Score",
      "Institute of English Language Teaching Standards",
      "International Examination for Language Teaching Skills"
    ],
    correctAnswer: 0
  },
  {
    id: 5,
    question: "Which organization jointly manages IELTS?",
    options: [
      "Cambridge Assessment English, British Council, and IDP",
      "Oxford University and Cambridge University",
      "Educational Testing Service (ETS)",
      "Pearson Education"
    ],
    correctAnswer: 0
  },
  {
    id: 6,
    question: "What is the highest band score in IELTS?",
    options: [
      "8.0",
      "9.0",
      "10.0",
      "12.0"
    ],
    correctAnswer: 1
  },
  {
    id: 7,
    question: "How many parts does the IELTS Listening test have?",
    options: [
      "2 parts",
      "3 parts",
      "4 parts",
      "5 parts"
    ],
    correctAnswer: 2
  },
  {
    id: 8,
    question: "Which type of IELTS is required for UK visa applications?",
    options: [
      "Academic IELTS",
      "General Training IELTS",
      "IELTS for UKVI",
      "Any IELTS type"
    ],
    correctAnswer: 2
  },
  {
    id: 9,
    question: "How long is the IELTS Writing test?",
    options: [
      "45 minutes",
      "60 minutes",
      "75 minutes",
      "90 minutes"
    ],
    correctAnswer: 1
  },
  {
    id: 10,
    question: "What is the minimum IELTS score typically required for university admission?",
    options: [
      "5.0",
      "5.5",
      "6.0",
      "6.5"
    ],
    correctAnswer: 3
  },
  {
    id: 11,
    question: "How many tasks are there in the IELTS Writing test?",
    options: [
      "1 task",
      "2 tasks",
      "3 tasks",
      "4 tasks"
    ],
    correctAnswer: 1
  },
  {
    id: 12,
    question: "What is the time limit for the IELTS Reading test?",
    options: [
      "45 minutes",
      "60 minutes",
      "75 minutes",
      "90 minutes"
    ],
    correctAnswer: 1
  },
  {
    id: 13,
    question: "How many passages are there in the IELTS Academic Reading test?",
    options: [
      "2 passages",
      "3 passages",
      "4 passages",
      "5 passages"
    ],
    correctAnswer: 1
  },
  {
    id: 14,
    question: "What is the difference between Academic and General Training IELTS?",
    options: [
      "Only the Speaking test differs",
      "Only the Listening test differs",
      "The Reading and Writing tests differ",
      "All sections are completely different"
    ],
    correctAnswer: 2
  },
  {
    id: 15,
    question: "How long are IELTS results valid?",
    options: [
      "1 year",
      "2 years",
      "3 years",
      "5 years"
    ],
    correctAnswer: 1
  },
  {
    id: 16,
    question: "Which skill is NOT directly tested in IELTS?",
    options: [
      "Grammar",
      "Vocabulary",
      "Pronunciation",
      "Computer skills"
    ],
    correctAnswer: 3
  },
  {
    id: 17,
    question: "What happens if you arrive late for the IELTS test?",
    options: [
      "You can still take the test",
      "You may not be allowed to take the test",
      "You get extra time to compensate",
      "You can reschedule for free"
    ],
    correctAnswer: 1
  },
  {
    id: 18,
    question: "How is the IELTS overall band score calculated?",
    options: [
      "Sum of all four skills",
      "Average of all four skills",
      "Highest score among four skills",
      "Weighted average with emphasis on Writing"
    ],
    correctAnswer: 1
  },
  {
    id: 19,
    question: "Can you use a pen for the IELTS Listening and Reading tests?",
    options: [
      "Yes, pen is required",
      "No, only pencil is allowed",
      "Either pen or pencil",
      "Only mechanical pencil"
    ],
    correctAnswer: 1
  },
  {
    id: 20,
    question: "What should you do if you finish the IELTS Reading test early?",
    options: [
      "Leave the examination room",
      "Review your answers",
      "Help other candidates",
      "Start the next test section"
    ],
    correctAnswer: 1
  }
];

// Function to get random questions for the test
export const getRandomQuestions = (count = 20) => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, questions.length));
};

// Function to calculate score
export const calculateScore = (answers, testQuestions) => {
  let correct = 0;
  answers.forEach((answer, index) => {
    if (answer === testQuestions[index].correctAnswer) {
      correct++;
    }
  });
  return {
    correct,
    total: testQuestions.length,
    percentage: Math.round((correct / testQuestions.length) * 100)
  };
};
