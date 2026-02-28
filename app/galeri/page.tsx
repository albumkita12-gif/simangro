'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface GalleryItem {
    id: number;
    category: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
}

type Category = 'all' | 'penanaman' | 'restorasi' | 'ekosistem' | 'komunitas';

const catLabels: Record<string, string> = {
    penanaman: 'Penanaman',
    restorasi: 'Restorasi',
    ekosistem: 'Ekosistem',
    komunitas: 'Komunitas',
};

const catColors: Record<string, string> = {
    penanaman: '#16a34a',
    restorasi: '#0ea5e9',
    ekosistem: '#10b981',
    komunitas: '#8b5cf6',
};

export default function GaleriPage() {
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [filter, setFilter] = useState<Category>('all');
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState<GalleryItem | null>(null);

    useEffect(() => {
        fetch('/api/galeri')
            .then(r => r.json())
            .then(d => { setItems(d); setLoading(false); });
    }, []);

    const filtered = filter === 'all' ? items : items.filter(i => i.category === filter);

    const emojiMap: Record<string, string> = {
        penanaman: '🌱', restorasi: '🌊', ekosistem: '🦅', komunitas: '👥',
    };

    return (
        <div className="container">
            {/* Header */}
            <div style={{
                textAlign: 'center', marginBottom: 40, padding: 40,
                background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)',
                borderRadius: 24, boxShadow: 'var(--shadow-intense)',
                border: '1px solid rgba(255,255,255,0.3)',
            }}>
                <h1 style={{
                    fontSize: '2.4rem', fontWeight: 800, marginBottom: 12,
                    background: 'var(--gradient-text)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>Galeri Mangrove</h1>
                <p style={{ color: 'var(--muted)', fontSize: '1rem', margin: '0 auto 24px', maxWidth: 600 }}>
                    Dokumentasi visual pelestarian dan pengembangan ekosistem mangrove di seluruh nusantara.
                </p>

                {/* Filters */}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {(['all', 'penanaman', 'restorasi', 'ekosistem', 'komunitas'] as Category[]).map(cat => (
                        <button key={cat} onClick={() => setFilter(cat)} style={{
                            padding: '10px 20px', borderRadius: 50, cursor: 'pointer',
                            border: '2px solid var(--primary)', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.9rem',
                            background: filter === cat ? 'var(--primary)' : 'transparent',
                            color: filter === cat ? 'white' : 'var(--primary)',
                            transition: 'all var(--transition)',
                        }}>
                            {cat === 'all' ? 'Semua' : catLabels[cat]}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>⏳ Memuat galeri...</div>
            ) : (
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: 24, marginBottom: 40,
                }}>
                    {filtered.map(item => (
                        <div key={item.id} onClick={() => setModal(item)} style={{
                            background: 'rgba(255,255,255,0.9)', borderRadius: 16, overflow: 'hidden',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.1)', cursor: 'pointer',
                            transition: 'all 0.3s ease',
                        }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)';
                                (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(22,163,74,0.2)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.transform = '';
                                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                            }}
                        >
                            <div style={{ position: 'relative', height: 220, background: `linear-gradient(135deg, ${catColors[item.category] || '#16a34a'} 0%, #22c55e 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60 }}>
                                {item.imageUrl ? (
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.title}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        onError={() => { }}
                                    />
                                ) : (
                                    <span>{emojiMap[item.category] || '🌿'}</span>
                                )}
                                {/* Hover overlay */}
                                <div style={{
                                    position: 'absolute', inset: 0, background: 'rgba(22,163,74,0.8)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    opacity: 0, transition: 'opacity 0.3s ease',
                                }}
                                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '0'}
                                >
                                    <span style={{ fontSize: 40 }}>🔍</span>
                                </div>
                            </div>
                            <div style={{ padding: 20 }}>
                                <span style={{
                                    display: 'inline-block', padding: '4px 12px', borderRadius: 12,
                                    background: catColors[item.category] || '#16a34a',
                                    color: 'white', fontSize: '0.75rem', fontWeight: 600, marginBottom: 10,
                                }}>
                                    {catLabels[item.category] || item.category}
                                </span>
                                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--dark)', marginBottom: 8 }}>{item.title}</div>
                                <div style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                    {(item.description || '').slice(0, 80)}...
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Lightbox */}
            {modal && (
                <div onClick={() => setModal(null)} style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.82)',
                    zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
                }}>
                    <div onClick={e => e.stopPropagation()} style={{
                        background: 'white', borderRadius: 20, maxWidth: 680,
                        width: '100%', maxHeight: '90vh', overflow: 'auto', position: 'relative',
                    }}>
                        <button onClick={() => setModal(null)} style={{
                            position: 'absolute', top: 16, right: 16, width: 40, height: 40,
                            background: 'rgba(22,163,74,0.1)', border: 'none', borderRadius: '50%',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 20, color: 'var(--primary)', zIndex: 10, transition: 'all 0.2s ease',
                        }}>×</button>
                        <div style={{ position: 'relative', width: '100%', height: 380, background: `linear-gradient(135deg, ${catColors[modal.category] || '#16a34a'} 0%, #22c55e 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>
                            {modal.imageUrl ? (
                                <Image src={modal.imageUrl} alt={modal.title} fill style={{ objectFit: 'cover' }} />
                            ) : (
                                <span>{emojiMap[modal.category] || '🌿'}</span>
                            )}
                        </div>
                        <div style={{ padding: 30 }}>
                            <span style={{
                                display: 'inline-block', padding: '6px 16px', borderRadius: 15,
                                background: catColors[modal.category] || '#16a34a',
                                color: 'white', fontSize: '0.85rem', fontWeight: 600, marginBottom: 16,
                            }}>
                                {catLabels[modal.category]}
                            </span>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--dark)', marginBottom: 12 }}>{modal.title}</h2>
                            <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.8 }}>{modal.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
