import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import ReferenceButtons from '../components/ReferenceButtons';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.login(email, password);
      if (result) {
        navigate('/home');
      } else {
        setError('E-mail ou senha incorretos.');
      }
    } catch (err) {
      setError('Ocorreu um erro na conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col lg:flex-row">
      <ReferenceButtons pngUrl="https://picsum.photos/400/800" />

      <div className="hidden lg:flex lg:col-span-5 relative flex-1 bg-surface-dark overflow-hidden">
        <img src="https://picsum.photos/seed/library/800/1200" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" alt="" />
        <div className="relative z-10 p-12 flex flex-col justify-between h-full text-white">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-3xl font-bold">auto_stories</span>
            <span className="text-2xl font-extrabold tracking-tight">Nossa Estante</span>
          </div>
          <div>
            <h2 className="text-5xl font-extrabold leading-tight mb-4">Junte-se ao movimento <br /> circular de leitura.</h2>
            <p className="text-xl text-white/80 max-w-md">Conecte-se com sua comunidade e dê uma segunda vida às histórias.</p>
          </div>
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[440px] space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-text-main dark:text-white">Bem-vindo(a)</h1>
            <p className="text-text-muted dark:text-gray-400 font-medium">Entre para continuar trocando livros</p>
          </div>

          {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-medium">{error}</div>}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-semibold dark:text-gray-300">E-mail</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-text-muted">mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-0 ring-1 ring-black/10 dark:ring-white/10 bg-white dark:bg-surface-dark focus:ring-2 focus:ring-primary outline-none text-text-main dark:text-white"
                  placeholder="nome@exemplo.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold dark:text-gray-300">Senha</label>
                <a href="#" className="text-sm font-bold text-text-muted hover:text-primary">Esqueceu?</a>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-text-muted">lock</span>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border-0 ring-1 ring-black/10 dark:ring-white/10 bg-white dark:bg-surface-dark focus:ring-2 focus:ring-primary outline-none text-text-main dark:text-white"
                  placeholder="••••••••"
                  required
                />
                <button type="button" className="absolute right-4 text-text-muted"><span className="material-symbols-outlined">visibility</span></button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary hover:bg-[#0fd651] text-text-main font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <p className="text-center text-sm font-medium text-text-muted">
            Não tem uma conta? <Link to="/signup" className="text-text-main dark:text-white font-bold hover:underline">Cadastre-se</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
