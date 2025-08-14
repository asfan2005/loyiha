import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TestProvider } from './context/TestContext';
import { HomePage, TestPage, ResultPage, AdminLogin, AdminPanel } from './components';
import ProtectedAdminRoute from './components/ProtectedAdminRoute';
import TestConnection from './components/TestConnection';

export default function App() {
  return (
    <TestProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route path="/test" element={<TestPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminPanel />
              </ProtectedAdminRoute>
            } />
            <Route path="/test-connection" element={<TestConnection />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </TestProvider>
  );
}