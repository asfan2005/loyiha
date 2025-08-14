import React from 'react';
import { Navigate } from 'react-router-dom';
import { useTest } from '../context/TestContext';

const ProtectedAdminRoute = ({ children }) => {
  const { state } = useTest();
  const { adminLoggedIn } = state;

  return adminLoggedIn ? children : <Navigate to="/admin-login" replace />;
};

export default ProtectedAdminRoute;
