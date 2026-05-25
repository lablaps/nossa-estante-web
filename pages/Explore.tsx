import React, { useState, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import MapLibre from '../components/MapLibre';
import { Book } from '../types';

// São Luís, Maranhão Coordinates
const center = {
    lat: -2.53073,
    lng: -44.3068
};

type UserCoords = {
    lat: number;
    lng: number;
};

const Explore: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [activeBook, setActiveBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [coords, setCoords] = useState<UserCoords | null>(null);
    const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'granted' | 'denied'>('idle');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const data = await dbService.getBooks();
                setBooks(data);
                if (data.length > 0) {
                    setActiveBook(data[0]);
                }
            } catch (error) {
                console.error('Error fetching books for explore:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
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

    useEffect(() => {
        requestLocation();
    }, []);
    
    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </Layout>
        );
    }

    const mapCenter = coords || center;

    const markerPoints = books.slice(0, 6).map((book, index) => ({
        id: book.id,
        lat: mapCenter.lat + 0.004 + index * 0.0025,
        lng: mapCenter.lng - 0.003 + index * 0.002,
        label: `${index + 1}`
    }));

    return (
        <Layout>
            <div className="h-screen bg-gray-100 dark:bg-background-dark relative overflow-hidden flex flex-col">
                {/* Header Flutuante */}
                <div className="absolute top-0 left-0 right-0 z-20 p-6 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
                    <div className="flex items-center gap-3 pointer-events-auto">
                        <div className="flex-1 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md rounded-2xl shadow-xl flex items-center px-4 py-3 border border-white/20">
                            <span className="material-symbols-outlined text-text-muted">search</span>
                            <input
                                type="text"
                                placeholder={locationStatus === 'granted' ? 'Buscar perto de você...' : 'Buscar em São Luís...'}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-text-muted/70 ml-2 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pointer-events-auto">
                        {['Perto de mim', 'Disponível', 'Troca'].map((filter, i) => (
                            <button key={i} className={`px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border border-white/10 shadow-lg ${i === 0 ? 'bg-primary text-black' : 'bg-black/40 text-white'}`}>
                                {filter}
                            </button>
                        ))}

                        {locationStatus !== 'granted' && (
                            <button
                                type="button"
                                onClick={requestLocation}
                                className="px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border border-white/10 shadow-lg bg-white/90 text-text-main"
                            >
                                {locationStatus === 'loading' ? 'Localizando...' : 'Usar minha localização'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Mapa MapLibre (Substituindo Google Maps) */}
                <div className="absolute inset-0 z-0">
                    <MapLibre 
                        lat={mapCenter.lat} 
                        lng={mapCenter.lng} 
                        zoom={13}
                        markers={markerPoints}
                        onMarkerClick={(point) => {
                            const foundBook = books.find(b => b.id === point.id);
                            if (foundBook) setActiveBook(foundBook);
                        }}
                    />
                </div>

                {/* Card do Livro Selecionado (Bottom Sheet style) */}
                <div className="absolute bottom-[calc(80px+1.5rem)] md:bottom-6 left-4 right-4 z-20">
                    {activeBook && (
                        <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-xl p-4 rounded-[24px] shadow-2xl border border-white/20 dark:border-white/5 flex gap-4 animate-in slide-in-from-bottom-10 fade-in duration-300">
                            <div className="size-20 rounded-xl overflow-hidden shadow-md shrink-0 relative">
                                <img src={activeBook.coverURL || 'https://picsum.photos/seed/book/200/300'} className="w-full h-full object-cover" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                <div>
                                    <h3 className="font-bold text-base truncate dark:text-white leading-tight">{activeBook.title}</h3>
                                    <p className="text-xs text-text-muted truncate">{activeBook.author}</p>
                                </div>

                                <div className="flex items-center gap-2 mt-2">
                                    <Link to={`/livro/${activeBook.id}`} className="flex-1 bg-primary text-black text-center py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform">
                                        Eu quero este!
                                    </Link>
                                    <button className="size-9 bg-[#F3F6F4] dark:bg-white/10 rounded-xl flex items-center justify-center text-text-muted">
                                        <span className="material-symbols-outlined text-[18px]">favorite</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Explore;
