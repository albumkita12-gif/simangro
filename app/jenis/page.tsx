'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Species {
    id: number;
    slug: string;
    name: string;
    localNames: string | null;
    category: string | null;
    images: { daun?: string; bunga?: string; buah?: string } | null;
}

type CategoryFilter = 'all' | 'mangrove sejati' | 'mangrove asosiasi';

const catColors: Record<string, string> = {
    'mangrove sejati': '#16a34a',
    'mangrove asosiasi': '#7c3aed',
};

const catLabels: Record<string, string> = {
    'mangrove sejati': 'Mangrove Sejati',
    'mangrove asosiasi': 'Mangrove Asosiasi',
};

export default function JenisPage() {
    const [speciesList, setSpeciesList] = useState<Species[]>([]);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/species')
            .then(r => r.json())
            .then(data => { setSpeciesList(data); setLoading(false); });
    }, []);

    const filtered = speciesList.filter(s => {
        const matchSearch =
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            (s.localNames || '').toLowerCase().includes(search.toLowerCase());
        const matchCategory =
            categoryFilter === 'all' || s.category === categoryFilter;
        return matchSearch && matchCategory;
    });

    const sejatiCount = speciesList.filter(s => s.category === 'mangrove sejati').length;
    const asoCount = speciesList.filter(s => s.category === 'mangrove asosiasi').length;

    return (
        <div className="container">
            {/* Header */}
            <div style={{
                textAlign: 'center', marginBottom: 48, padding: 40,
                background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)',
                borderRadius: 24, boxShadow: 'var(--shadow-intense)',
                border: '1px solid rgba(255,255,255,0.3)',
            }}>
                <h1 style={{
                    fontSize: '2.4rem', fontWeight: 800, marginBottom: 12,
                    background: 'var(--gradient-text)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>Jenis Mangrove</h1>
                <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: 600, margin: '0 auto 24px' }}>
                    Temukan berbagai jenis mangrove Indonesia dengan informasi lengkap, ciri morfologi, dan habitatnya.
                </p>
                <input
                    type="text"
                    placeholder="Cari nama ilmiah atau nama lokal..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                        width: '100%', maxWidth: 500, padding: '16px 20px', fontSize: '1rem',
                        border: '2px solid var(--accent)', borderRadius: 50,
                        background: 'rgba(255,255,255,0.8)', outline: 'none',
                        fontFamily: 'inherit', color: 'var(--dark)',
                        marginBottom: 24,
                    }}
                />

                {/* Filter Kategori */}
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {([
                        { key: 'all', label: `Semua (${speciesList.length})`, color: '#16a34a' },
                        { key: 'mangrove sejati', label: `Mangrove Sejati (${sejatiCount})`, color: catColors['mangrove sejati'] },
                        { key: 'mangrove asosiasi', label: `Mangrove Asosiasi (${asoCount})`, color: catColors['mangrove asosiasi'] },
                    ] as { key: CategoryFilter; label: string; color: string }[]).map(({ key, label, color }) => (
                        <button
                            key={key}
                            onClick={() => setCategoryFilter(key)}
                            style={{
                                padding: '10px 20px', borderRadius: 50, cursor: 'pointer',
                                border: `2px solid ${color}`, fontFamily: 'inherit',
                                fontWeight: 600, fontSize: '0.9rem',
                                background: categoryFilter === key ? color : 'transparent',
                                color: categoryFilter === key ? 'white' : color,
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)', fontSize: '1.1rem' }}>
                    ⏳ Memuat data spesies...
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)', fontSize: '1.1rem' }}>
                    🌿 Tidak ada spesies yang cocok dengan pencarian Anda.
                </div>
            ) : (
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 24, marginTop: 8,
                }}>
                    {filtered.map(s => {
                        const catColor = catColors[s.category || ''] || '#16a34a';
                        return (
                            <Link href={`/jenis/${s.slug}`} key={s.id} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    background: 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))',
                                    backdropFilter: 'blur(20px)', borderRadius: 20, overflow: 'hidden',
                                    boxShadow: 'var(--shadow)', border: '1px solid rgba(255,255,255,0.3)',
                                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer',
                                }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-12px) scale(1.02)';
                                        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-intense)';
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLElement).style.transform = '';
                                        (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow)';
                                    }}
                                >
                                    <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: 'linear-gradient(135deg, #e2e8f0, #f1f5f9)' }}>
                                        {s.images?.daun ? (
                                            <Image
                                                src={s.images.daun}
                                                alt={`${s.name} - daun`}
                                                fill
                                                style={{ objectFit: 'cover', transition: 'transform 0.6s ease' }}
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                            />
                                        ) : (
                                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🌿</div>
                                        )}
                                        <div style={{
                                            position: 'absolute', inset: 0,
                                            background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(0,0,0,0.6) 100%)',
                                        }} />
                                        {s.category && (
                                            <span style={{
                                                position: 'absolute', bottom: 12, left: 12, zIndex: 2,
                                                background: catColor + 'dd',
                                                color: 'white',
                                                padding: '4px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600,
                                            }}>{catLabels[s.category] || s.category}</span>
                                        )}
                                    </div>
                                    <div style={{ padding: 24, zIndex: 2, position: 'relative' }}>
                                        <h3 style={{
                                            fontSize: '1.1rem', fontWeight: 700, marginBottom: 8,
                                            background: 'var(--gradient-primary)',
                                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                            fontStyle: 'italic',
                                        }}>{s.name}</h3>
                                        {s.localNames && (
                                            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
                                                {s.localNames.split(',').slice(0, 3).join(', ')}{s.localNames.split(',').length > 3 ? '...' : ''}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
