import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import Layout from '../components/Layout';
import ReferenceButtons from '../components/ReferenceButtons';
import { Book, User } from '../types';
import MapLibre from '../components/MapLibre';

const BookDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [userData, bookData] = await Promise.all([
          authService.getCurrentUser(),
          dbService.getBookById(id)
        ]);
        setUser(userData);
        setBook(bookData);
      } catch (error) {
        console.error('Error fetching book details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!book) return <div className="p-8 text-center dark:text-white">Livro não encontrado!</div>;

  const handleRedeem = async () => {
    if (!user || !book) return;
    try {
      const tradeId = `trade_${Date.now()}`;
      await dbService.createTrade({
        id: tradeId,
        bookId: book.id,
        fromUserId: book.ownerId,
        toUserId: user.id || '',
        status: 'ongoing',
        meetingPoint: 'Ponto de Segurança: Estação Central',
        qrCodeFake: 'MOCK_QR_CODE'
      });
      navigate(`/chat/${tradeId}`);
    } catch (error) {
      console.error('Error creating trade:', error);
      alert('Erro ao resgatar livro. Tente novamente.');
    }
  };

  return (
    <Layout>
      <ReferenceButtons pngUrl="https://picsum.photos/400/800" />
      <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-32">
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 flex items-center p-4 justify-between bg-white/70 dark:bg-surface-dark/70 backdrop-blur-md border-b border-black/5 dark:border-white/5">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 transition-transform active:scale-95 text-text-main dark:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-full"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 className="text-base font-bold dark:text-white uppercase tracking-widest opacity-60">Detalhes do Livro</h2>
          <button className="p-2 transition-transform active:scale-95 text-text-main dark:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-full">
            <span className="material-symbols-outlined">share</span>
          </button>
        </header>

        <main className="max-w-6xl mx-auto w-full flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 lg:gap-12">
            
            {/* Left Column: Image Hero */}
            <div className="relative group">
              <div className="w-full aspect-[4/5] md:aspect-[3/4] relative flex items-center justify-center overflow-hidden bg-gray-200 dark:bg-surface-dark md:rounded-3xl shadow-2xl">
                {/* Blurred background cover */}
                <div 
                  className="absolute inset-0 scale-110 blur-3xl opacity-30 dark:opacity-20"
                  style={{ 
                    backgroundImage: `url(${book.photos?.[0] || 'https://picsum.photos/seed/book/200/300'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
                
                {/* Main Image */}
                <img 
                  src={book.photos?.[0] || 'https://picsum.photos/seed/book/200/300'} 
                  className="relative z-10 h-[75%] object-contain shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-lg transform transition-transform duration-500 group-hover:scale-105" 
                  alt={book.title} 
                />
                
                {/* Distance Badge */}
                <div className="absolute top-6 right-6 z-20 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-white/20">
                  <span className="text-[10px] font-black text-primary uppercase tracking-tighter flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">location_on</span>
                    {book.distance || 'Prox.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Info */}
            <div className="px-6 py-8 md:py-12 space-y-8">
              <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-extrabold dark:text-white tracking-tight leading-tight">
                  {book.title}
                </h1>
                <p className="text-lg text-primary font-bold flex items-center gap-2">
                  <span className="w-8 h-[2px] bg-primary/30"></span>
                  por {book.author}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 p-5 bg-white dark:bg-surface-dark rounded-3xl border border-black/5 dark:border-white/5 shadow-sm">
                <div className="text-center space-y-1">
                  <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Categoria</p>
                  <p className="text-xs font-black dark:text-white truncate">{book.category}</p>
                </div>
                <div className="text-center space-y-1 border-x border-black/5 dark:border-white/5">
                  <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Idioma</p>
                  <p className="text-xs font-black dark:text-white">{book.language}</p>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Estado</p>
                  <p className="text-xs font-black dark:text-white">{book.material_state}</p>
                </div>
                {book.publisher && (
                  <>
                    <div className="col-span-3 h-[1px] bg-black/5 dark:bg-white/5 my-1"></div>
                    <div className="text-center space-y-1">
                      <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Editora</p>
                      <p className="text-xs font-black dark:text-white truncate">{book.publisher}</p>
                    </div>
                    <div className="text-center space-y-1 border-x border-black/5 dark:border-white/5">
                      <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Páginas</p>
                      <p className="text-xs font-black dark:text-white">{book.pageCount || '-'}</p>
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-[10px] uppercase font-bold text-text-muted tracking-widest">Ano</p>
                      <p className="text-xs font-black dark:text-white">{book.publishedDate || '-'}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Owner Card */}
              <div className="flex items-center justify-between p-4 bg-primary/5 dark:bg-primary/10 rounded-2xl border border-primary/20">
                <div className="flex items-center gap-4">
                  <div className="size-14 bg-white p-1 rounded-full shadow-md">
                    <img 
                      src={book.ownerAvatar || 'https://picsum.photos/seed/owner/200'} 
                      className="w-full h-full rounded-full object-cover" 
                      alt="" 
                    />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-primary/70 tracking-tighter leading-none">Anunciado por</p>
                    <p className="text-lg font-black dark:text-white">{book.ownerName || 'Usuário'}</p>
                  </div>
                </div>
                <button className="size-12 bg-white dark:bg-surface-dark text-primary rounded-xl shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                  <span className="material-symbols-outlined">chat</span>
                </button>
              </div>

              {/* Tabs-like Content Sections */}
              <div className="space-y-8">
                <section className="space-y-3">
                  <h3 className="text-sm font-black dark:text-white uppercase tracking-[0.2em] opacity-40">Sinopse</h3>
                  <p className="text-sm text-text-muted leading-relaxed font-medium bg-white/50 dark:bg-white/5 p-4 rounded-2xl">
                    {book.synopsis || "Este livro ainda não possui uma sinopse detalhada. Explore as páginas para descobrir mais sobre esta obra incrível."}
                  </p>
                </section>

                <section className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black dark:text-white uppercase tracking-[0.2em] opacity-40">Localização</h3>
                    <span className="text-[10px] font-bold text-primary">Ponto de Segurança Disponível</span>
                  </div>
                  <div className="h-48 bg-gray-200 dark:bg-surface-dark rounded-3xl overflow-hidden relative border border-black/5 dark:border-white/5 group shadow-inner">
                    <MapLibre 
                      lat={book.latitude || -23.5505} 
                      lng={book.longitude || -46.6333} 
                    />
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md p-3 rounded-2xl shadow-xl flex items-center gap-3 z-10">
                      <div className="p-2 bg-primary/20 text-primary rounded-lg">
                        <span className="material-symbols-outlined text-sm">shield</span>
                      </div>
                      <p className="text-[11px] font-bold dark:text-white leading-tight">
                        Estação Central de Trocas <br/>
                        <span className="font-normal opacity-60">Seguro para ambos os lados</span>
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>

        {/* Professional Floating Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4 md:pb-8">
          <div className="max-w-2xl mx-auto bg-white/80 dark:bg-surface-dark/80 backdrop-blur-2xl border border-black/5 dark:border-white/10 p-3 md:p-4 rounded-[32px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] flex items-center justify-between">
            <div className="pl-6 flex flex-col">
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest opacity-60">Investimento</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-primary leading-none tracking-tighter">{book.creditsCost}</span>
                <span className="text-xs font-black text-primary opacity-60 uppercase tracking-tighter">Créditos</span>
              </div>
            </div>
            
            <button
              onClick={handleRedeem}
              className="px-10 py-5 bg-primary text-text-main font-black rounded-2xl shadow-lg shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3"
            >
              <span>RESGATAR AGORA</span>
              <span className="material-symbols-outlined text-xl">keyboard_double_arrow_right</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookDetails;
