import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SignupWizard from '../components/auth/SignupWizard';

const Signup: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-[40px] border border-white/60 bg-[linear-gradient(180deg,#fefefe_0%,#f4f8f5_100%)] shadow-[0_35px_100px_rgba(0,0,0,0.24)] p-5 sm:p-6 lg:p-8">
        <Link to="/login" className="flex items-center justify-center gap-3 text-primary mb-8">
          <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl font-bold">auto_stories</span>
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight text-text-main">Nossa Estante</span>
        </Link>

        <SignupWizard
          onSuccess={() => navigate('/home', { replace: true })}
          onSwitchToLogin={() => navigate('/login')}
        />
      </div>
    </div>
  );
};

export default Signup;
