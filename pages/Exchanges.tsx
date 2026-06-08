import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { authService } from '../services/authService';
import { dbService } from '../services/dbService';
import { Book, Trade, User } from '../types';

const statusInfo = (status: string) => {
  switch (status) {
    case 'ANSWERED':
      return { label: 'RESPONDIDA', className: 'bg-sky-300 text-black' };
    case 'ACCEPTED':
      return { label: 'CONCLUÍDA', className: 'bg-green-500 text-black' };
    case 'CANCELLED':
      return { label: 'CANCELADA', className: 'bg-gray-300 text-gray-800' };
    default:
      return { label: 'PENDENTE', className: 'bg-yellow-300 text-black' };
  }
};

const normalizeText = (value?: string) => (value || '').trim().toLowerCase();
const sameValue = (first?: string, second?: string) => !!normalizeText(first) && normalizeText(first) === normalizeText(second);
const isAvailableBook = (book: Book) => normalizeText(book.status) === 'available';

const Exchanges: React.FC = () => {
  const { tradeId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [currentUser, exchangeData, allBooks] = await Promise.all([
        authService.getCurrentUser(),
        dbService.getExchanges(),
        dbService.getBooks(),
      ]);

      let normalizedExchanges = exchangeData;
      if (tradeId) {
        const detail = await dbService.getExchangeById(tradeId);
        normalizedExchanges = exchangeData.some((trade) => trade.id === detail.id)
          ? exchangeData.map((trade) => trade.id === detail.id ? detail : trade)
          : [detail, ...exchangeData];
      }

      setUser(currentUser);
      setTrades(normalizedExchanges);
      setBooks(allBooks);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || 'Erro ao carregar trocas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tradeId]);

  const bookById = useMemo(() => {
    const map = new Map<string, Book>();
    books.forEach((book) => map.set(book.id, book));
    return map;
  }, [books]);

  const isRequester = (trade: Trade) => user?.id === trade.fromUserId;
  const isOwner = (trade: Trade) => user?.id === trade.toUserId;

  const requesterBooks = selectedTrade
    ? books.filter((book) => (
        (
          sameValue(book.ownerId, selectedTrade.fromUserId)
          || sameValue(book.ownerName, selectedTrade.fromUserName)
        )
        && isAvailableBook(book)
        && book.id !== selectedTrade.bookBId
      ))
    : [];

  const runAction = async (trade: Trade, action: () => Promise<Trade>) => {
    setSavingId(trade.id);
    setError('');
    try {
      await action();
      setSelectedTrade(null);
      setSelectedBookId('');
      await loadData();
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || 'Erro ao atualizar troca.');
    } finally {
      setSavingId(null);
    }
  };

  const respondExchange = async () => {
    if (!selectedTrade) return;
    if (!selectedBookId) {
      setError('Selecione um livro para responder.');
      return;
    }
    await runAction(selectedTrade, () => dbService.respondExchange(selectedTrade.id, selectedBookId));
  };

  const acceptExchange = async (trade: Trade) => {
    if (!trade.bookAId) {
      setError('A troca ainda nao possui livro oferecido.');
      return;
    }
    await runAction(trade, () => dbService.acceptExchange(trade.id));
  };

  const cancelExchange = async (trade: Trade) => {
    await runAction(trade, () => dbService.cancelExchange(trade.id));
  };

  const renderAction = (trade: Trade) => {
    const busy = savingId === trade.id;

    if (trade.status === 'ACCEPTED') {
      return <span className="text-xs font-black text-green-600">Troca concluída</span>;
    }

    if (trade.status === 'CANCELLED') {
      return <span className="text-xs font-black text-gray-500">Cancelada</span>;
    }

    if (isOwner(trade) && trade.status === 'PENDING') {
      return (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => setSelectedTrade(trade)}
            className="px-4 py-2 rounded-xl bg-primary text-black text-xs font-black disabled:opacity-50"
          >
            Responder
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => cancelExchange(trade)}
            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-black disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      );
    }

    if (isRequester(trade) && trade.status === 'ANSWERED') {
      return (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => acceptExchange(trade)}
            className="px-4 py-2 rounded-xl bg-green-500 text-black text-xs font-black disabled:opacity-50"
          >
            Aceitar
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => cancelExchange(trade)}
            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-black disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      );
    }

    if (isRequester(trade) && trade.status === 'PENDING') {
      return <span className="text-xs font-black text-yellow-600">Aguardando resposta</span>;
    }

    return <span className="text-xs font-black text-text-muted">Sem ação</span>;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#F8FAF9] dark:bg-background-dark p-6 md:p-12">
        <div className="max-w-[1500px] mx-auto space-y-8">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight dark:text-white">Trocas</h1>
              <p className="text-text-muted font-medium mt-2">Solicitações, respostas e conclusões das suas trocas.</p>
            </div>
            <Link to="/home" className="px-5 py-3 rounded-2xl bg-primary text-black font-black text-sm">
              Ver livros
            </Link>
          </header>

          {error && (
            <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          <div className="bg-white dark:bg-surface-dark rounded-[32px] border border-black/5 dark:border-white/5 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#F8FAF9] dark:bg-background-dark/50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">ID</th>
                    <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Livro solicitado</th>
                    <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Livro oferecido</th>
                    <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Participantes</th>
                    <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Ponto</th>
                    <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {trades.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center text-text-muted font-bold">
                        Nenhuma troca encontrada.
                      </td>
                    </tr>
                  ) : trades.map((trade) => {
                    const status = statusInfo(trade.status);
                    const requestedTitle = trade.bookBTitle || trade.bookTitle || bookById.get(trade.bookBId || trade.bookId)?.title || '-';
                    const offeredTitle = trade.bookATitle || bookById.get(trade.bookAId || '')?.title;

                    return (
                      <tr key={trade.id} className={trade.id === tradeId ? 'bg-primary/5' : ''}>
                        <td className="px-6 py-5 font-black dark:text-white">#{trade.id}</td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex rounded-md px-3 py-1.5 text-xs font-black ${status.className}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="font-bold dark:text-white">{requestedTitle}</div>
                          <Link to={`/livro/${trade.bookBId || trade.bookId}`} className="mt-2 inline-flex text-xs font-bold text-blue-600">
                            Ver livro
                          </Link>
                        </td>
                        <td className="px-6 py-5">
                          {offeredTitle ? (
                            <>
                              <div className="font-bold dark:text-white">{offeredTitle}</div>
                              <Link to={`/livro/${trade.bookAId}`} className="mt-2 inline-flex text-xs font-bold text-blue-600">
                                Ver livro
                              </Link>
                            </>
                          ) : (
                            <span className="text-xs font-black text-yellow-700">Aguardando escolha</span>
                          )}
                        </td>
                        <td className="px-6 py-5 text-sm text-text-muted font-bold">
                          <div>Solicitante: {trade.fromUserName || trade.fromUserId || '-'}</div>
                          <div>Dono: {trade.toUserName || trade.toUserId || '-'}</div>
                        </td>
                        <td className="px-6 py-5 text-sm text-text-muted font-bold">{trade.meetingPoint}</td>
                        <td className="px-6 py-5 text-right">{renderAction(trade)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {selectedTrade && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <button className="absolute inset-0 bg-black/45" onClick={() => setSelectedTrade(null)} />
            <div className="relative z-10 w-full max-w-lg rounded-[32px] bg-white dark:bg-surface-dark p-6 shadow-2xl space-y-5">
              <div>
                <h2 className="text-2xl font-black dark:text-white">Responder troca</h2>
                <p className="text-sm text-text-muted mt-1">Escolha um livro disponível do solicitante.</p>
              </div>

              <div className="max-h-[360px] overflow-y-auto space-y-3 pr-1">
                {requesterBooks.map((book) => (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => setSelectedBookId(book.id)}
                    className={`w-full flex items-center gap-4 rounded-2xl border p-3 text-left ${
                      selectedBookId === book.id ? 'border-primary bg-primary/10' : 'border-black/5 bg-[#F8FAF9]'
                    }`}
                  >
                    <div className="h-20 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
                      {book.coverURL ? (
                        <img src={book.coverURL} alt={book.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-text-muted">
                          <span className="material-symbols-outlined">menu_book</span>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black dark:text-white">{book.title}</p>
                      <p className="mt-1 truncate text-sm text-text-muted">{book.author}</p>
                    </div>
                  </button>
                ))}
              </div>

              {requesterBooks.length === 0 && (
                <p className="rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-700">
                  O solicitante não possui livros disponíveis.
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTrade(null)}
                  className="flex-1 rounded-2xl bg-gray-100 py-4 font-bold"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  disabled={!selectedBookId || savingId === selectedTrade.id}
                  onClick={respondExchange}
                  className="flex-1 rounded-2xl bg-primary py-4 font-black text-black disabled:opacity-50"
                >
                  Responder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Exchanges;
