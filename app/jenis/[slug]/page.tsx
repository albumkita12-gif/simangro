'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface SpeciesDetail {
    id: number;
    slug: string;
    name: string;
    localNames: string | null;
    intro: string | null;
    morphology: { daun?: string; bunga?: string; buah?: string } | null;
    taxonomy: { kingdom?: string; phylum?: string; class?: string; order?: string; family?: string; genus?: string; species?: string } | null;
    habitat: string | null;
    images: { daun?: string; bunga?: string; buah?: string } | null;
    category: string | null;
}

export default function SpeciesDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const [sp, setSp] = useState<SpeciesDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [slug, setSlug] = useState('');

    useEffect(() => {
        params.then(p => {
            setSlug(p.slug);
            fetch(`/api/species/${p.slug}`)
                .then(r => r.json())
                .then(data => { setSp(data); setLoading(false); });
        });
    }, [params]);

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--muted)', fontSize: '1.1rem' }}>
            ⏳ Memuat data spesies...
        </div>
    );

    if (!sp || sp.id === undefined) return (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <h2>Spesies tidak ditemukan</h2>
            <Link href="/jenis">← Kembali ke Jenis Mangrove</Link>
        </div>
    );

    const parts = [
        { key: 'daun', label: 'Daun', icon: '/img/daun.png' },
        { key: 'bunga', label: 'Bunga', icon: '/img/bunga.png' },
        { key: 'buah', label: 'Buah', icon: '/img/buah.png' },
    ] as const;

    return (
        <div className="container">
            {/* Breadcrumb */}
            <Link href="/jenis" style={{ color: 'var(--primary)', fontWeight: 600, display: 'inline-block', marginBottom: 24, fontSize: '0.95rem' }}>
                ← Kembali ke Jenis Mangrove
            </Link>

            {/* Species Header */}
            <header style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.92), rgba(255,255,255,0.75))',
                backdropFilter: 'blur(25px)', borderRadius: 24, padding: '40px',
                boxShadow: 'var(--shadow-intense)', border: '1px solid rgba(255,255,255,0.4)',
                marginBottom: 32, textAlign: 'center',
            }}>
                {sp.localNames && (
                    <div style={{
                        display: 'inline-block', padding: '10px 24px', marginBottom: 20,
                        background: 'var(--gradient-primary)', color: 'white',
                        borderRadius: 50, fontWeight: 600, fontSize: '0.9rem',
                    }}>
                        {sp.localNames}
                    </div>
                )}
                <h1 style={{
                    fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, fontStyle: 'italic',
                    background: 'var(--gradient-text)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    marginBottom: 16,
                }}>{sp.name}</h1>
                {sp.intro && (
                    <p style={{ color: 'var(--muted)', lineHeight: 1.7, maxWidth: 800, margin: '0 auto', fontSize: '1rem' }}>{sp.intro}</p>
                )}
            </header>

            {/* Image Gallery */}
            {sp.images && (
                <section style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 24, marginBottom: 32,
                }}>
                    {parts.map(p => sp.images?.[p.key] && (
                        <div key={p.key} style={{
                            borderRadius: 20, overflow: 'hidden',
                            boxShadow: 'var(--shadow)', background: 'rgba(255,255,255,0.9)',
                            backdropFilter: 'blur(10px)',
                        }}>
                            <div style={{ position: 'relative', height: 220 }}>
                                <Image
                                    src={sp.images[p.key]!}
                                    alt={`${sp.name} - ${p.label}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                            </div>
                            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                                <Image src={p.icon} alt={p.label} width={24} height={24} />
                                <span style={{ fontWeight: 600, color: 'var(--accent-dark)' }}>{p.label}</span>
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {/* Morphology */}
            {sp.morphology && (
                <section style={{
                    background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
                    borderRadius: 24, padding: '40px', marginBottom: 24,
                    boxShadow: 'var(--shadow)', border: '1px solid rgba(22,163,74,0.1)',
                }}>
                    <h3 style={{
                        fontSize: '1.8rem', fontWeight: 800, marginBottom: 28, textAlign: 'center',
                        background: 'var(--gradient-text)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>Deskripsi Morfologi</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
                        {parts.map(p => sp.morphology?.[p.key] && (
                            <div key={p.key} style={{
                                background: 'linear-gradient(145deg, rgba(255,255,255,0.85), rgba(22,163,74,0.03))',
                                border: '1px solid rgba(22,163,74,0.15)', borderRadius: 16, padding: 24,
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                    <Image src={p.icon} alt={p.label} width={32} height={32} />
                                    <span style={{ fontWeight: 700, color: 'var(--accent-dark)', fontSize: '1.1rem' }}>{p.label}</span>
                                </div>
                                <p style={{ color: 'var(--muted)', lineHeight: 1.7, fontSize: '0.95rem', margin: 0 }}>
                                    {sp.morphology![p.key]}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Taxonomy */}
            {sp.taxonomy && (
                <section style={{
                    background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
                    borderRadius: 24, padding: '40px', marginBottom: 24,
                    boxShadow: 'var(--shadow)', border: '1px solid rgba(22,163,74,0.1)',
                }}>
                    <h3 style={{
                        fontSize: '1.8rem', fontWeight: 800, marginBottom: 28, textAlign: 'center',
                        background: 'var(--gradient-text)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>Klasifikasi Taksonomi</h3>
                    <div style={{ maxWidth: 500, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {Object.entries(sp.taxonomy).map(([key, val]) => (
                            <div key={key} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '12px 20px', borderRadius: 12,
                                background: 'linear-gradient(145deg, rgba(22,163,74,0.05), rgba(22,163,74,0.02))',
                                border: '1px solid rgba(22,163,74,0.1)',
                            }}>
                                <span style={{ fontWeight: 600, color: 'var(--muted)', textTransform: 'capitalize' }}>{key}</span>
                                <span style={{ fontWeight: 700, color: 'var(--accent-dark)', fontStyle: key === 'species' || key === 'genus' ? 'italic' : 'normal' }}>{val as string}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Habitat */}
            {sp.habitat && (
                <section style={{
                    background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
                    borderRadius: 24, padding: '40px', marginBottom: 40,
                    boxShadow: 'var(--shadow)', border: '1px solid rgba(22,163,74,0.1)',
                }}>
                    <h3 style={{
                        fontSize: '1.8rem', fontWeight: 800, marginBottom: 24, textAlign: 'center',
                        background: 'var(--gradient-text)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>Habitat & Sebaran Geografis</h3>
                    <p style={{
                        color: 'var(--muted)', lineHeight: 1.8, fontSize: '1rem',
                        maxWidth: 800, margin: '0 auto', textAlign: 'center',
                    }}>{sp.habitat}</p>
                </section>
            )}
        </div>
    );
}
