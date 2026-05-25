import React from 'react';
import { Navigate } from 'react-router-dom';

const Login: React.FC = () => {
  return <Navigate to="/home?auth=login" replace />;
};

export default Login;
