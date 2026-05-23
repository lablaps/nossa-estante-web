import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import Layout from '../components/Layout';
import { Book, Message, Trade, User } from '../types';

const Chat: React.FC = () => {
  const { tradeId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [activeTrade, setActiveTrade] = useState<Trade | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [currentUser, exchangeData, allBooks, chats] = await Promise.all([
          authService.getCurrentUser(),
          dbService.getTrades(),
          dbService.getBooks(),
          dbService.getChats(),
        ]);

        setUser(currentUser);
        setTrades(exchangeData);
        setBooks(allBooks);

        const trade = exchangeData.find(item => item.id === tradeId) || exchangeData[0] || null;
        setActiveTrade(trade);
        if (trade && !tradeId) {
          navigate(`/chat/${trade.id}`, { replace: true });
        }

        const chat = trade ? chats.find(item => item.tradeId === trade.id) : null;
        setMessages(chat?.messages || []);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tradeId, navigate]);

  const bookById = useMemo(() => {
    const map = new Map<string, Book>();
    books.forEach(book => map.set(book.id, book));
    return map;
  }, [books]);

  const getTradeTitle = (trade: Trade) => {
    const bookId = trade.bookBId || trade.bookId || trade.bookAId;
    return bookById.get(bookId || '')?.title || trade.bookBTitle || trade.bookTitle || trade.bookATitle || `Troca #${trade.id}`;
  };

  const getTradeCover = (trade: Trade) => {
    const bookId = trade.bookBId || trade.bookId || trade.bookAId;
    return bookById.get(bookId || '')?.coverURL;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !user || !activeTrade) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      fromUserId: user.id,
      text: inputText.trim(),
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    await dbService.addMessage(activeTrade.id, newMessage);
    setMessages(current => [...current, newMessage]);
    setInputText('');
  };

  if (loading) {
    return (
      <Layout hideBottomNav>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout hideBottomNav>
      <div className="flex h-screen bg-white dark:bg-background-dark overflow-hidden">
        <aside className={`w-full md:w-[380px] flex flex-col border-r border-black/5 dark:border-white/5 shrink-0 bg-[#F8FAF9] dark:bg-surface-dark ${tradeId ? 'hidden md:flex' : 'flex'}`}>
          <header className="p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black tracking-tight dark:text-white">Chat</h1>
              <Link to="/trocas" className="size-10 bg-white dark:bg-background-dark rounded-xl flex items-center justify-center shadow-sm border border-black/5">
                <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
              </Link>
            </div>
            <p className="text-sm text-text-muted font-medium">Mensagens vinculadas às solicitações de troca.</p>
          </header>

          <div className="flex-1 overflow-y-auto px-4 space-y-2 no-scrollbar pb-10">
            {trades.length === 0 ? (
              <div className="p-10 text-center space-y-4">
                <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  <span className="material-symbols-outlined text-4xl">inbox</span>
                </div>
                <p className="text-sm font-bold text-text-muted">Nenhuma conversa disponível.</p>
              </div>
            ) : trades.map(trade => {
              const isActive = activeTrade?.id === trade.id;
              const cover = getTradeCover(trade);

              return (
                <button
                  key={trade.id}
                  onClick={() => navigate(`/chat/${trade.id}`)}
                  className={`w-full flex gap-4 p-4 rounded-[28px] transition-all text-left ${isActive ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'bg-white dark:bg-background-dark border border-black/5 dark:border-white/5 hover:border-primary/50'}`}
                >
                  <div className="size-14 shrink-0 rounded-2xl overflow-hidden bg-primary/10 flex items-center justify-center">
                    {cover ? (
                      <img src={cover} className="size-full object-cover" alt="" />
                    ) : (
                      <span className="material-symbols-outlined text-primary">menu_book</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-bold text-sm truncate ${isActive ? 'text-black' : 'dark:text-white'}`}>{getTradeTitle(trade)}</h3>
                    <p className={`text-xs truncate mt-1 ${isActive ? 'text-black/70' : 'text-text-muted'}`}>
                      {trade.statusTotal ? 'Troca aceita' : 'Troca em andamento'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className={`flex-1 flex flex-col bg-white dark:bg-background-dark ${!tradeId ? 'hidden md:flex' : 'flex'}`}>
          {activeTrade ? (
            <>
              <header className="h-20 border-b border-black/5 dark:border-white/5 flex items-center px-6 md:px-8 justify-between shrink-0">
                <div className="flex items-center gap-4 min-w-0">
                  <button onClick={() => navigate('/chats')} className="md:hidden p-2 -ml-2">
                    <span className="material-symbols-outlined">arrow_back</span>
                  </button>
                  <div className="min-w-0">
                    <h2 className="font-black text-sm dark:text-white truncate">{getTradeTitle(activeTrade)}</h2>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Troca #{activeTrade.id}</p>
                  </div>
                </div>
                <Link to={`/troca/${activeTrade.id}`} className="px-4 py-2 rounded-xl bg-primary text-black text-xs font-black">
                  Solicitação
                </Link>
              </header>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 no-scrollbar bg-[#FAFAFA] dark:bg-background-dark/50">
                {messages.length === 0 && (
                  <div className="max-w-md mx-auto rounded-[28px] bg-white dark:bg-surface-dark border border-black/5 p-6 text-center">
                    <p className="font-black dark:text-white">Nenhuma mensagem ainda</p>
                    <p className="text-sm text-text-muted mt-2">Use o chat para combinar retirada, WhatsApp ou detalhes da troca.</p>
                  </div>
                )}

                {messages.map(message => (
                  <div key={message.id} className={`flex ${message.fromUserId === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] ${message.fromUserId === user?.id ? 'text-right' : 'text-left'}`}>
                      <div className={`px-5 py-4 rounded-3xl shadow-sm text-sm font-medium ${message.fromUserId === user?.id ? 'bg-primary text-black rounded-tr-none' : 'bg-white dark:bg-surface-dark dark:text-white border border-black/5 rounded-tl-none'}`}>
                        {message.text}
                      </div>
                      <span className="text-[10px] font-bold block mt-2 opacity-60">{message.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 md:p-8 border-t border-black/5 dark:border-white/5">
                <div className="relative">
                  <input
                    type="text"
                    value={inputText}
                    onChange={event => setInputText(event.target.value)}
                    placeholder="Digite uma mensagem..."
                    className="w-full bg-background-light dark:bg-background-dark border-0 rounded-2xl px-6 py-4 pr-16 text-sm font-medium focus:ring-2 focus:ring-primary dark:text-white"
                    onKeyDown={event => event.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 size-10 bg-primary text-black rounded-xl flex items-center justify-center disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined font-bold">send</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-4">
              <h2 className="text-2xl font-black dark:text-white">Chats de Troca</h2>
              <p className="text-text-muted font-medium max-w-xs">Selecione uma conversa para continuar.</p>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Chat;
