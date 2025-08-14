import React, { useState, useEffect } from 'react';

const UserReviewsSection = () => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Real user reviews data
  const userReviews = [
    {
      id: 1,
      name: "Azizbek Karimov",
      location: "Toshkent",
      avatar: "👨‍🎓",
      rating: 5,
      review: "Bu platform haqiqatan ham ajoyib! IELTS imtihoniga tayyorgarlikda juda ko'p yordam berdi. Real imtihon sharoitini to'liq taqlid qiladi.",
      score: "7.5",
      testDate: "2025 dekabr"
    },
    {
      id: 2,
      name: "Nilufar Abdullayeva",
      location: "Samarqand",
      avatar: "👩‍💼",
      rating: 5,
      review: "Mock testlar juda sifatli va savollar real IELTS imtihoniga juda yaqin. Natijalar ham batafsil tahlil bilan beriladi.",
      score: "8.0",
      testDate: "2025 noyabr"
    },
    {
      id: 3,
      name: "Bobur Rahimov",
      location: "Buxoro",
      avatar: "👨‍💻",
      rating: 5,
      review: "Platform juda qulay va tez. Mobil versiyasi ham mukammal ishlaydi. Tavsiya qilaman!",
      score: "7.0",
      testDate: "2025 oktyabr"
    },
    {
      id: 4,
      name: "Madina Toshpulatova",
      location: "Farg'ona",
      avatar: "👩‍🎓",
      rating: 4,
      review: "Juda yaxshi platforma. Faqat test savollar biroz qiyinroq bo'lsa yaxshi bo'lardi. Umuman olganda juda mamnunman.",
      score: "6.5",
      testDate: "2025 dekabr"
    }
  ];

  useEffect(() => {
    // Auto-rotate reviews every 5 seconds
    const interval = setInterval(() => {
      setCurrentReviewIndex((prevIndex) => 
        prevIndex === userReviews.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [userReviews.length]);

  const nextReview = () => {
    setCurrentReviewIndex((prevIndex) => 
      prevIndex === userReviews.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevReview = () => {
    setCurrentReviewIndex((prevIndex) => 
      prevIndex === 0 ? userReviews.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="px-3 xs:px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-6 xs:mb-8 sm:mb-12">
      <div className="bg-white rounded-xl xs:rounded-2xl sm:rounded-3xl shadow-xl p-3 xs:p-4 sm:p-6 lg:p-8">
        <h3 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 xs:mb-6 sm:mb-8 text-center">
          Foydalanuvchilar Fikri
        </h3>
        <div className="relative">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg xs:rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-3 xs:mb-4 sm:mb-6">
              <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg xs:rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-base xs:text-lg sm:text-xl mb-2 xs:mb-3 sm:mb-0 sm:mr-4 shadow-lg flex-shrink-0">
                {userReviews[currentReviewIndex].avatar}
              </div>
              <div className="flex-1 min-w-0 w-full">
                <h4 className="font-bold text-sm xs:text-base sm:text-lg text-gray-900 truncate">
                  {userReviews[currentReviewIndex].name}
                </h4>
                <p className="text-xs xs:text-sm sm:text-base text-gray-600 mb-1 xs:mb-2">
                  {userReviews[currentReviewIndex].location}
                </p>
                <div className="flex items-center flex-wrap gap-1 xs:gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i} 
                        className={`w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 ${i < userReviews[currentReviewIndex].rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs xs:text-xs sm:text-sm text-gray-600 bg-white px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full border font-medium">
                    IELTS: {userReviews[currentReviewIndex].score}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-200 px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full">
                    {userReviews[currentReviewIndex].testDate}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white p-2.5 xs:p-3 sm:p-4 rounded-md xs:rounded-lg border-l-4 border-indigo-500 shadow-sm">
              <p className="text-xs xs:text-sm sm:text-base text-gray-700 italic leading-relaxed">
                "{userReviews[currentReviewIndex].review}"
              </p>
            </div>
          </div>
          
          {/* Navigation - Hidden on very small screens */}
          <button 
            onClick={prevReview}
            className="hidden md:flex absolute -left-1 xs:-left-2 sm:-left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1.5 xs:p-2 sm:p-3 shadow-lg hover:shadow-xl border border-gray-200 hover:scale-105 transition-all duration-200 items-center justify-center"
            aria-label="Previous review"
          >
            <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={nextReview}
            className="hidden md:flex absolute -right-1 xs:-right-2 sm:-right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1.5 xs:p-2 sm:p-3 shadow-lg hover:shadow-xl border border-gray-200 hover:scale-105 transition-all duration-200 items-center justify-center"
            aria-label="Next review"
          >
            <svg className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Mobile Navigation */}
          <div className="flex md:hidden justify-between mt-3 xs:mt-4 px-1 xs:px-2">
            <button 
              onClick={prevReview}
              className="flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md xs:rounded-lg px-2.5 xs:px-3 sm:px-4 py-1.5 xs:py-2 shadow-lg hover:shadow-xl transition-all duration-200"
              aria-label="Previous review"
            >
              <svg className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 mr-0.5 xs:mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-xs xs:text-sm font-medium">Oldingi</span>
            </button>
            <button 
              onClick={nextReview}
              className="flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md xs:rounded-lg px-2.5 xs:px-3 sm:px-4 py-1.5 xs:py-2 shadow-lg hover:shadow-xl transition-all duration-200"
              aria-label="Next review"
            >
              <span className="text-xs xs:text-sm font-medium">Keyingi</span>
              <svg className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 ml-0.5 xs:ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Pagination Dots */}
          <div className="flex justify-center mt-4 xs:mt-6 sm:mt-8 gap-2 xs:gap-3">
            {userReviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentReviewIndex(index)}
                className={`relative transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 rounded-full ${
                  index === currentReviewIndex 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg scale-105' 
                    : 'bg-gray-300 hover:bg-gray-500 shadow-sm'
                }`}
                style={{
                  width: index === currentReviewIndex ? '28px' : '10px',
                  height: index === currentReviewIndex ? '28px' : '10px',
                  boxShadow: index === currentReviewIndex 
                    ? '0 3px 10px rgba(99, 102, 241, 0.3), 0 2px 6px rgba(139, 92, 246, 0.2)' 
                    : '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
                aria-label={`Go to review ${index + 1}`}
              >
                {index === currentReviewIndex && (
                  <div 
                    className="absolute inset-0 bg-white rounded-full opacity-30 animate-pulse"
                    style={{
                      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }}
                  />
                )}
                {index === currentReviewIndex && (
                  <div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full"
                    style={{
                      width: '6px',
                      height: '6px'
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserReviewsSection;

