import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import SignupWizard from '../components/auth/SignupWizard';

const Signup: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-screen bg-background-light px-4 py-8 dark:bg-background-dark">
        <div className="mx-auto max-w-4xl">
          <SignupWizard
            onSuccess={() => navigate('/login', { replace: true })}
            onSwitchToLogin={() => navigate('/login')}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
