import React from 'react';
import { Navigate } from 'react-router-dom';

const Signup: React.FC = () => {
  return <Navigate to="/home?auth=signup" replace />;
};

export default Signup;
