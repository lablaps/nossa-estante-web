import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import ReferenceButtons from '../components/ReferenceButtons';
import { User, Book } from '../types';

const MyShelf: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        const booksData = await dbService.getMyBooks();
        setUser(currentUser);
        setMyBooks(booksData);
      } catch (error) {
        console.error('Error fetching shelf data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredBooks = filter === 'Todos' ? myBooks : myBooks.filter(b => b.status === (filter === 'Disponíveis' ? 'Available' : 'In Exchange'));

  if (loading) {
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
      <ReferenceButtons pngUrl="https://picsum.photos/400/800" />
      <div className="p-6 md:p-12 space-y-12">
        <header className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tight dark:text-white">Minha Estante</h1>
              <p className="text-text-muted font-medium">Gerencie sua coleção pessoal e acompanhe suas trocas.</p>
            </div>
            <Link to="/cadastrar-livro" className="px-8 py-4 bg-black dark:bg-primary text-white dark:text-black font-bold rounded-2xl flex items-center justify-center gap-3 shadow-2xl hover:-translate-y-1 transition-all">
              <span className="material-symbols-outlined font-bold">add</span>
              Cadastrar Novo Livro
            </Link>
          </div>

          {/* User Profile Card */}
          <div className="bg-white dark:bg-surface-dark p-8 rounded-[32px] border border-black/5 dark:border-white/5 shadow-sm flex flex-col md:flex-row items-center gap-8 group">
            <div className="relative">
              <img
                src={user?.avatar || 'https://picsum.photos/seed/user/200'}
                className="size-24 rounded-full object-cover border-4 border-primary/20 p-1 group-hover:scale-105 transition-transform"
                alt="Profile"
              />
              <div className="absolute -bottom-1 -right-1 size-8 bg-primary rounded-xl flex items-center justify-center text-black border-2 border-white dark:border-surface-dark">
                <span className="material-symbols-outlined text-[18px] filled">verified</span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left space-y-1">
              <h2 className="text-2xl font-black dark:text-white">{user?.name}</h2>
              <p className="text-text-muted font-bold text-sm">{user?.email}</p>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-3">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#F0FDF4] text-[#166534] rounded-full text-xs font-black">
                  <span className="material-symbols-outlined text-sm filled">star</span>
                  {user?.reputation || '5.0'} Reputação
                </div>
                <div className="text-text-muted text-xs font-bold">•</div>
                <div className="text-text-muted text-xs font-bold">Membro desde 2024</div>
              </div>
            </div>
            <div className="h-12 w-px bg-black/5 dark:bg-white/5 hidden md:block" />
            <div className="text-center md:text-right">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Saldo Atual</p>
              <div className="flex items-center gap-2 text-primary">
                <span className="text-3xl font-black">{user?.credits || 0}</span>
                <span className="material-symbols-outlined text-3xl filled">token</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Mini Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total na Comunidade', val: myBooks.length, icon: 'auto_stories', color: 'bg-blue-500' },
            { label: 'Livros Disponíveis', val: myBooks.filter(b => b.status === 'Available').length, icon: 'check_circle', color: 'bg-primary' },
            { label: 'Em Troca', val: myBooks.filter(b => b.status === 'In Exchange').length, icon: 'swap_horiz', color: 'bg-amber-500' },
            { label: 'Créditos Ganhos', val: 12, icon: 'token', color: 'bg-emerald-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-surface-dark p-6 rounded-3xl border border-black/5 dark:border-white/5 shadow-sm flex items-center gap-5">
              <div className={`size-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                <span className="material-symbols-outlined filled">{stat.icon}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-text-muted uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-black dark:text-white">{stat.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Grid */}
        <div className="space-y-8">
          <div className="flex items-center gap-4 border-b border-black/5 dark:border-white/5 pb-1 overflow-x-auto no-scrollbar">
            {['Todos', 'Disponíveis', 'Em Troca'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`pb-4 px-2 text-sm font-bold transition-all relative ${filter === f ? 'text-primary' : 'text-text-muted hover:text-text-main dark:hover:text-white'}`}
              >
                {f}
                {filter === f && <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full"></div>}
              </button>
            ))}
          </div>

          {filteredBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-surface-dark rounded-[40px] border-2 border-dashed border-black/5 dark:border-white/10">
              <span className="material-symbols-outlined text-6xl text-text-muted/30 mb-4">import_contacts</span>
              <p className="text-text-muted font-bold">Nenhum livro encontrado nesta categoria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {filteredBooks.map(book => (
                <div key={book.id} className="group cursor-pointer">
                  <div className="relative aspect-[2/3] rounded-3xl overflow-hidden shadow-xl mb-4 group-hover:-translate-y-2 transition-all duration-500 ring-1 ring-black/5">
                    <img src={book.photos[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg ${book.status === 'Available' ? 'bg-primary text-black' : 'bg-amber-400 text-amber-950'
                      }`}>
                      {book.status === 'Available' ? 'Disponível' : 'Em Troca'}
                    </div>
                  </div>
                  <div className="px-2">
                    <h3 className="font-bold text-base dark:text-white truncate">{book.title}</h3>
                    <p className="text-sm text-text-muted font-medium mb-3">{book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyShelf;
