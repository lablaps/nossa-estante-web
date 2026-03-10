
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import Layout from '../components/Layout';
import { Message, Trade, Book, User } from '../types';
import ReferenceButtons from '../components/ReferenceButtons';

const Chat: React.FC = () => {
  const { tradeId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [activeTrade, setActiveTrade] = useState<Trade | null>(null);
  const [activeBook, setActiveBook] = useState<Book | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);

        const trades = await dbService.getTrades();
        setAllTrades(trades);

        const t = trades.find(tr => tr.id === tradeId) || trades[0];
        if (t) {
          setActiveTrade(t);
          const books = await dbService.getBooks();
          setActiveBook(books.find(b => b.id === t.bookId) || null);

          const chats = await dbService.getChats();
          const chat = chats.find(c => c.tradeId === t.id);
          if (chat) setMessages(chat.messages);
        }
      } catch (error) {
        console.error('Error fetching chat data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tradeId]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !user || !activeTrade) return;
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      fromUserId: user.id,
      text: inputText,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    try {
      await dbService.addMessage(activeTrade.id, newMessage);
      setMessages([...messages, newMessage]);
      setInputText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Layout hideBottomNav>
      <ReferenceButtons pngUrl="https://picsum.photos/400/800" />
      <div className="flex h-screen bg-white dark:bg-background-dark overflow-hidden">

        {/* Lado Esquerdo: Lista de Conversas */}
        <div className={`w-full md:w-[380px] flex flex-col border-r border-black/5 dark:border-white/5 shrink-0 bg-[#F8FAF9] dark:bg-surface-dark transition-all ${tradeId ? 'hidden md:flex' : 'flex'}`}>
          <header className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black tracking-tight dark:text-white">Mensagens</h1>
              <button className="size-10 bg-white dark:bg-background-dark rounded-xl flex items-center justify-center shadow-sm border border-black/5">
                <span className="material-symbols-outlined text-[20px]">edit_note</span>
              </button>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm">search</span>
              <input
                type="text"
                placeholder="Buscar conversas..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border-0 ring-1 ring-black/5 dark:ring-white/10 bg-white dark:bg-background-dark text-xs font-bold"
              />
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-4 space-y-2 no-scrollbar pb-10">
            {allTrades.length === 0 ? (
              <div className="p-10 text-center space-y-4">
                <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  <span className="material-symbols-outlined text-4xl">inbox</span>
                </div>
                <p className="text-sm font-bold text-text-muted">Nenhuma troca ativa ainda.</p>
              </div>
            ) : (
              allTrades.map((t) => {
                const b = allBooks.find(book => book.id === t.bookId);
                const isActive = activeTrade?.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => navigate(`/chat/${t.id}`)}
                    className={`w-full flex gap-4 p-4 rounded-[28px] transition-all text-left ${isActive ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'bg-white dark:bg-background-dark border border-black/5 dark:border-white/5 hover:border-primary/50'}`}
                  >
                    <div className="relative size-14 shrink-0">
                      <img src={b?.photos[0]} className="size-full object-cover rounded-2xl shadow-md" alt="" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-0.5">
                        <h3 className={`font-bold text-sm truncate ${isActive ? 'text-black' : 'dark:text-white'}`}>{b?.title}</h3>
                      </div>
                      <p className={`text-xs truncate ${isActive ? 'text-black/70' : 'text-text-muted'}`}>
                        {t.status === 'ongoing' ? 'Troca em progresso...' : 'Finalizada'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Lado Direito: Chat Ativo */}
        <div className={`flex-1 flex flex-col bg-white dark:bg-background-dark transition-all ${!tradeId ? 'hidden md:flex' : 'flex'}`}>
          {activeTrade && activeBook ? (
            <>
              <header className="h-20 border-b border-black/5 dark:border-white/5 flex items-center px-8 justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <button onClick={() => navigate('/chats')} className="md:hidden p-2 -ml-2"><span className="material-symbols-outlined">arrow_back</span></button>
                  <div className="flex items-center gap-3">
                    <img src={activeBook.photos[0]} className="size-10 rounded-xl object-cover" alt="" />
                    <div>
                      <h2 className="font-black text-sm dark:text-white tracking-tight">{activeBook.title}</h2>
                      <div className="flex items-center gap-2">
                        <span className="size-2 bg-primary rounded-full animate-pulse"></span>
                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Troca Ativa</span>
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar bg-[#FAFAFA] dark:bg-background-dark/50">
                <div className="max-w-md mx-auto bg-white dark:bg-surface-dark p-6 rounded-[32px] shadow-sm border border-black/5 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined filled">verified_user</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm dark:text-white">Protocolo de Troca</h4>
                      <p className="text-xs text-text-muted">Ponto de encontro estabelecido.</p>
                    </div>
                  </div>
                  <div className="bg-background-light dark:bg-background-dark p-4 rounded-2xl space-y-2">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-wider">Localização</p>
                    <p className="text-sm font-bold dark:text-white flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">location_on</span>
                      {activeTrade.meetingPoint}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.fromUserId === user?.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] group relative ${msg.fromUserId === user?.id ? 'text-right' : 'text-left'}`}>
                        <div className={`px-6 py-4 rounded-3xl shadow-sm text-sm font-medium ${msg.fromUserId === user?.id
                          ? 'bg-primary text-black rounded-tr-none'
                          : 'bg-white dark:bg-surface-dark dark:text-white border border-black/5 rounded-tl-none'
                          }`}>
                          <p>{msg.text}</p>
                        </div>
                        <span className={`text-[10px] font-bold block mt-2 opacity-60`}>{msg.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 border-t border-black/5 dark:border-white/5 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      placeholder="Digite uma mensagem..."
                      className="w-full bg-background-light dark:bg-background-dark border-0 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary dark:text-white"
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputText.trim()}
                      className="absolute right-3 top-1/2 -translate-y-1/2 size-10 bg-primary text-black rounded-xl flex items-center justify-center disabled:opacity-50 transition-all"
                    >
                      <span className="material-symbols-outlined font-bold">send</span>
                    </button>
                  </div>
                </div>

                <div className="hidden md:grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-black/5 dark:border-white/10 rounded-2xl text-text-muted hover:border-primary/50 hover:text-primary transition-all">
                    <span className="material-symbols-outlined">qr_code</span>
                    <span className="text-xs font-bold uppercase tracking-widest">Gerar QR da Troca</span>
                  </button>
                  <button className="flex items-center justify-center gap-3 p-4 bg-primary text-black rounded-2xl shadow-lg">
                    <span className="material-symbols-outlined font-bold">qr_code_scanner</span>
                    <span className="text-xs font-bold uppercase tracking-widest">Escanear Participante</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center space-y-6">
              <h2 className="text-2xl font-black dark:text-white">Suas Conversas</h2>
              <p className="text-text-muted font-medium max-w-xs mx-auto">Selecione uma conversa ao lado para gerenciar suas trocas de livros.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
