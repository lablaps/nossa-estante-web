import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import Layout from '../components/Layout';
import ReferenceButtons from '../components/ReferenceButtons';
import { Book, User } from '../types';

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
      <div className="flex flex-col h-full bg-background-light dark:bg-background-dark pb-24">
        <header className="sticky top-0 z-10 flex items-center p-4 justify-between bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm">
          <button onClick={() => navigate(-1)} className="p-2 dark:text-white"><span className="material-symbols-outlined">arrow_back</span></button>
          <h2 className="text-lg font-bold dark:text-white">Detalhes do Livro</h2>
          <button className="p-2 dark:text-white"><span className="material-symbols-outlined">share</span></button>
        </header>

        <div className="w-full h-80 relative flex items-center justify-center bg-gray-100 dark:bg-surface-dark">
          <img src={book.photos?.[0] || 'https://picsum.photos/seed/book/200/300'} className="h-64 shadow-2xl rounded-lg" alt="" />
        </div>

        <div className="px-5 pt-6 space-y-4">
          <div>
            <h1 className="text-3xl font-extrabold dark:text-white">{book.title}</h1>
            <p className="text-primary font-bold">por {book.author}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">{book.category}</span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">{book.language}</span>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">{book.material_state}</span>
          </div>

          <div className="border-y border-black/5 dark:border-white/10 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 bg-gray-200 rounded-full overflow-hidden">
                <img src={book.ownerAvatar || 'https://picsum.photos/seed/owner/200'} alt="" />
              </div>
              <div>
                <p className="text-xs text-text-muted">Dono(a)</p>
                <p className="font-bold dark:text-white">{book.ownerName || 'Carregando...'}</p>
              </div>
            </div>
            <button className="p-2 text-primary"><span className="material-symbols-outlined">chat</span></button>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold dark:text-white">Sinopse</h3>
            <p className="text-sm text-text-muted leading-relaxed">{book.synopsis}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold dark:text-white">Localização Aproximada</h3>
            <div className="h-32 bg-gray-200 dark:bg-surface-dark rounded-xl flex items-center justify-center relative overflow-hidden">
              <img src="https://picsum.photos/seed/map_loc/600/200" className="w-full h-full object-cover opacity-50" alt="" />
              <div className="absolute bg-white px-2 py-1 rounded text-[10px] font-bold shadow-sm">a {book.distance || '0km'} de você</div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t p-4 flex items-center justify-between z-50">
          <div className="flex flex-col">
            <span className="text-xs text-text-muted font-medium">Custo Total</span>
            <span className="text-2xl font-black text-primary">{book.creditsCost} Créditos</span>
          </div>
          <button
            onClick={handleRedeem}
            className="px-8 py-4 bg-primary text-text-main font-extrabold rounded-2xl shadow-lg shadow-primary/30 flex items-center gap-2"
          >
            Resgatar Livro
            <span className="material-symbols-outlined">shopping_bag</span>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default BookDetails;
