import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dbService } from '../services/dbService';
import { authService } from '../services/authService';
import Layout from '../components/Layout';
import AuthLink from '../components/auth/AuthLink';
import ReferenceButtons from '../components/ReferenceButtons';
import { User, Book } from '../types';

const ShelfField: React.FC<{
  label: string;
  value: string;
  icon: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}> = ({ label, value, icon, disabled, onChange }) => (
  <div className="space-y-2">
    <label className="ml-2 text-xs font-black uppercase tracking-[0.18em] text-text-muted">{label}</label>
    <div className={`relative ${disabled ? 'opacity-70' : ''}`}>
      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">
        {icon}
      </span>
      <input
        value={value}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.value)}
        className="w-full rounded-2xl border border-black/6 bg-[#F8FAF9] py-4 pl-12 pr-4 font-bold outline-none transition focus:border-primary/30 focus:ring-4 focus:ring-primary/15 dark:bg-background-dark dark:text-white"
      />
    </div>
  </div>
);

const MyShelf: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Todos');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        const booksData = currentUser ? await dbService.getMyBooks() : [];

        setUser(currentUser);
        setName(currentUser?.name || '');
        setEmail(currentUser?.email || '');
        setMyBooks(booksData);
      } catch (error) {
        console.error('Error fetching shelf data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const updatedUser = await authService.updateProfile({
        name,
        email,
        role: user?.role
      });

      if (updatedUser) {
        setUser(updatedUser);
        setName(updatedUser.name);
        setEmail(updatedUser.email);
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Dados atualizados com sucesso.' });
      } else {
        setMessage({ type: 'error', text: 'Ainda não foi possível atualizar os dados por aqui.' });
      }
    } catch (error) {
      console.error('Error updating profile from shelf:', error);
      setMessage({ type: 'error', text: 'Ocorreu um erro ao salvar suas alterações.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setIsEditing(false);
    setMessage(null);
  };

  const filteredBooks =
    filter === 'Todos'
      ? myBooks
      : myBooks.filter((book) => book.status === (filter === 'Disponíveis' ? 'Available' : 'In Exchange'));

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <ReferenceButtons pngUrl="https://picsum.photos/400/800" />

        <div className="flex min-h-screen items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-5xl rounded-[40px] border border-black/6 bg-white p-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)] md:p-12">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_360px] lg:items-center">
              <div className="space-y-6">
                <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-primary">
                  Minha Estante
                </span>

                <div className="space-y-4">
                  <h1 className="max-w-2xl text-4xl font-black leading-[0.95] tracking-tight text-text-main md:text-5xl">
                    Entre para abrir sua estante pessoal
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-text-muted">
                    Aqui você vai organizar seus livros, editar seus dados de cadastro, acompanhar trocas e montar sua coleção dentro da comunidade.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <AuthLink
                    mode="login"
                    className="inline-flex h-14 items-center justify-center rounded-2xl bg-primary px-8 text-sm font-black text-black shadow-[0_14px_35px_rgba(19,236,91,0.24)] transition hover:brightness-95"
                  >
                    Entrar no sistema
                  </AuthLink>
                  <AuthLink
                    mode="signup"
                    className="inline-flex h-14 items-center justify-center rounded-2xl border border-black/8 bg-white px-8 text-sm font-black text-text-main transition hover:bg-[#F6F8F7]"
                  >
                    Criar conta
                  </AuthLink>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: 'menu_book',
                    title: 'Sua coleção em um só lugar',
                    text: 'Adicione livros, acompanhe disponibilidade e monte sua estante pessoal.'
                  },
                  {
                    icon: 'swap_horiz',
                    title: 'Trocas e conversas organizadas',
                    text: 'Gerencie interesses, pedidos e interacoes com outros leitores.'
                  },
                  {
                    icon: 'badge',
                    title: 'Cadastro e perfil no mesmo fluxo',
                    text: 'Atualize seus dados sem precisar navegar por páginas duplicadas.'
                  }
                ].map((item) => (
                  <div key={item.title} className="rounded-[28px] border border-black/6 bg-[#F8FAF9] p-5">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <h2 className="text-lg font-black text-text-main">{item.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-text-muted">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ReferenceButtons pngUrl="https://picsum.photos/400/800" />

      <div className="space-y-10 p-6 md:p-12">
        <header className="space-y-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-black tracking-tight dark:text-white">Minha Estante</h1>
              <p className="font-medium text-text-muted">
                Gerencie seus livros e seus dados em um único lugar.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {user && !isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-black/8 bg-white px-6 py-4 font-black text-text-main shadow-sm transition hover:-translate-y-0.5"
                >
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                  Editar cadastro
                </button>
              )}

              <Link
                to="/cadastrar-livro"
                className="flex items-center justify-center gap-3 rounded-2xl bg-black px-8 py-4 font-bold text-white shadow-2xl transition-all hover:-translate-y-1 dark:bg-primary dark:text-black"
              >
                <span className="material-symbols-outlined font-bold">add</span>
                Cadastrar Novo Livro
              </Link>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_420px]">
            <div className="rounded-[32px] border border-black/5 bg-white p-8 shadow-sm dark:border-white/5 dark:bg-surface-dark">
              {!isEditing ? (
                <div className="flex flex-col gap-8 md:flex-row md:items-center">
                  <div className="relative">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-primary/20 text-3xl font-black uppercase text-primary shadow-xl dark:border-surface-dark">
                      {user.name?.charAt(0) || ''}
                    </div>
                    <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-white bg-primary text-black dark:border-surface-dark">
                      <span className="material-symbols-outlined text-[18px] filled">verified</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <h2 className="text-2xl font-black dark:text-white">{user.name}</h2>
                      <p className="mt-1 text-sm font-bold text-text-muted">{user.email}</p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl bg-[#F8FAF9] p-4 dark:bg-background-dark">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-text-muted">Tipo de perfil</p>
                        <p className="mt-2 text-lg font-black dark:text-white">
                          {user.role === 'USER' ? 'Leitor' : user.role || 'Leitor'}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-[#F8FAF9] p-4 dark:bg-background-dark">
                        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-text-muted">ID da conta</p>
                        <p className="mt-2 text-lg font-black dark:text-white">#{user.id || '0'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    <ShelfField label="Nome completo" value={name} icon="person" onChange={setName} />
                    <ShelfField label="E-mail" value={email} icon="mail" disabled />
                    <ShelfField
                      label="Tipo de perfil"
                      value={user.role === 'USER' ? 'Leitor' : user.role || 'Leitor'}
                      icon="category"
                      disabled
                    />
                    <ShelfField label="ID da conta" value={`#${user.id || '0'}`} icon="fingerprint" disabled />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="flex-1 rounded-2xl bg-[#F3F6F4] px-6 py-4 font-bold text-text-main transition hover:bg-[#e9efea] disabled:opacity-60 dark:bg-background-dark dark:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex flex-[1.3] items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-4 font-black text-black shadow-lg shadow-primary/20 transition hover:brightness-95 disabled:opacity-60"
                    >
                      {isSaving ? 'Salvando...' : 'Salvar alterações'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:grid-cols-1">
              {[
                { label: 'Total na Coleção', val: myBooks.length, icon: 'auto_stories', color: 'bg-blue-500' },
                { label: 'Livros Disponíveis', val: myBooks.filter((book) => book.status === 'Available').length, icon: 'check_circle', color: 'bg-primary' },
                { label: 'Em Troca', val: myBooks.filter((book) => book.status === 'In Exchange').length, icon: 'swap_horiz', color: 'bg-amber-500' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-5 rounded-3xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-surface-dark">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg ${stat.color}`}>
                    <span className="material-symbols-outlined filled">{stat.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-text-muted">{stat.label}</p>
                    <p className="text-2xl font-black dark:text-white">{stat.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {message && (
            <div
              className={`rounded-3xl p-5 font-bold shadow-sm ${
                message.type === 'success'
                  ? 'border border-green-100 bg-green-50 text-green-700'
                  : 'border border-red-100 bg-red-50 text-red-700'
              }`}
            >
              {message.text}
            </div>
          )}
        </header>

        <section className="space-y-8">
          <div className="flex items-center gap-4 overflow-x-auto border-b border-black/5 pb-1 no-scrollbar dark:border-white/5">
            {['Todos', 'Disponíveis', 'Em Troca'].map((currentFilter) => (
              <button
                key={currentFilter}
                onClick={() => setFilter(currentFilter)}
                className={`relative px-2 pb-4 text-sm font-bold transition-all ${
                  filter === currentFilter
                    ? 'text-primary'
                    : 'text-text-muted hover:text-text-main dark:hover:text-white'
                }`}
              >
                {currentFilter}
                {filter === currentFilter && <div className="absolute bottom-0 left-0 right-0 h-1 rounded-t-full bg-primary"></div>}
              </button>
            ))}
          </div>

          {filteredBooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[40px] border-2 border-dashed border-black/5 bg-white py-20 dark:border-white/10 dark:bg-surface-dark">
              <span className="material-symbols-outlined mb-4 text-6xl text-text-muted/30">import_contacts</span>
              <p className="font-bold text-text-muted">Nenhum livro encontrado nesta categoria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredBooks.map((book) => (
                <div key={book.id} className="group cursor-pointer">
                  <div className="relative mb-4 aspect-[2/3] overflow-hidden rounded-3xl bg-gray-100 shadow-xl ring-1 ring-black/5 transition-all duration-500 group-hover:-translate-y-2 dark:bg-surface-dark">
                    {book.coverURL ? (
                      <img src={book.coverURL} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200 opacity-40 dark:bg-white/5">
                        <span className="material-symbols-outlined text-5xl">book</span>
                      </div>
                    )}
                    <div
                      className={`absolute left-4 top-4 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg ${
                        book.status === 'Available' ? 'bg-primary text-black' : 'bg-amber-400 text-amber-950'
                      }`}
                    >
                      {book.status === 'Available' ? 'Disponível' : 'Em Troca'}
                    </div>
                  </div>
                  <div className="px-2">
                    <h3 className="truncate text-base font-bold dark:text-white">{book.title}</h3>
                    <p className="mb-3 text-sm font-medium text-text-muted">{book.author}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default MyShelf;
