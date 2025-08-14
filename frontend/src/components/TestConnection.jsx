import React, { useState, useEffect } from 'react';
import { healthAPI, questionsAPI, formatError } from '../services/api';

const TestConnection = () => {
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [serverInfo, setServerInfo] = useState(null);
  const [error, setError] = useState(null);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setConnectionStatus('checking');
    setError(null);
    const results = [];

    try {
      // 1. Health check
      try {
        const healthResponse = await healthAPI.check();
        setServerInfo(healthResponse);
        results.push({
          test: 'Health Check',
          status: 'success',
          message: 'Server ishlayapti',
          data: healthResponse
        });
      } catch (err) {
        results.push({
          test: 'Health Check',
          status: 'error',
          message: 'Server bilan aloqa yo\'q: ' + formatError(err)
        });
        throw err;
      }

      // 2. Questions API test
      try {
        const questionsResponse = await questionsAPI.getAll();
        results.push({
          test: 'Questions API',
          status: 'success',
          message: `${questionsResponse.data.length} ta savol topildi`,
          data: questionsResponse
        });
      } catch (err) {
        results.push({
          test: 'Questions API',
          status: 'error',
          message: 'Savollarni olishda xato: ' + formatError(err)
        });
      }

      // 3. Categories API test
      try {
        const categoriesResponse = await questionsAPI.getCategories();
        results.push({
          test: 'Categories API',
          status: 'success',
          message: `${categoriesResponse.data.length} ta kategoriya topildi`,
          data: categoriesResponse
        });
      } catch (err) {
        results.push({
          test: 'Categories API',
          status: 'error',
          message: 'Kategoriyalarni olishda xato: ' + formatError(err)
        });
      }

      setConnectionStatus('connected');
    } catch (err) {
      setConnectionStatus('error');
      setError(formatError(err));
    }

    setTestResults(results);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'checking':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'connected':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'checking':
        return (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
        );
      case 'connected':
        return (
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Backend API Connection Test
          </h2>
          <p className="text-gray-600">
            Backend server bilan aloqani tekshirish va API endpoint'larini test qilish
          </p>
        </div>

        <div className="p-6">
          {/* Connection Status */}
          <div className={`flex items-center p-4 rounded-lg border mb-6 ${getStatusColor(connectionStatus)}`}>
            <div className="flex items-center mr-3">
              {getStatusIcon(connectionStatus)}
            </div>
            <div>
              <h3 className="font-semibold">
                {connectionStatus === 'checking' && 'Tekshirilmoqda...'}
                {connectionStatus === 'connected' && 'Ulanish muvaffaqiyatli!'}
                {connectionStatus === 'error' && 'Ulanish xatosi!'}
              </h3>
              {error && <p className="text-sm mt-1">{error}</p>}
              {serverInfo && (
                <div className="text-sm mt-2">
                  <p>Status: {serverInfo.status}</p>
                  <p>Environment: {serverInfo.environment}</p>
                  <p>Uptime: {Math.round(serverInfo.uptime)}s</p>
                </div>
              )}
            </div>
            <button
              onClick={testConnection}
              className="ml-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Qayta test qilish
            </button>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Test natijalari</h3>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      result.status === 'success'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="mr-3">
                          {result.status === 'success' ? (
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{result.test}</h4>
                          <p className={`text-sm ${
                            result.status === 'success' ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {result.message}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {result.data && (
                      <details className="mt-3">
                        <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
                          Ma'lumotlarni ko'rish
                        </summary>
                        <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-40">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Yo'riqnoma</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>1. Backend serverni ishga tushiring: <code className="bg-blue-100 px-1 rounded">cd my-backend-project && npm start</code></p>
              <p>2. MongoDB serverini ishga tushiring: <code className="bg-blue-100 px-1 rounded">mongod</code></p>
              <p>3. Barcha testlar muvaffaqiyatli o'tgandan so'ng AdminPanel'da savollar bilan ishlashingiz mumkin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestConnection;
