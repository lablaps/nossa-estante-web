import React, { useState } from 'react';
import { authService } from '../../services/authService';

type LoginFormProps = {
  onSuccess: () => void;
  onSwitchToSignup: () => void;
};

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
        setError('Nao foi possivel entrar agora. Tente novamente mais tarde.');
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

      <p className="text-center text-base font-medium text-text-muted">
        Ainda nao tem conta?{' '}
        <button type="button" onClick={onSwitchToSignup} className="text-text-main font-bold hover:underline">
          Criar cadastro
        </button>
      </p>
    </div>
  );
};

export default LoginForm;

