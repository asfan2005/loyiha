import React from 'react';

const StatisticsSection = () => {
  // Statistics data
  const statistics = {
    totalUsers: "15,000+",
    testsCompleted: "45,000+",
    averageScore: "6.8",
    successRate: "92%"
  };

  return (
    <div className="px-2 sm:px-4 lg:px-6 max-w-7xl mx-auto mb-8 sm:mb-12">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-white shadow-xl">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6 sm:mb-8 text-center leading-tight">
          Platform Statistikasi
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="text-center p-2 sm:p-3 lg:p-4 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 leading-none">{statistics.totalUsers}</div>
            <div className="text-xs sm:text-sm lg:text-base opacity-90 font-medium">Foydalanuvchilar</div>
          </div>
          <div className="text-center p-2 sm:p-3 lg:p-4 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 leading-none">{statistics.testsCompleted}</div>
            <div className="text-xs sm:text-sm lg:text-base opacity-90 font-medium">Testlar</div>
          </div>
          <div className="text-center p-2 sm:p-3 lg:p-4 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 leading-none">{statistics.averageScore}</div>
            <div className="text-xs sm:text-sm lg:text-base opacity-90 font-medium">O'rtacha ball</div>
          </div>
          <div className="text-center p-2 sm:p-3 lg:p-4 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 leading-none">{statistics.successRate}</div>
            <div className="text-xs sm:text-sm lg:text-base opacity-90 font-medium">Muvaffaqiyat</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsSection;
