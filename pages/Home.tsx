import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ReferenceButtons from '../components/ReferenceButtons';
import TutorialOverlay from '../components/TutorialOverlay';
import { User, Book } from '../types';
import { Step } from 'react-joyride';

const TUTORIAL_STEPS: Step[] = [
  {
    target: window.innerWidth > 768 ? '#nav-home' : '#nav-home-mobile',
    title: '🏠 Dashboard Inicial',
    content: 'Aqui você tem uma visão geral dos livros disponíveis, seus créditos e as atividades recentes da comunidade.',
    disableBeacon: true,
    placement: 'right',
  },
  {
    target: window.innerWidth > 768 ? '#nav-explore' : '#nav-explore-mobile',
    title: '🗺️ Exploração no Mapa',
    content: 'Encontre livros disponíveis para troca perto de você usando nosso mapa interativo.',
    placement: 'right',
  },
  {
    target: window.innerWidth > 768 ? '#nav-cadastrar-livro-mobile' : '#nav-cadastrar-livro-mobile', // Central button on mobile
    title: '➕ Adicionar Livro',
    content: 'Compartilhe seus próprios livros com a comunidade. Ao cadastrar um livro, você ganha visibilidade e créditos!',
    placement: 'top',
  },
  {
    target: window.innerWidth > 768 ? '#nav-chats' : '#nav-chats-mobile',
    title: '💬 Conversas',
    content: 'Combine as trocas diretamente com outros leitores através do nosso chat interno.',
    placement: 'right',
  },
  {
    target: window.innerWidth > 768 ? '#nav-minha-estante' : '#nav-minha-estante-mobile',
    title: '📚 Minha Estante',
    content: 'Gerencie seus livros cadastrados, acompanhe suas trocas e organize sua coleção pessoal.',
    placement: 'right',
  },
  {
    target: window.innerWidth > 768 ? '#nav-meu-perfil' : '#nav-meu-perfil-mobile',
    title: '👤 Seu Perfil',
    content: 'Acesse suas configurações, veja sua reputação na comunidade e acompanhe seu histórico.',
    placement: 'right',
  },
];

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, booksData] = await Promise.all([
          authService.getCurrentUser(),
          dbService.getBooks()
        ]);
        setUser(userData);
        setBooks(booksData);
        if (userData?.isFirstAccess) {
          setTimeout(() => setShowTutorial(true), 600);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mock Activity Data (Keep for now unless there's an endpoint)
  const activities = [
    { id: 1, user: 'Ana', action: 'exchanged a book with', target: 'Miguel', time: '15 minutes ago', icon: 'swap_horiz', color: 'bg-green-100 text-green-700' },
    { id: 2, user: 'Lucas', action: 'added 3 new books', target: '', time: '1 hour ago', icon: 'add', color: 'bg-blue-100 text-blue-700' },
    { id: 3, user: 'Sarah', action: 'reviewed', target: 'Dune', time: '2 hours ago', icon: 'star', color: 'bg-yellow-100 text-yellow-700' },
  ];

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

      {showTutorial && (
        <TutorialOverlay
          steps={TUTORIAL_STEPS}
          onFinish={() => {
            setShowTutorial(false);
          }}
        />
      )}

      <div className="min-h-screen bg-[#F8FAF9] dark:bg-background-dark pb-32">
        {/* Header Section */}
        <header className="px-6 pt-8 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={user?.avatar || 'https://picsum.photos/seed/user/200'} className="size-10 rounded-full object-cover border-2 border-white shadow-sm" alt="User" />
              <div>
                <p className="text-xs font-bold text-text-muted">Welcome back,</p>
                <p className="text-sm font-black dark:text-white">{user?.name || 'Reader'}</p>
              </div>
            </div>
            <div id="home-credits" className="bg-primary/10 px-3 py-1.5 rounded-full flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm filled">token</span>
              <span className="text-xs font-black text-primary">{user?.credits || 0} Credits</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black tracking-tight dark:text-white">Nossa Estante</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  authService.logout();
                  window.location.reload();
                }}
                className="p-2 text-text-muted hover:text-red-500 transition-colors"
                title="Logout"
              >
                <span className="material-symbols-outlined">logout</span>
              </button>
              <button className="relative p-2">
                <span className="material-symbols-outlined text-text-main dark:text-white">notifications</span>
                <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white"></span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div id="home-search-bar" className="flex gap-3">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">search</span>
              <input
                type="text"
                placeholder="Search books, authors, or genres"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-0 bg-white dark:bg-surface-dark shadow-sm text-sm font-medium focus:ring-2 focus:ring-primary placeholder:text-black/30"
              />
            </div>
            <button className="bg-white dark:bg-surface-dark p-3.5 rounded-2xl shadow-sm border border-black/5 dark:border-white/5 text-text-muted">
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>

          {/* Categories */}
          <div id="home-categories" className="flex gap-2 overflow-x-auto no-scrollbar pt-2">
            {['Near me', 'Fiction', 'Biographies', 'Sci-Fi', 'Romance', 'Mystery'].map((cat, i) => (
              <button
                key={i}
                className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${i === 0
                  ? 'bg-primary text-black shadow-lg shadow-primary/25'
                  : 'bg-white dark:bg-surface-dark text-text-muted border border-black/5 dark:border-white/5'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* Books Near You */}
        <section id="home-books-near" className="pt-6 space-y-4">
          <div className="px-6 flex items-center justify-between">
            <h2 className="text-lg font-black dark:text-white flex items-center gap-2">
              Books Near You
              <span className="material-symbols-outlined text-primary text-sm filled">location_on</span>
            </h2>
            <Link to="/explore" className="text-xs font-bold text-text-muted hover:text-primary">View All on Map</Link>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-4">
            {books.map((book) => (
              <Link to={`/livro/${book.id}`} key={book.id} className="w-[140px] flex-shrink-0 group">
                <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-lg mb-3 bg-gray-100">
                  <img src={book.photos?.[0] || 'https://picsum.photos/seed/book/200/300'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={book.title} />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-white/10">
                    <span className="text-[10px] font-bold text-white">{book.distance || '0km'}</span>
                  </div>
                </div>
                <h3 className="font-bold text-sm truncate dark:text-white w-full">{book.title}</h3>
                <p className="text-[10px] text-text-muted truncate mb-1 w-full">{book.author}</p>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-green-500 text-[14px] filled">token</span>
                  <span className="text-xs font-black dark:text-white">{book.creditsCost} Credits</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Community Activity */}
        <section id="home-community" className="px-6 pt-4 space-y-4">
          <h2 className="text-lg font-black dark:text-white">Community Activity</h2>
          <div className="space-y-3">
            {activities.map((item) => (
              <div key={item.id} className="bg-white dark:bg-surface-dark p-4 rounded-3xl shadow-sm border border-black/5 dark:border-white/5 flex items-center gap-4">
                <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${item.color}`}>
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm dark:text-white truncate">
                    <span className="font-bold">{item.user}</span> {item.action} <span className="font-bold">{item.target}</span>
                  </p>
                  <p className="text-[10px] text-text-muted font-bold flex items-center gap-1">
                    {item.time} • Nearby
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
