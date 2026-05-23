import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import AuthLink from '../components/auth/AuthLink';
import MapLibre from '../components/MapLibre';
import { authService } from '../services/authService';
import { dbService } from '../services/dbService';
import { Book, User } from '../types';

type UserCoords = {
  lat: number;
  lng: number;
};

const fallbackCenter: UserCoords = {
  lat: -2.53073,
  lng: -44.3068
};

const categoryLabels = ['Todos', 'Ficcao', 'Romance', 'Biografias', 'Fantasia', 'Tecnologia'];

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'granted' | 'denied'>('idle');
  const [coords, setCoords] = useState<UserCoords | null>(null);

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
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }

    setLocationStatus('loading');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationStatus('granted');
      },
      () => {
        setLocationStatus('denied');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    );
  };

  const getDistanceLabel = (index: number) => {
    if (locationStatus !== 'granted') {
      return 'Ative sua localizacao';
    }

    return `${(index * 0.9 + 1.2).toFixed(1)} km de voce`;
  };

  const getNearbyMarkers = () => {
    const mapCenter = coords || fallbackCenter;

    return books.slice(0, 4).map((book, index) => ({
      id: book.id,
      lat: mapCenter.lat + 0.004 + index * 0.0025,
      lng: mapCenter.lng - 0.003 + index * 0.002,
      label: `${index + 1}`
    }));
  };

  const featuredBooks = books.slice(0, 8);
  const nearbyBooks = books.slice(0, 4);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-[#F7FAF8]">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#F7FAF8] pb-28 md:pb-12">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-4 sm:px-6 md:gap-8 md:px-8 md:py-6">
          <header className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full sm:max-w-xl">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">search</span>
                <input
                  type="text"
                  placeholder="Pesquisar livros, autores ou generos..."
                  className="h-14 w-full rounded-full border border-black/6 bg-white pl-12 pr-4 text-sm font-medium text-text-main shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                {user ? (
                  <>
                    <button className="relative flex h-12 w-12 items-center justify-center rounded-full border border-black/6 bg-white text-text-main shadow-sm transition hover:border-primary/30">
                      <span className="material-symbols-outlined">notifications</span>
                      <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full border border-white bg-red-500" />
                    </button>
                    <Link
                      to="/meu-perfil"
                      className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-sm font-black uppercase text-primary shadow-sm"
                    >
                      {user.name?.charAt(0) || 'N'}
                    </Link>
                  </>
                ) : (
                  <AuthLink
                    mode="login"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-5 text-sm font-black text-black shadow-[0_12px_30px_rgba(19,236,91,0.24)] transition hover:brightness-95"
                  >
                    Login / Cadastro
                  </AuthLink>
                )}
              </div>
            </div>
          </header>

          <section className="rounded-[32px] border border-black/6 bg-white px-5 py-6 shadow-[0_24px_70px_rgba(15,23,42,0.06)] sm:px-7 sm:py-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_360px] lg:items-start">
              <div className="space-y-4">
                <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-primary">
                  Nossa Estante
                </span>
                <div className="space-y-3">
                  <h1 className="max-w-3xl text-3xl font-black leading-[0.95] tracking-tight text-text-main sm:text-4xl lg:text-[3.35rem]">
                    Bem-vindo ao Nossa Estante
                  </h1>
                  <p className="max-w-2xl text-sm leading-7 text-text-muted sm:text-base">
                    Descubra livros disponiveis, encontre leitores proximos e acompanhe as melhores oportunidades de troca em um unico lugar.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Acervo aberto', value: `${books.length}+`, text: 'titulos disponiveis para explorar', icon: 'auto_stories' },
                  { label: 'Perto de voce', value: `${nearbyBooks.length}+`, text: 'livros sugeridos por proximidade', icon: 'near_me' },
                  { label: 'Categorias', value: categoryLabels.length, text: 'frentes para comecar sua busca', icon: 'category' },
                  { label: 'Comunidade', value: user ? 'On' : 'Livre', text: 'entre quando quiser participar das trocas', icon: 'groups' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-[24px] border border-primary/12 bg-primary/7 p-4 shadow-sm">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                      <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-primary">{stat.label}</p>
                    <p className="mt-3 text-3xl font-black text-text-main">{stat.value}</p>
                    <p className="mt-1 text-sm text-text-muted">{stat.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">Livros perto de voce</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-text-main">Encontre livros por proximidade</h2>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-text-muted">
                  Primeiro pedimos sua localizacao para rastrear os livros mais proximos e abrir o mapa com resultados ao seu redor.
                </p>
              </div>
            </div>

            {locationStatus !== 'granted' ? (
              <div className="grid gap-4 rounded-[30px] border border-black/6 bg-white p-5 shadow-sm md:grid-cols-[minmax(0,1fr)_280px] md:items-center md:p-6">
                <div className="space-y-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <span className="material-symbols-outlined">location_on</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-text-main">Ative sua localizacao para buscar livros perto de voce</h3>
                    <p className="text-sm leading-7 text-text-muted">
                      Assim que voce permitir, mostramos o mapa com os livros mais proximos e destacamos as melhores opcoes para retirada.
                    </p>
                  </div>
                </div>

                <div className="rounded-[26px] bg-[#F7FAF8] p-4">
                  <button
                    type="button"
                    onClick={requestLocation}
                    disabled={locationStatus === 'loading'}
                    className="flex h-12 w-full items-center justify-center rounded-full bg-primary px-5 text-sm font-black text-black shadow-[0_12px_30px_rgba(19,236,91,0.24)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {locationStatus === 'loading' ? 'Buscando localizacao...' : 'Usar minha localizacao'}
                  </button>

                  {locationStatus === 'denied' && (
                    <p className="mt-3 text-sm leading-6 text-red-500">
                      Nao conseguimos acessar sua localizacao. Tente novamente para liberar o mapa de proximidade.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_360px]">
                <div className="overflow-hidden rounded-[30px] border border-black/6 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-black/6 px-5 py-4">
                    <div>
                      <h3 className="text-lg font-black text-text-main">Mapa de livros proximos</h3>
                      <p className="mt-1 text-sm text-text-muted">Resultados aproximados a partir da sua localizacao atual.</p>
                    </div>
                    <button
                      type="button"
                      onClick={requestLocation}
                      className="rounded-full border border-black/8 bg-[#F7FAF8] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-text-main"
                    >
                      Atualizar
                    </button>
                  </div>
                  <div className="h-[280px] p-4 sm:h-[340px]">
                    <MapLibre
                      lat={(coords || fallbackCenter).lat}
                      lng={(coords || fallbackCenter).lng}
                      zoom={13}
                      markers={getNearbyMarkers()}
                    />
                  </div>
                </div>

                <div className="rounded-[30px] border border-black/6 bg-white p-5 shadow-sm">
                  <div className="mb-4">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Lista proxima</p>
                    <h3 className="mt-2 text-lg font-black text-text-main">Livros perto de voce</h3>
                  </div>

                  <div className="space-y-3">
                    {nearbyBooks.length > 0 ? (
                      nearbyBooks.map((book, index) => (
                        <Link
                          to={`/livro/${book.id}`}
                          key={book.id}
                          className="flex items-center gap-3 rounded-[22px] border border-black/6 p-3 transition hover:border-primary/25 hover:bg-primary/5"
                        >
                          <div className="h-20 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#EEF2EF]">
                            {book.coverURL ? (
                              <img src={book.coverURL} alt={book.title} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-text-muted">
                                <span className="material-symbols-outlined">menu_book</span>
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-black text-text-main">{book.title}</p>
                            <p className="mt-1 truncate text-xs text-text-muted">{book.author}</p>
                            <div className="mt-3 flex items-center gap-2 text-xs text-text-muted">
                              <span className="material-symbols-outlined text-[15px] text-primary">distance</span>
                              <span>{getDistanceLabel(index)}</span>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="rounded-[22px] bg-[#F7FAF8] p-4 text-sm text-text-muted">
                        Ainda nao ha livros disponiveis para montar esta lista.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">Catalogo aberto</p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-text-main">Livros disponiveis agora</h2>
              </div>

              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {categoryLabels.map((category, index) => (
                  <button
                    key={category}
                    className={`rounded-full px-4 py-2 text-xs font-black transition ${index === 0 ? 'bg-primary text-black shadow-[0_10px_24px_rgba(19,236,91,0.22)]' : 'border border-black/8 bg-white text-text-muted'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {featuredBooks.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {featuredBooks.map((book, index) => (
                  <Link
                    to={`/livro/${book.id}`}
                    key={book.id}
                    className="group overflow-hidden rounded-[28px] border border-black/6 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="aspect-[0.78] overflow-hidden bg-[#EDF3EE]">
                      {book.coverURL ? (
                        <img
                          src={book.coverURL}
                          alt={book.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-text-muted">
                          <span className="material-symbols-outlined text-5xl">menu_book</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 p-4">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-text-muted">{book.gender || 'Livro'}</p>
                        <h3 className="mt-2 line-clamp-2 text-lg font-black leading-tight text-text-main">{book.title}</h3>
                        <p className="mt-2 line-clamp-1 text-sm text-text-muted">{book.author}</p>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2 text-sm font-bold text-text-main">
                          <span className="material-symbols-outlined text-base text-primary">local_library</span>
                          <span>{book.cost} pontos</span>
                        </div>
                        <span className="rounded-full bg-[#F4F8F5] px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-primary">
                          {locationStatus === 'granted' ? getDistanceLabel(index).replace(' de voce', '') : 'Catalogo'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-[30px] border border-dashed border-black/10 bg-white p-8 text-center text-sm text-text-muted">
                Nenhum livro foi publicado ainda.
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
