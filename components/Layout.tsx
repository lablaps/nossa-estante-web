
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { User } from '../types';

const Layout: React.FC<{ children: React.ReactNode; hideBottomNav?: boolean }> = ({ children, hideBottomNav }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Just sync the user state, don't perform navigation here.
    // Navigation is handled by PrivateRoute or specific page logic.
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/home', icon: 'home', label: 'Home' },
    { path: '/explore', icon: 'map', label: 'Explore' },
    { path: '/cadastrar-livro', icon: 'add', label: 'Add Book' }, // Placeholder for logic
    { path: '/chats', icon: 'chat_bubble', label: 'Chats' },
    { path: '/minha-estante', icon: 'auto_stories', label: 'Minha Estante' },
    { path: '/meu-perfil', icon: 'person', label: 'Meu Perfil' },
  ];

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-[#F8FAF9] dark:bg-background-dark text-text-main transition-colors duration-300">
      {/* Sidebar Desktop (unchanged generally, but keeping simple for now) */}
      <aside className="hidden md:flex flex-col w-[280px] bg-white dark:bg-surface-dark border-r border-black/5 dark:border-white/5 shrink-0 sticky top-0 h-screen z-50">
        <div className="p-8">
          <Link to="/home" className="flex items-center gap-3 text-primary group">
            <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-2xl font-bold">auto_stories</span>
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-text-main dark:text-white">Nossa Estante</span>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {navItems.filter(i => i.path !== '/cadastrar-livro').map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all
                ${isActive
                  ? 'bg-primary text-black shadow-lg shadow-primary/20'
                  : 'text-text-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-text-main dark:hover:text-white'}
              `}
            >
              <span className={`material-symbols-outlined text-[22px] ${location.pathname === item.path ? 'filled' : ''}`}>{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all text-text-muted hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/10 dark:hover:text-red-400 mt-auto mb-6"
          >
            <span className="material-symbols-outlined text-[22px]">logout</span>
            <span className="text-sm">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto no-scrollbar relative">
        <div className={`flex-1 ${!hideBottomNav ? 'pb-24 md:pb-0' : ''}`}>
          {children}
        </div>

        {/* Bottom Nav Mobile - Redesigned */}
        {!hideBottomNav && (
          <nav className="md:hidden fixed bottom-6 left-6 right-6 bg-white dark:bg-surface-dark rounded-[24px] shadow-2xl shadow-black/10 border border-black/5 dark:border-white/10 px-6 py-3 flex justify-between items-center z-[100] safe-area-bottom">

            <NavLink to="/home" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-text-muted'}`}>
              <span className={`material-symbols-outlined text-[26px] ${location.pathname === '/home' ? 'filled' : ''}`}>home</span>
              <span className="text-[10px] font-bold">Home</span>
            </NavLink>

            <NavLink to="/explore" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-text-muted'}`}>
              <span className={`material-symbols-outlined text-[26px] ${location.pathname === '/explore' ? 'filled' : ''}`}>map</span>
              <span className="text-[10px] font-bold">Explore</span>
            </NavLink>

            <NavLink to="/cadastrar-livro" className="relative -top-8 group">
              <div className="size-14 bg-primary rounded-full flex items-center justify-center shadow-xl shadow-primary/40 active:scale-95 transition-transform border-[4px] border-[#F8FAF9] dark:border-background-dark">
                <span className="material-symbols-outlined text-white text-[28px] font-bold">add</span>
              </div>
            </NavLink>

            <NavLink to="/chats" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-text-muted'}`}>
              <span className={`material-symbols-outlined text-[26px] ${location.pathname === '/chats' ? 'filled' : ''}`}>chat_bubble</span>
              <span className="text-[10px] font-bold">Chats</span>
            </NavLink>

            <NavLink to="/minha-estante" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-text-muted'}`}>
              <span className={`material-symbols-outlined text-[26px] ${location.pathname === '/minha-estante' ? 'filled' : ''}`}>auto_stories</span>
              <span className="text-[10px] font-bold">Minha Estante</span>
            </NavLink>

            <NavLink to="/meu-perfil" className={({ isActive }) => `flex flex-col items-center gap-1 ${isActive ? 'text-primary' : 'text-text-muted'}`}>
              <span className={`material-symbols-outlined text-[26px] ${location.pathname === '/meu-perfil' ? 'filled' : ''}`}>person</span>
              <span className="text-[10px] font-bold">Meu Perfil</span>
            </NavLink>

          </nav>
        )}
      </main>
    </div>
  );
};

export default Layout;