import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const ProtectedRoute = ({ children }) => {
  const { currentUser, setError } = useAuth();

  if (!currentUser) {
    setError('you must be signed in to access the Chatbot.')
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
