import React from 'react';

const TestInfoSection = ({ startTest }) => {
  return (
    <div className="px-2 sm:px-4 lg:px-6 max-w-7xl mx-auto mb-8 sm:mb-12">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-100">
        
        {/* Title Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2 sm:mb-4 leading-tight">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Test Haqida Ma'lumot
            </span>
          </h3>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full"></div>
        </div>
        
        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mb-8 sm:mb-10">
          
          {/* Vaqt Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Vaqt</h4>
              <p className="text-blue-600 font-bold text-lg sm:text-xl lg:text-2xl">10 daqiqa</p>
            </div>
          </div>

          {/* Savollar Card */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-green-200 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Savollar</h4>
              <p className="text-green-600 font-bold text-lg sm:text-xl lg:text-2xl">20 ta</p>
            </div>
          </div>

          {/* Turi Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Turi</h4>
              <p className="text-purple-600 font-bold text-lg sm:text-xl lg:text-2xl">Tasodifiy</p>
            </div>
          </div>

          {/* Natija Card */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-orange-200 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] sm:col-span-2 lg:col-span-1">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Natija</h4>
              <p className="text-orange-600 font-bold text-lg sm:text-xl lg:text-2xl">Batafsil</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-6 sm:mb-8"></div>

        {/* Start Button Section */}
        <div className="text-center px-2 sm:px-4">
          <div className="inline-block">
            <button
              onClick={startTest}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-bold text-sm sm:text-base lg:text-lg rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 border border-indigo-500 hover:border-indigo-400 min-w-[200px] sm:min-w-[250px]"
            >
              <div className="flex items-center space-x-2 sm:space-x-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Testni Boshlash</span>
              </div>
            </button>
          </div>
          
          {/* Additional Info */}
          <div className="mt-4 sm:mt-6">
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Test boshlangandan so'ng, siz 10 daqiqa vaqt ichida 20 ta savolga javob berishingiz kerak
            </p>
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <div className="flex space-x-1 sm:space-x-2">
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestInfoSection;
