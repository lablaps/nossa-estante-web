
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import Layout from '../components/Layout';
import { User } from '../types';

const InfoItem: React.FC<{ label: string, value: string, icon: string }> = ({ label, value, icon }) => (
    <div className="flex items-center gap-4 p-4 rounded-3xl bg-white dark:bg-surface-dark/50 border border-black/[0.03] dark:border-white/[0.03] shadow-sm">
        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-2xl">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-0.5">{label}</p>
            <p className="font-bold text-lg dark:text-white truncate">
                {value || <span className="text-text-muted font-medium italic">Não informado</span>}
            </p>
        </div>
    </div>
);

const EditField: React.FC<{ label: string, value: string, icon: string, type?: string, placeholder?: string, disabled?: boolean, required?: boolean, onChange?: (val: string) => void }> = ({ label, value, icon, type = "text", placeholder, disabled, required, onChange }) => (
    <div className="space-y-2">
        <label className="text-xs font-black uppercase tracking-wider text-text-muted ml-2">{label}</label>
        <div className={`relative flex items-center group ${disabled ? 'opacity-60' : ''}`}>
            <span className="material-symbols-outlined absolute left-4 text-primary group-focus-within:text-primary-dark">
                {icon}
            </span>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                onChange={(e) => onChange?.(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border-0 bg-[#F8FAF9] dark:bg-background-dark font-bold focus:ring-4 focus:ring-primary/20 outline-none transition-all dark:text-white border border-transparent ${!disabled ? 'focus:border-primary/30 cursor-text' : 'cursor-not-allowed'}`}
            />
        </div>
    </div>
);

const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
                setName(currentUser.name);
                setEmail(currentUser.email);
            }
            setIsLoading(false);
        };
        fetchUser();
    }, [navigate]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            const updatedUser = await authService.updateProfile({
                name,
                email,
                role: user?.role
            });

            if (updatedUser) {
                setUser(updatedUser);
                setIsEditing(false);
                setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ type: 'error', text: 'Erro ao atualizar perfil.' });
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({ type: 'error', text: 'Ocorreu um erro inesperado.' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
        setIsEditing(false);
        setMessage(null);
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </Layout>
        );
    }


    return (
        <Layout>
            <div className="min-h-screen bg-[#F8FAF9] dark:bg-background-dark pb-32">
                <header className="px-6 pt-12 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-4xl mx-auto">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight dark:text-white mb-2">Meu Perfil</h1>
                        <p className="text-text-muted font-medium">Gerencie suas informações de conta</p>
                    </div>
                    {!isEditing && (
                        <button 
                            onClick={() => setIsEditing(true)}
                            className="bg-primary hover:bg-[#0fd651] text-black px-8 py-3.5 rounded-2xl font-black shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 w-full md:w-auto justify-center"
                        >
                            <span className="material-symbols-outlined font-bold text-xl">edit</span>
                            Editar Perfil
                        </button>
                    )}
                </header>

                <main className="px-6">
                    <div className="max-w-4xl mx-auto">
                        {message && (
                            <div className={`mb-8 p-6 rounded-3xl font-bold flex items-center gap-4 animate-fade-in shadow-xl shadow-black/5 ${
                                message.type === 'success' 
                                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-100 dark:border-green-900/40' 
                                : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/40'
                            }`}>
                                <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
                                    message.type === 'success' ? 'bg-green-100 dark:bg-green-800/40' : 'bg-red-100 dark:bg-red-800/40'
                                }`}>
                                    <span className="material-symbols-outlined">
                                        {message.type === 'success' ? 'check_circle' : 'error'}
                                    </span>
                                </div>
                                {message.text}
                            </div>
                        )}

                        {!isEditing ? (
                            /* VIEW MODE */
                            <div className="animate-fade-in space-y-8">
                                <div className="bg-white dark:bg-surface-dark rounded-[40px] p-8 md:p-12 shadow-xl shadow-black/5 border border-black/5 dark:border-white/5 relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>
                                     
                                     <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                                            <div className="size-40 rounded-[48px] bg-primary/20 flex items-center justify-center border-4 border-white dark:border-surface-dark shadow-2xl relative z-10 rotate-3 text-primary text-5xl font-black uppercase">
                                                {user?.name?.charAt(0) || ''}
                                            </div>
                                        </div>
                                        <div className="text-center md:text-left">
                                            <p className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-black text-xs rounded-full mb-3 uppercase tracking-widest">
                                                {user?.role === 'USER' ? 'Leitor' : user?.role}
                                            </p>
                                            <h2 className="text-4xl font-black dark:text-white mb-1">{name}</h2>
                                            <p className="text-text-muted font-bold flex items-center justify-center md:justify-start gap-2">
                                                <span className="material-symbols-outlined text-base">mail</span>
                                                {email}
                                            </p>
                                        </div>
                                     </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem label="ID do Usuário" value={`#${user?.id || ''}`} icon="fingerprint" />
                                    <InfoItem label="E-mail de Contato" value={email} icon="alternate_email" />
                                </div>
                            </div>
                        ) : (
                            /* EDIT MODE */
                            <div className="bg-white dark:bg-surface-dark rounded-[40px] p-8 md:p-12 shadow-2xl shadow-black/10 border border-black/5 dark:border-white/5 relative overflow-hidden animate-fade-in">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none"></div>

                                <form onSubmit={handleSave} className="space-y-10 z-10 relative">
                                    <div className="flex flex-col items-center mb-4">
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                                            <div className="size-32 rounded-full bg-primary/10 flex items-center justify-center border-4 border-white dark:border-surface-dark shadow-2xl relative z-10 text-primary text-4xl font-black uppercase">
                                                {user?.name?.charAt(0) || ''}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <div className="md:col-span-2">
                                            <EditField label="ID do Usuário" value={`#${user?.id || ''}`} icon="fingerprint" disabled />
                                        </div>
                                        <EditField label="Nome Completo" value={name} icon="person" required onChange={setName} />
                                        <EditField label="E-mail" value={email} icon="mail" disabled />
                                        <EditField label="Tipo de Perfil" value={user?.role || ''} icon="category" disabled />
                                    </div>

                                    <div className="pt-6 flex flex-col md:flex-row gap-4">
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            disabled={isSaving}
                                            className="flex-1 py-4 bg-gray-100 dark:bg-background-dark/50 hover:bg-gray-200 dark:hover:bg-background-dark text-text-main dark:text-white font-bold text-lg rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="flex-[2] py-4 bg-primary hover:bg-[#0fd651] text-black font-black text-lg rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <div className="size-5 border-2 border-black/30 border-t-black animate-spin rounded-full"></div>
                                                    Salvando...
                                                </>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined font-bold">save</span>
                                                    Salvar Alterações
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.4s ease-out forwards;
                }
            `}</style>
        </Layout>
    );
};

export default Profile;
