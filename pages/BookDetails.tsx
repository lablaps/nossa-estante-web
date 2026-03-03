
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import Layout from '../components/Layout';
import ReferenceButtons from '../components/ReferenceButtons';

const BookDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const book = dbService.getBooks().find(b => b.id === id);

  if (!book) return <div>Livro não encontrado!</div>;

  const handleRedeem = () => {
    if (!user) return;
    const tradeId = `trade_${Date.now()}`;
    dbService.createTrade({
      id: tradeId,
      bookId: book.id,
      fromUserId: book.ownerId,
      toUserId: user.id,
      status: 'ongoing',
      meetingPoint: 'Ponto de Segurança: Estação Central',
      qrCodeFake: 'MOCK_QR_CODE'
    });
    navigate(`/chat/${tradeId}`);
  };

  return (
    <Layout>
      <ReferenceButtons pngUrl="https://picsum.photos/400/800" />
      <div className="flex flex-col h-full bg-background-light dark:bg-background-dark pb-24">
        <header className="sticky top-0 z-10 flex items-center p-4 justify-between bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm">
          <button onClick={() => navigate(-1)} className="p-2"><span className="material-symbols-outlined">arrow_back</span></button>
          <h2 className="text-lg font-bold dark:text-white">Detalhes do Livro</h2>
          <button className="p-2"><span className="material-symbols-outlined">share</span></button>
        </header>

        <div className="w-full h-80 relative flex items-center justify-center bg-gray-100 dark:bg-surface-dark">
          <img src={book.photos[0]} className="h-64 shadow-2xl rounded-lg" alt="" />
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
              <div className="size-12 bg-gray-200 rounded-full"></div>
              <div>
                <p className="text-xs text-text-muted">Dono(a)</p>
                <p className="font-bold dark:text-white">Maria Silva</p>
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
              <div className="absolute bg-white px-2 py-1 rounded text-[10px] font-bold shadow-sm">a {book.distance} de você</div>
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
