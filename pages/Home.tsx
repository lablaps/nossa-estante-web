import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ReferenceButtons from '../components/ReferenceButtons';
import { User, Book } from '../types';

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, booksData] = await Promise.all([
          authService.getCurrentUser(),
          dbService.getBooks()
        ]);
        setUser(userData);
        setBooks(booksData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Simplified activity data
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

      <div className="min-h-screen bg-[#F8FAF9] dark:bg-background-dark pb-32">
        {/* Header Section */}
        <header className="px-6 pt-8 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-primary font-black uppercase text-xs">
                {user?.name?.charAt(0) || ''}
              </div>
              <div>
                <p className="text-xs font-bold text-text-muted">Bem-vindo(a),</p>
                <p className="text-sm font-black dark:text-white">{user?.name || ''}</p>
              </div>
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
                title="Sair"
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
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">search</span>
              <input
                type="text"
                placeholder="Buscar livros, autores ou gêneros..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-0 bg-white dark:bg-surface-dark shadow-sm text-sm font-medium focus:ring-2 focus:ring-primary placeholder:text-black/30 outline-none"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pt-2">
            {['Perto de mim', 'Ficção', 'Biografias', 'Sci-Fi', 'Romance', 'Mistério'].map((cat, i) => (
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
        <section className="pt-6 space-y-4">
          <div className="px-6 flex items-center justify-between">
            <h2 className="text-lg font-black dark:text-white flex items-center gap-2">
              Livros Perto de Você
              <span className="material-symbols-outlined text-primary text-sm filled">location_on</span>
            </h2>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 pb-4">
            {books.length > 0 ? (
              books.map((book) => (
                <Link to={`/livro/${book.id}`} key={book.id} className="w-[140px] flex-shrink-0 group">
                  <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-lg mb-3 bg-gray-100 dark:bg-surface-dark">
                    {book.coverURL ? (
                      <img src={book.coverURL} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={book.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-white/5">
                        <span className="material-symbols-outlined text-4xl text-text-muted">book</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-sm truncate dark:text-white w-full">{book.title}</h3>
                  <p className="text-[10px] text-text-muted truncate mb-1 w-full">{book.author}</p>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-green-500 text-[14px] filled">token</span>
                    <span className="text-xs font-black dark:text-white">{book.cost} Pontos</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="w-full px-6 py-8 text-center bg-white dark:bg-surface-dark rounded-3xl border border-black/5 dark:border-white/5">
                <p className="text-text-muted font-medium">Nenhum livro disponível no momento.</p>
              </div>
            )}
          </div>
        </section>

        {/* Community Activity - Placeholder as backend doesn't support this yet */}
        <section className="px-6 pt-4 space-y-4">
          <h2 className="text-lg font-black dark:text-white">Atividade da Comunidade</h2>
          <div className="p-8 text-center bg-white dark:bg-surface-dark rounded-3xl border border-black/5 dark:border-white/5">
            <span className="material-symbols-outlined text-4xl text-text-muted mb-2">history</span>
            <p className="text-text-muted font-medium">Fique por dentro das trocas mais recentes em breve.</p>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
