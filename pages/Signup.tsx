import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const Signup: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = { name, email, password_raw: password, role };
            const result = await authService.signup(data);
            if (result) {
                navigate('/home');
            }
        } catch (err: any) {
            console.error('Error during handleSignup:', err);
            if (err.response?.status === 409) {
                setError('Este e-mail já está em uso. Tente outro ou faça login.');
            } else {
                setError('Ocorreu um erro inesperado ao criar sua conta.');
            }
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
                <div className="w-full max-w-[640px] space-y-12 animate-fade-in">
                    <div className="space-y-4 text-center">
                        <h1 className="text-5xl font-extrabold text-text-main dark:text-white">Criar Conta</h1>
                        <p className="text-text-muted dark:text-gray-400 font-medium text-2xl">Comece a trocar seus livros agora mesmo</p>
                    </div>

                    {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-medium animate-shake text-center">{error}</div>}

                    <form className="space-y-6" onSubmit={handleSignup}>
                        <div className="space-y-3 w-full max-w-[560px] mx-auto">
                            <label className="text-lg font-semibold dark:text-gray-300 ml-2">Nome Completo</label>
                            <div className="relative flex items-center">
                                <span className="material-symbols-outlined absolute left-6 text-primary text-3xl">person</span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full pl-16 pr-6 py-6 rounded-3xl border-0 ring-2 ring-black/5 dark:ring-white/5 bg-white dark:bg-surface-dark shadow-md focus:ring-4 focus:ring-primary outline-none text-2xl text-text-main dark:text-white transition-all"
                                    placeholder="Como prefere ser chamado?"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3 w-full max-w-[560px] mx-auto">
                            <label className="text-lg font-semibold dark:text-gray-300 ml-2">E-mail</label>
                            <div className="relative flex items-center">
                                <span className="material-symbols-outlined absolute left-6 text-primary text-3xl">mail</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full pl-16 pr-6 py-6 rounded-3xl border-0 ring-2 ring-black/5 dark:ring-white/5 bg-white dark:bg-surface-dark shadow-md focus:ring-4 focus:ring-primary outline-none text-2xl text-text-main dark:text-white transition-all"
                                    placeholder="seu@exemplo.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3 w-full max-w-[560px] mx-auto">
                            <label className="text-lg font-semibold dark:text-gray-300 ml-2">Senha</label>
                            <div className="relative flex items-center">
                                <span className="material-symbols-outlined absolute left-6 text-primary text-3xl">lock</span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full pl-16 pr-6 py-6 rounded-3xl border-0 ring-2 ring-black/5 dark:ring-white/5 bg-white dark:bg-surface-dark shadow-md focus:ring-4 focus:ring-primary outline-none text-2xl text-text-main dark:text-white transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3 w-full max-w-[560px] mx-auto">
                            <label className="text-lg font-semibold dark:text-gray-300 ml-2">Tipo de Perfil</label>
                            <div className="relative flex items-center">
                                <span className="material-symbols-outlined absolute left-6 text-primary text-3xl">badge</span>
                                <select
                                    value={role}
                                    onChange={e => setRole(e.target.value)}
                                    className="w-full pl-16 pr-14 py-6 rounded-3xl border-0 ring-2 ring-black/5 dark:ring-white/5 bg-white dark:bg-surface-dark shadow-md focus:ring-4 focus:ring-primary outline-none text-2xl text-text-main dark:text-white appearance-none cursor-pointer font-medium transition-all"
                                    required
                                >
                                    <option value="USER">Leitor</option>
                                    <option value="ADMIN">Administrador</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-4 text-text-muted pointer-events-none">expand_more</span>
                            </div>
                        </div>
                        
                        <div className="w-full max-w-[560px] mx-auto pt-8 flex justify-center">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-6 bg-primary hover:bg-[#0fd651] text-text-main font-extrabold text-2xl rounded-3xl shadow-xl shadow-primary/20 transition-all hover:translate-y-[-4px] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {isLoading ? 'Criando conta...' : 'Concluir Cadastro'}
                            </button>
                        </div>
                    </form>

                    <p className="text-center text-xl font-medium text-text-muted mt-8">
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
