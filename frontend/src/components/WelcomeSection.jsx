import React from 'react';

const WelcomeSection = () => {
  return (
    <div className="px-3 sm:px-4 lg:px-6 py-8 sm:py-12 lg:py-16 max-w-7xl mx-auto text-center">
      <div className="relative">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight">
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent block sm:inline">
            IELTS Mock Test'ga
          </span>
          <br className="hidden sm:block" />
          <span className="text-xl sm:text-3xl md:text-4xl lg:text-5xl block sm:inline mt-1 sm:mt-0">Xush Kelibsiz</span>
        </h2>
        <div className="max-w-4xl mx-auto">
          <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed px-2">
            IELTS imtihoniga tayyorgarlik ko'rish uchun maxsus mo'ljallangan{' '}
            <span className="font-semibold text-indigo-600 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              professional
            </span>{' '}
            mock test platformasi.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-gray-500 mt-2 sm:mt-3 px-2">
            Haqiqiy imtihon sharoitida o'z bilimingizni sinab ko'ring.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
    </div>
  );
};

export default WelcomeSection;
