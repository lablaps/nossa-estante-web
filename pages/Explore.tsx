import React, { useState, useCallback, useEffect } from 'react';
import { dbService } from '../services/dbService';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Book } from '../types';

const containerStyle = {
    width: '100%',
    height: '100%'
};

// São Luís, Maranhão Coordinates
const center = {
    lat: -2.53073,
    lng: -44.3068
};

// Custom styles to remove POIs for cleaner look (optional)
const mapOptions = {
    disableDefaultUI: true,
    zoomControl: false,
    styles: [
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
        }
    ]
};

const Explore: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [activeBook, setActiveBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: '' // Placeholder: User needs to add key or use dev mode (env var recommended)
    });

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

    // Mock coordinates generator around São Luís for demo purposes
    // In a real app, books would have real lat/lng
    const getBookPosition = useCallback((index: number) => {
        const angle = index * (360 / books.length);
        const radius = 0.01 + (index % 2 === 0 ? 0.005 : 0); // ~1-2km spread
        return {
            lat: center.lat + radius * Math.cos(angle * Math.PI / 180),
            lng: center.lng + radius * Math.sin(angle * Math.PI / 180)
        };
    }, [books.length]);

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </Layout>
        );
    }

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
                                placeholder="Search in Maranhão..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-bold placeholder:text-text-muted/70 ml-2"
                            />
                        </div>
                        <button className="size-11 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-center border border-white/20">
                            <span className="material-symbols-outlined text-text-main dark:text-white">tune</span>
                        </button>
                    </div>

                    <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pointer-events-auto">
                        {['Near me', 'Available', 'Exchange', 'Free'].map((filter, i) => (
                            <button key={i} className={`px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border border-white/10 shadow-lg ${i === 0 ? 'bg-primary text-black' : 'bg-black/40 text-white'}`}>
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mapa Google Maps */}
                <div className="absolute inset-0 z-0">
                    {isLoaded ? (
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            zoom={13}
                            options={mapOptions}
                        >
                            {books.map((book, i) => (
                                <Marker
                                    key={book.id}
                                    position={getBookPosition(i)}
                                    // Use standard marker or custom icon if available
                                    // icon={book.photos[0]} // Using photo as icon requires scaling, keeping default for now or using label
                                    label={{
                                        text: book.creditsCost.toString(),
                                        color: "white",
                                        fontWeight: "bold",
                                        className: "map-marker-label"
                                    }}
                                    onClick={() => setActiveBook(book)}
                                />
                            ))}
                        </GoogleMap>
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <p className="text-text-muted font-bold">Loading Maps...</p>
                        </div>
                    )}
                </div>

                {/* Card do Livro Selecionado (Bottom Sheet style) */}
                <div className="absolute bottom-[calc(80px+1.5rem)] md:bottom-6 left-4 right-4 z-20">
                    {activeBook && (
                        <div className="bg-white/90 dark:bg-surface-dark/95 backdrop-blur-xl p-4 rounded-[24px] shadow-2xl border border-white/20 dark:border-white/5 flex gap-4 animate-in slide-in-from-bottom-10 fade-in duration-300">
                            <div className="size-20 rounded-xl overflow-hidden shadow-md shrink-0 relative">
                                <img src={activeBook.photos[0]} className="w-full h-full object-cover" alt="" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                <span className="absolute bottom-1 right-1 text-[10px] font-bold text-white bg-black/50 px-1.5 rounded-md">{activeBook.distance}</span>
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                <div>
                                    <h3 className="font-bold text-base truncate dark:text-white leading-tight">{activeBook.title}</h3>
                                    <p className="text-xs text-text-muted truncate">{activeBook.author}</p>
                                </div>

                                <div className="flex items-center gap-2 mt-2">
                                    <Link to={`/livro/${activeBook.id}`} className="flex-1 bg-primary text-black text-center py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform">
                                        I want this!
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
