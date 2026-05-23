import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { authService } from '../services/authService';
import { dbService } from '../services/dbService';
import { Book, Trade, User } from '../types';

const statusInfo = (trade: Trade) => {
  if (trade.statusTotal || (trade.statusA && trade.statusB)) {
    return { label: 'ACEITO', className: 'bg-green-500 text-black' };
  }

  if (trade.statusB && !trade.statusA) {
    return { label: 'AGUARDANDO ACEITE', className: 'bg-sky-300 text-black' };
  }

  return { label: 'AGUARDANDO RESPOSTA', className: 'bg-yellow-300 text-black' };
};

const ExchangeRequests: React.FC = () => {
  const { tradeId } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [currentUser, exchangeData, allBooks, ownBooks] = await Promise.all([
        authService.getCurrentUser(),
        dbService.getTrades(),
        dbService.getBooks(),
        dbService.getMyBooks(),
      ]);

      let normalizedExchanges = exchangeData;
      if (tradeId) {
        try {
          const detail = await dbService.getTradeById(tradeId);
          normalizedExchanges = exchangeData.some((trade) => trade.id === detail.id)
            ? exchangeData.map((trade) => trade.id === detail.id ? detail : trade)
            : [detail, ...exchangeData];
        } catch (error) {
          console.error('Erro ao buscar detalhe da troca:', error);
        }
      }

      setUser(currentUser);
      setTrades(normalizedExchanges);
      setBooks(allBooks);
      setMyBooks(ownBooks);

      if (tradeId) {
        const highlighted = normalizedExchanges.find((trade) => trade.id === tradeId);
        if (highlighted) setSelectedTrade(highlighted);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tradeId]);

  const bookById = useMemo(() => {
    const map = new Map<string, Book>();
    [...books, ...myBooks].forEach((book) => map.set(book.id, book));
    return map;
  }, [books, myBooks]);

  const getBookTitle = (id?: string, fallback?: string) => {
    if (!id) return fallback || '-';
    return bookById.get(id)?.title || fallback || `Livro #${id}`;
  };

  const renderBookCell = (id?: string, fallback?: string, emptyLabel = 'Ainda não escolhido') => {
    if (!id && !fallback) {
      return (
        <div className="inline-flex items-center gap-2 rounded-2xl bg-yellow-50 px-3 py-2 text-xs font-black text-yellow-700">
          <span className="material-symbols-outlined text-[16px]">hourglass_empty</span>
          {emptyLabel}
        </div>
      );
    }

    return (
      <>
        <div className="font-bold dark:text-white">{getBookTitle(id, fallback)}</div>
        <div className="mt-2 flex items-center gap-2">
          {id && <span className="text-xs text-text-muted font-bold">ID {id}</span>}
          {id && (
            <Link to={`/livro/${id}`} className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">visibility</span>
            </Link>
          )}
        </div>
      </>
    );
  };

  const getRequesterBooks = (trade: Trade) => {
    const requestedId = trade.bookBId || trade.bookId;
    return books.filter((book) => {
      const sameOwnerById = trade.fromUserId && book.ownerId === trade.fromUserId;
      const sameOwnerByName = trade.fromUserName && book.ownerName === trade.fromUserName;
      return book.id !== requestedId && (sameOwnerById || sameOwnerByName);
    });
  };

  const openChooseBook = (trade: Trade) => {
    setSelectedTrade(trade);
  };

  const isRequester = (trade: Trade) => {
    if (!user) return false;
    return trade.fromUserId === user.id || trade.fromUserName === user.name;
  };

  const isOwner = (trade: Trade) => {
    if (!user) return false;
    return trade.toUserId === user.id || trade.toUserName === user.name;
  };

  const getWhatsappHref = (phone?: string) => {
    const cleanPhone = phone?.replace(/\D/g, '');
    return cleanPhone ? `https://wa.me/${cleanPhone}` : '';
  };

  const chooseRequesterBook = async (trade: Trade, bookAId: string) => {
    const finalBookBId = trade.bookBId || trade.bookId;

    if (!bookAId || !finalBookBId) {
      alert('Selecione os dois livros da troca.');
      return;
    }

    setSavingId(trade.id);
    try {
      await dbService.updateTrade(trade.id, {
        status_a: Boolean(trade.statusA),
        status_b: true,
        book_a_id: Number(bookAId),
        book_b_id: Number(finalBookBId),
      });
      setSelectedTrade(null);
      await loadData();
    } catch (error) {
      console.error('Erro ao atualizar troca:', error);
      alert('Erro ao atualizar troca.');
    } finally {
      setSavingId(null);
    }
  };

  const requesterAccept = async (trade: Trade) => {
    setSavingId(trade.id);
    try {
      const finalBookBId = trade.bookBId || trade.bookId;

      if (!trade.bookAId || !finalBookBId) {
        alert('Aguarde o outro usuário escolher um livro antes de aceitar.');
        return;
      }

      await dbService.updateTrade(trade.id, {
        status_a: true,
        status_b: true,
        book_a_id: Number(trade.bookAId),
        book_b_id: Number(finalBookBId),
      });

      await loadData();
    } catch (error) {
      console.error('Erro ao aceitar troca:', error);
      alert('Erro ao aceitar troca.');
    } finally {
      setSavingId(null);
    }
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
        <div className="max-w-6xl mx-auto space-y-8">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight dark:text-white">Solicitações de Trocas</h1>
              <p className="text-text-muted font-medium mt-2">
                Quem solicita escolhe um livro. O dono responde escolhendo um livro do solicitante. A troca conclui quando os dois aceitam.
              </p>
            </div>
            <Link to="/home" className="px-5 py-3 rounded-2xl bg-primary text-black font-black text-sm">
              Ver livros
            </Link>
            <Link to="/chats" className="px-5 py-3 rounded-2xl bg-white border border-black/5 text-text-main font-black text-sm">
              Abrir chat
            </Link>
          </header>

          <div className="bg-white dark:bg-surface-dark rounded-[32px] border border-black/5 dark:border-white/5 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#F8FAF9] dark:bg-background-dark/50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">ID</th>
                    <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Livro solicitado</th>
                    <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Livro escolhido</th>
                    <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Participantes</th>
                    <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest">Chat</th>
                    <th className="px-6 py-4 text-[10px] font-black text-text-muted uppercase tracking-widest text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {trades.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-16 text-center text-text-muted font-bold">
                        Nenhuma solicitação de troca encontrada.
                      </td>
                    </tr>
                  ) : trades.map((trade) => {
                    const status = statusInfo(trade);
                    const requestedId = trade.bookBId || trade.bookId;
                    const selectedRequesterBookId = trade.bookAId;

                    return (
                      <tr key={trade.id} className={trade.id === tradeId ? 'bg-primary/5' : ''}>
                        <td className="px-6 py-5 font-black dark:text-white">#{trade.id}</td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex rounded-md px-3 py-1.5 text-xs font-black ${status.className}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="font-bold dark:text-white">{getBookTitle(requestedId, trade.bookBTitle || trade.bookTitle)}</div>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-text-muted font-bold">ID {requestedId || '-'}</span>
                            {requestedId && (
                              <Link to={`/livro/${requestedId}`} className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                              </Link>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {renderBookCell(selectedRequesterBookId, trade.bookATitle, 'Aguardando resposta')}
                        </td>
                        <td className="px-6 py-5 text-sm text-text-muted font-bold">
                          <div>De: {trade.fromUserName || trade.fromUserId || '-'}</div>
                          <div>Para: {trade.toUserName || trade.toUserId || '-'}</div>
                        </td>
                        <td className="px-6 py-5">
                          <Link to={`/chat/${trade.id}`} className="size-9 rounded-full bg-primary/15 text-primary flex items-center justify-center">
                            <span className="material-symbols-outlined text-[18px]">chat</span>
                          </Link>
                        </td>
                        <td className="px-6 py-5 text-right">
                          {trade.statusTotal || (trade.statusA && trade.statusB) ? (
                            <div className="flex flex-col items-end gap-2">
                              <span className="text-xs font-black text-green-600">TROCA CONCLUÍDA</span>
                              <div className="flex flex-wrap justify-end gap-2">
                                {[
                                  { label: trade.fromUserName || 'User A', phone: trade.fromUserPhone },
                                  { label: trade.toUserName || 'User B', phone: trade.toUserPhone },
                                ].map((contact) => {
                                  const href = getWhatsappHref(contact.phone);
                                  return href ? (
                                    <a key={contact.label} href={href} target="_blank" rel="noreferrer" className="rounded-xl bg-green-100 px-3 py-1.5 text-[10px] font-black text-green-700">
                                      WhatsApp {contact.label}
                                    </a>
                                  ) : (
                                    <span key={contact.label} className="rounded-xl bg-gray-100 px-3 py-1.5 text-[10px] font-black text-text-muted">
                                      Sem telefone {contact.label}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          ) : isRequester(trade) && trade.statusB && !trade.statusA ? (
                            <button
                              type="button"
                              disabled={savingId === trade.id}
                              onClick={() => requesterAccept(trade)}
                              className="px-4 py-2 rounded-xl bg-green-500 text-black text-xs font-black disabled:opacity-50"
                            >
                              ACEITAR
                            </button>
                          ) : isRequester(trade) ? (
                            <span className="text-xs font-black text-yellow-600">AGUARDANDO</span>
                          ) : isOwner(trade) ? (
                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => openChooseBook(trade)}
                                className="px-4 py-2 rounded-xl bg-primary text-black text-xs font-black"
                              >
                                RESPONDER
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs font-black text-text-muted">SEM AÇÃO</span>
                          )}
                        </td>
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
                <h2 className="text-2xl font-black dark:text-white">Livros da pessoa solicitante</h2>
                <p className="text-sm text-text-muted mt-1">
                  Escolha o livro do User A que você deseja receber como réplica.
                </p>
              </div>

              <div className="max-h-[360px] overflow-y-auto space-y-3 pr-1">
                {getRequesterBooks(selectedTrade).map((book) => (
                  <div key={book.id} className="flex items-center gap-4 rounded-2xl border border-black/5 bg-[#F8FAF9] p-3">
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
                      <p className="mt-2 text-xs font-bold text-text-muted">ID {book.id}</p>
                    </div>
                    <button
                      type="button"
                      disabled={savingId === selectedTrade.id}
                      onClick={() => chooseRequesterBook(selectedTrade, book.id)}
                      className="rounded-xl bg-primary px-4 py-2 text-xs font-black text-black disabled:opacity-50"
                    >
                      Quero
                    </button>
                  </div>
                ))}
              </div>

              {getRequesterBooks(selectedTrade).length === 0 && (
                <p className="rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-700">
                  Não encontramos livros cadastrados para essa pessoa. Use o chat para combinar antes de responder.
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTrade(null)}
                  className="flex-1 rounded-2xl bg-gray-100 py-4 font-bold"
                >
                  Cancelar
                </button>
                <Link
                  to={`/chat/${selectedTrade.id}`}
                  className="flex-1 rounded-2xl bg-primary py-4 font-black text-black text-center"
                >
                  Conversar no chat
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ExchangeRequests;
