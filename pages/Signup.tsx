import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';

const Signup: React.FC = () => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('REGULAR');
    const [cpf, setCpf] = useState('');
    const [phone, setPhone] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(prev => prev + 1);
    };

    const handleBackStep = () => {
        setStep(prev => prev - 1);
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = { name, email, password_raw: password, role, cpf, phone, birthDate, address };
            const result = await authService.signup(data);
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
                <div className="w-full max-w-[640px] space-y-12 animate-fade-in">
                    <div className="space-y-4 text-center">
                        <h1 className="text-5xl font-extrabold text-text-main dark:text-white">Criar Conta</h1>
                        <p className="text-text-muted dark:text-gray-400 font-medium text-2xl">Comece a trocar seus livros agora mesmo</p>
                    </div>

                    {error && <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm font-medium animate-shake">{error}</div>}

                    <form className="space-y-5" onSubmit={step < 3 ? handleNextStep : handleSignup}>
                        <div className="w-full flex flex-col items-center mb-12">
                            <div className="flex items-center justify-between w-3/4 relative z-0 mb-8 mt-4">
                                <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 -z-10 rounded-full"></div>
                                <div className="absolute top-1/2 left-0 h-2 bg-primary -translate-y-1/2 -z-10 transition-all duration-500 rounded-full" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
                                
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-300 ${step >= 1 ? 'bg-primary text-text-main ring-8 ring-primary/20 scale-110' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>1</div>
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-300 ${step >= 2 ? 'bg-primary text-text-main ring-8 ring-primary/20 scale-110' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>2</div>
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-300 ${step >= 3 ? 'bg-primary text-text-main ring-8 ring-primary/20 scale-110' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>3</div>
                            </div>
                            <h3 className="text-2xl font-extrabold tracking-widest text-text-main dark:text-white uppercase transition-all duration-300">
                                {step === 1 ? 'Dados de Conta' : step === 2 ? 'Informações Pessoais' : 'Contato & Endereço'}
                            </h3>
                        </div>

                        {step === 1 && (
                            <div className="space-y-5 animate-fade-in flex flex-col items-center">
                                <div className="space-y-3 w-full max-w-[560px]">
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

                                <div className="space-y-3 w-full max-w-[560px]">
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

                                <div className="space-y-3 w-full max-w-[560px]">
                                    <label className="text-lg font-semibold dark:text-gray-300 ml-2">Tipo de Perfil</label>
                                    <div className="relative flex items-center">
                                        <span className="material-symbols-outlined absolute left-6 text-primary text-3xl">badge</span>
                                        <select
                                            value={role}
                                            onChange={e => setRole(e.target.value)}
                                            className="w-full pl-16 pr-14 py-6 rounded-3xl border-0 ring-2 ring-black/5 dark:ring-white/5 bg-white dark:bg-surface-dark shadow-md focus:ring-4 focus:ring-primary outline-none text-2xl text-text-main dark:text-white appearance-none cursor-pointer font-medium transition-all"
                                            required
                                        >
                                            <option value="REGULAR">Leitor</option>
                                            <option value="COMPANY">Livraria/Sebo</option>
                                            <option value="CANDIDATE">Estudante</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-4 text-text-muted pointer-events-none">expand_more</span>
                                    </div>
                                </div>
                                
                                <div className="w-full max-w-[560px] pt-8 flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-14 py-6 bg-primary hover:bg-[#0fd651] text-text-main font-extrabold text-2xl rounded-3xl shadow-xl shadow-primary/20 transition-all hover:translate-x-2 active:scale-[0.98] flex items-center justify-center gap-3"
                                    >
                                        Próximo <span className="material-symbols-outlined text-3xl">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-5 animate-fade-in flex flex-col items-center">
                                <div className="space-y-3 w-full max-w-[560px]">
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

                                <div className="space-y-3 w-full max-w-[560px]">
                                    <label className="text-lg font-semibold dark:text-gray-300 ml-2">CPF</label>
                                    <div className="relative flex items-center">
                                        <span className="material-symbols-outlined absolute left-6 text-primary text-3xl">badge</span>
                                        <input
                                            type="text"
                                            value={cpf}
                                            onChange={e => setCpf(e.target.value)}
                                            className="w-full pl-16 pr-6 py-6 rounded-3xl border-0 ring-2 ring-black/5 dark:ring-white/5 bg-white dark:bg-surface-dark shadow-md focus:ring-4 focus:ring-primary outline-none text-2xl text-text-main dark:text-white transition-all"
                                            placeholder="Somente números"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-3 w-full max-w-[560px]">
                                    <label className="text-lg font-semibold dark:text-gray-300 ml-2">Data de Nascimento</label>
                                    <div className="relative flex items-center">
                                        <span className="material-symbols-outlined absolute left-6 text-primary text-3xl">calendar_today</span>
                                        <input
                                            type="date"
                                            value={birthDate}
                                            onChange={e => setBirthDate(e.target.value)}
                                            className="w-full pl-16 pr-6 py-6 rounded-3xl border-0 ring-2 ring-black/5 dark:ring-white/5 bg-white dark:bg-surface-dark shadow-md focus:ring-4 focus:ring-primary outline-none text-2xl text-text-main dark:text-white transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="w-full max-w-[560px] pt-8 flex justify-end gap-6">
                                    <button
                                        type="button"
                                        onClick={handleBackStep}
                                        className="flex-1 py-6 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-text-main dark:text-white font-bold text-xl rounded-3xl transition-all active:scale-[0.98] flex justify-center items-center gap-3"
                                    >
                                        <span className="material-symbols-outlined text-2xl">arrow_back</span> Voltar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-[2] py-6 bg-primary hover:bg-[#0fd651] text-text-main font-extrabold text-2xl rounded-3xl shadow-xl shadow-primary/20 transition-all hover:translate-x-2 active:scale-[0.98] flex items-center justify-center gap-3"
                                    >
                                        Próximo <span className="material-symbols-outlined text-3xl">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-5 animate-fade-in flex flex-col items-center">
                                <div className="space-y-3 w-full max-w-[560px]">
                                    <label className="text-lg font-semibold dark:text-gray-300 ml-2">Telefone</label>
                                    <div className="relative flex items-center">
                                        <span className="material-symbols-outlined absolute left-6 text-primary text-3xl">phone</span>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            className="w-full pl-16 pr-6 py-6 rounded-3xl border-0 ring-2 ring-black/5 dark:ring-white/5 bg-white dark:bg-surface-dark shadow-md focus:ring-4 focus:ring-primary outline-none text-2xl text-text-main dark:text-white transition-all"
                                            placeholder="(11) 99999-9999"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-3 w-full max-w-[560px]">
                                    <label className="text-lg font-semibold dark:text-gray-300 ml-2">Endereço</label>
                                    <div className="relative flex items-center">
                                        <span className="material-symbols-outlined absolute left-6 text-primary text-3xl">home</span>
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={e => setAddress(e.target.value)}
                                            className="w-full pl-16 pr-6 py-6 rounded-3xl border-0 ring-2 ring-black/5 dark:ring-white/5 bg-white dark:bg-surface-dark shadow-md focus:ring-4 focus:ring-primary outline-none text-2xl text-text-main dark:text-white transition-all"
                                            placeholder="Rua ABC, 123"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-6 pt-8 w-full max-w-[560px]">
                                    <button
                                        type="button"
                                        onClick={handleBackStep}
                                        className="flex-1 py-6 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-text-main dark:text-white font-bold text-xl rounded-3xl transition-all active:scale-[0.98] flex justify-center items-center gap-3"
                                    >
                                        <span className="material-symbols-outlined text-2xl">arrow_back</span> Voltar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-[2] py-6 bg-primary hover:bg-[#0fd651] text-text-main font-extrabold text-2xl rounded-3xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                                    >
                                        {isLoading ? 'Criando...' : 'Concluir'}
                                    </button>
                                </div>
                            </div>
                        )}
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
