import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const Signup: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('REGULAR');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await authService.signup(name, email, password);
            if (result) {
                navigate('/home');
            } else {
                setError('Erro ao criar conta. Verifique os dados ou tente outro e-mail.');
            }
        } catch (err: any) {
            console.error('Error during handleSignup:', err);
            setError('Ocorreu um erro inesperado ao criar sua conta.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex flex-col lg:flex-row">
            <div className="hidden lg:flex lg:col-span-5 relative flex-1 bg-surface-dark overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000"
                    className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                    alt="Library background"
                />
                <div className="relative z-10 p-12 flex flex-col justify-between h-full text-white">
                    <div className="flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined text-3xl font-bold">auto_stories</span>
                        <span className="text-2xl font-extrabold tracking-tight">Nossa Estante</span>
                    </div>
                    <div>
                        <h2 className="text-5xl font-extrabold leading-tight mb-4">
                            Sua próxima <br /> aventura começa aqui.
                        </h2>
                        <p className="text-xl text-white/80 max-w-md">
                            Junte-se a milhares de leitores e compartilhe histórias que transformam vidas.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Side */}
            <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-[440px] space-y-8 animate-fade-in">
                    <div className="space-y-2 text-center lg:text-left">
                        <h1 className="text-3xl font-extrabold text-text-main dark:text-white">Criar Conta</h1>
                        <p className="text-text-muted dark:text-gray-400 font-medium">Comece a trocar seus livros agora mesmo</p>
                    </div>

                    {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-medium animate-shake">{error}</div>}

                    <form className="space-y-5" onSubmit={handleSignup}>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold dark:text-gray-300">Nome Completo</label>
                            <div className="relative flex items-center">
                                <span className="material-symbols-outlined absolute left-4 text-text-muted">person</span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-0 ring-1 ring-black/10 dark:ring-white/10 bg-white dark:bg-surface-dark focus:ring-2 focus:ring-primary outline-none text-text-main dark:text-white"
                                    placeholder="Como prefere ser chamado?"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold dark:text-gray-300">E-mail</label>
                            <div className="relative flex items-center">
                                <span className="material-symbols-outlined absolute left-4 text-text-muted">mail</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-0 ring-1 ring-black/10 dark:ring-white/10 bg-white dark:bg-surface-dark focus:ring-2 focus:ring-primary outline-none text-text-main dark:text-white"
                                    placeholder="seu@exemplo.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold dark:text-gray-300">Senha</label>
                                <div className="relative flex items-center">
                                    <span className="material-symbols-outlined absolute left-4 text-text-muted">lock</span>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border-0 ring-1 ring-black/10 dark:ring-white/10 bg-white dark:bg-surface-dark focus:ring-2 focus:ring-primary outline-none text-text-main dark:text-white"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold dark:text-gray-300">Tipo de Perfil</label>
                                <div className="relative flex items-center">
                                    <span className="material-symbols-outlined absolute left-4 text-text-muted">badge</span>
                                    <select
                                        value={role}
                                        onChange={e => setRole(e.target.value)}
                                        className="w-full pl-12 pr-10 py-3.5 rounded-xl border-0 ring-1 ring-black/10 dark:ring-white/10 bg-white dark:bg-surface-dark focus:ring-2 focus:ring-primary outline-none text-text-main dark:text-white appearance-none cursor-pointer font-medium"
                                        required
                                    >
                                        <option value="REGULAR">Leitor</option>
                                        <option value="COMPANY">Livraria/Sebo</option>
                                        <option value="CANDIDATE">Estudante</option>
                                    </select>
                                    <span className="material-symbols-outlined absolute right-4 text-text-muted pointer-events-none">expand_more</span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-primary hover:bg-[#0fd651] text-text-main font-bold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'Criando conta...' : 'Criar Conta'}
                        </button>
                    </form>

                    <p className="text-center text-sm font-medium text-text-muted">
                        Já faz parte da comunidade? <Link to="/login" className="text-text-main dark:text-white font-bold hover:underline">Fazer Login</Link>
                    </p>
                </div>
            </main>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
                    20%, 40%, 60%, 80% { transform: translateX(2px); }
                }
                .animate-shake {
                    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
                }
                select {
                    background-image: none !important;
                }
            `}</style>
        </div>
    );
};

export default Signup;
