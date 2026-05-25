import React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import LoginForm from './LoginForm';
import SignupWizard from './SignupWizard';
import { AuthMode } from './authModalUtils';

const AuthModal: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const mode = searchParams.get('auth') as AuthMode | null;

  if (mode !== 'login' && mode !== 'signup') {
    return null;
  }

  const closeModal = () => {
    const params = new URLSearchParams(location.search);
    params.delete('auth');
    const query = params.toString();
    navigate(`${location.pathname}${query ? `?${query}` : ''}`, { replace: true });
  };

  const switchMode = (nextMode: AuthMode) => {
    const params = new URLSearchParams(location.search);
    params.set('auth', nextMode);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const handleAuthSuccess = () => {
    window.location.href = location.pathname;
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <button
        type="button"
        aria-label="Fechar autenticação"
        onClick={closeModal}
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
      />

      <div className="relative z-10 w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-[40px] border border-white/60 bg-[linear-gradient(180deg,#fefefe_0%,#f4f8f5_100%)] shadow-[0_35px_100px_rgba(0,0,0,0.24)] p-5 sm:p-6 lg:p-8">
        <div className="flex justify-end pb-2">
          <button
            type="button"
            onClick={closeModal}
            className="size-11 rounded-full bg-white text-text-muted shadow-sm border border-black/5 hover:text-text-main transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {mode === 'login' ? (
          <LoginForm onSuccess={handleAuthSuccess} onSwitchToSignup={() => switchMode('signup')} />
        ) : (
          <SignupWizard onSuccess={handleAuthSuccess} onSwitchToLogin={() => switchMode('login')} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;
