import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-6 min-[375px]:py-7 min-[480px]:py-8 min-[640px]:py-10 min-[768px]:py-12 lg:py-16">
      <div className="max-w-full min-[640px]:max-w-3xl min-[768px]:max-w-7xl mx-auto px-3 min-[375px]:px-4 min-[640px]:px-5 min-[768px]:px-6 lg:px-8 text-center">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-4 min-[375px]:mb-5 min-[480px]:mb-6 min-[640px]:mb-7 min-[768px]:mb-8">
          <div className="w-10 h-10 min-[375px]:w-11 min-[375px]:h-11 min-[480px]:w-12 min-[480px]:h-12 min-[640px]:w-14 min-[640px]:h-14 min-[768px]:w-16 min-[768px]:h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 rounded-lg min-[375px]:rounded-xl min-[480px]:rounded-xl min-[640px]:rounded-2xl flex items-center justify-center shadow-xl mb-2 min-[375px]:mb-2.5 min-[480px]:mb-3 min-[640px]:mb-4">
            <svg className="w-5 h-5 min-[375px]:w-5.5 min-[375px]:h-5.5 min-[480px]:w-6 min-[480px]:h-6 min-[640px]:w-7 min-[640px]:h-7 min-[768px]:w-8 min-[768px]:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h4 className="text-base min-[375px]:text-lg min-[480px]:text-xl min-[640px]:text-xl min-[768px]:text-2xl font-bold mb-1.5 min-[375px]:mb-2 min-[480px]:mb-2.5 min-[640px]:mb-3 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            <span className="hidden min-[480px]:inline">IELTS Mock Test Platform</span>
            <span className="min-[480px]:hidden">IELTS Mock Test</span>
          </h4>
        </div>

        {/* Description */}
        <div className="mb-4 min-[375px]:mb-5 min-[480px]:mb-6 min-[640px]:mb-7 min-[768px]:mb-8">
          <p className="text-xs min-[375px]:text-sm min-[480px]:text-base min-[640px]:text-base min-[768px]:text-lg text-gray-300 max-w-full min-[480px]:max-w-2xl min-[768px]:max-w-3xl mx-auto leading-relaxed px-1 min-[375px]:px-2">
            <span className="hidden min-[480px]:inline">Mukammal IELTS tayyorgarlik tajribasi uchun eng yaxshi platforma. Professional test muhiti va batafsil natijalar bilan bilimingizni oshiring.</span>
            <span className="min-[480px]:hidden">IELTS tayyorgarlik uchun eng yaxshi platforma. Professional test muhiti bilan bilimingizni oshiring.</span>
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 min-[480px]:grid-cols-3 gap-3 min-[375px]:gap-4 min-[640px]:gap-6 mb-4 min-[375px]:mb-5 min-[480px]:mb-6 min-[640px]:mb-7 min-[768px]:mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg min-[480px]:rounded-xl p-2.5 min-[375px]:p-3 min-[480px]:p-4 border border-white/10">
            <div className="w-7 h-7 min-[375px]:w-8 min-[375px]:h-8 min-[480px]:w-9 min-[480px]:h-9 min-[640px]:w-10 min-[640px]:h-10 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-1.5 min-[375px]:mb-2">
              <svg className="w-3.5 h-3.5 min-[375px]:w-4 min-[375px]:h-4 min-[480px]:w-4.5 min-[480px]:h-4.5 min-[640px]:w-5 min-[640px]:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h5 className="text-xs min-[375px]:text-sm min-[480px]:text-base font-semibold text-white mb-1">Tez va Qulay</h5>
            <p className="text-xs min-[480px]:text-sm text-gray-400">10 daqiqada natija</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-lg min-[480px]:rounded-xl p-2.5 min-[375px]:p-3 min-[480px]:p-4 border border-white/10">
            <div className="w-7 h-7 min-[375px]:w-8 min-[375px]:h-8 min-[480px]:w-9 min-[480px]:h-9 min-[640px]:w-10 min-[640px]:h-10 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-1.5 min-[375px]:mb-2">
              <svg className="w-3.5 h-3.5 min-[375px]:w-4 min-[375px]:h-4 min-[480px]:w-4.5 min-[480px]:h-4.5 min-[640px]:w-5 min-[640px]:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h5 className="text-xs min-[375px]:text-sm min-[480px]:text-base font-semibold text-white mb-1">Batafsil Tahlil</h5>
            <p className="text-xs min-[480px]:text-sm text-gray-400">Har bir javob uchun</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-lg min-[480px]:rounded-xl p-2.5 min-[375px]:p-3 min-[480px]:p-4 border border-white/10 min-[480px]:col-span-3 min-[640px]:col-span-1">
            <div className="w-7 h-7 min-[375px]:w-8 min-[375px]:h-8 min-[480px]:w-9 min-[480px]:h-9 min-[640px]:w-10 min-[640px]:h-10 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-1.5 min-[375px]:mb-2">
              <svg className="w-3.5 h-3.5 min-[375px]:w-4 min-[375px]:h-4 min-[480px]:w-4.5 min-[480px]:h-4.5 min-[640px]:w-5 min-[640px]:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h5 className="text-xs min-[375px]:text-sm min-[480px]:text-base font-semibold text-white mb-1">Real Sharoit</h5>
            <p className="text-xs min-[480px]:text-sm text-gray-400">Haqiqiy IELTS kabi</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-3 min-[375px]:pt-4 min-[480px]:pt-5 min-[640px]:pt-6">
          <div className="flex flex-col min-[480px]:flex-row items-center justify-between space-y-2 min-[480px]:space-y-0">
            <p className="text-xs min-[480px]:text-sm text-gray-400 order-2 min-[480px]:order-1">
              <span className="hidden min-[375px]:inline">&copy; 2025 IELTS Mock Test Platform. Barcha huquqlar himoyalangan.</span>
              <span className="min-[375px]:hidden">&copy; 2025 IELTS Mock Test</span>
            </p>
            <div className="flex items-center space-x-3 min-[480px]:space-x-4 order-1 min-[480px]:order-2">
              <span className="text-xs min-[480px]:text-sm text-gray-400">
                <span className="hidden min-[375px]:inline">Sizga muvaffaqiyat tilaymiz!</span>
                <span className="min-[375px]:hidden">Omad!</span>
              </span>
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 min-[375px]:w-2 min-[375px]:h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 min-[375px]:w-2 min-[375px]:h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-1.5 h-1.5 min-[375px]:w-2 min-[375px]:h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
