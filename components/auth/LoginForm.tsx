import React, { useState } from 'react';
import { authService } from '../../services/authService';

type LoginFormProps = {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
};

const SOCIAL_BUTTONS = [
  {
    label: 'Facebook',
    className: 'bg-[#1877F2] text-white',
    icon: <span className="text-xl font-black leading-none">f</span>,
  },
  {
    label: 'Gmail',
    className: 'bg-white text-[#202124] ring-1 ring-black/5',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path fill="#EA4335" d="M24 12.27c0-.82-.07-1.6-.2-2.36H12v4.47h6.76a5.78 5.78 0 0 1-2.5 3.79v3.14h4.04c2.37-2.19 3.7-5.42 3.7-9.04Z" />
        <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.95-2.89l-4.04-3.14c-1.12.75-2.56 1.19-3.91 1.19-3 0-5.54-2.03-6.45-4.75H1.38v3.24A12 12 0 0 0 12 24Z" />
        <path fill="#4A90E2" d="M5.55 14.41A7.2 7.2 0 0 1 5.19 12c0-.84.14-1.65.36-2.41V6.35H1.38A12 12 0 0 0 0 12c0 1.94.46 3.77 1.38 5.65l4.17-3.24Z" />
        <path fill="#FBBC05" d="M12 4.77c1.77 0 3.35.61 4.6 1.81l3.45-3.45C17.95 1.15 15.24 0 12 0A12 12 0 0 0 1.38 6.35l4.17 3.24C6.46 6.8 9 4.77 12 4.77Z" />
      </svg>
    ),
  },
];

const SocialButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  className: string;
}> = ({ label, icon, className }) => (
  <button
    type="button"
    className={`w-full flex items-center justify-center gap-3 rounded-3xl px-5 py-4 font-bold text-base shadow-sm transition-all hover:-translate-y-0.5 ${className}`}
  >
    <span className="flex items-center justify-center">{icon}</span>
    <span>Continuar com {label}</span>
  </button>
);

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.login(email, password);
      if (result) {
        onSuccess();
      }
    } catch (err: any) {
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('O servidor demorou demais para responder. Tente novamente em instantes.');
      } else if (err.response?.status === 401) {
        setError('E-mail ou senha incorretos.');
      } else {
        setError('Não foi possível entrar agora. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3 text-center">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-primary">Entrar</p>
        <h2 className="text-4xl font-extrabold text-text-main">Continue sua jornada de leitura</h2>
        <p className="text-text-muted font-medium text-base max-w-xl mx-auto">
          Acesse sua conta para publicar livros, acompanhar trocas e personalizar sua estante.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleLogin}>
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-[0.18em] text-text-muted ml-2">E-mail</label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-5 text-primary text-2xl">mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-14 pr-5 py-5 rounded-[28px] border-0 ring-1 ring-black/5 bg-[#F8FAF9] shadow-sm focus:ring-4 focus:ring-primary/20 outline-none text-lg text-text-main transition-all"
              placeholder="nome@exemplo.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between mx-2">
            <label className="text-sm font-black uppercase tracking-[0.18em] text-text-muted">Senha</label>
            <button type="button" className="text-sm font-bold text-text-muted hover:text-primary transition-colors">
              Esqueceu?
            </button>
          </div>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-5 text-primary text-2xl">lock</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-14 pr-5 py-5 rounded-[28px] border-0 ring-1 ring-black/5 bg-[#F8FAF9] shadow-sm focus:ring-4 focus:ring-primary/20 outline-none text-lg text-text-main transition-all"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-primary hover:bg-[#0fd651] text-text-main font-extrabold text-lg rounded-[28px] shadow-xl shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="space-y-3">
        {SOCIAL_BUTTONS.map((button) => (
          <SocialButton key={button.label} {...button} />
        ))}
      </div>

      <p className="text-center text-base font-medium text-text-muted">
        Ainda não tem conta?{' '}
        <button type="button" onClick={onSwitchToSignup} className="text-text-main font-bold hover:underline">
          Criar cadastro
        </button>
      </p>
    </div>
  );
};

export default LoginForm;
