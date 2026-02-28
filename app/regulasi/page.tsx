'use client';
import { useEffect, useState } from 'react';

interface Regulation {
    id: number;
    year: number;
    title: string;
    description: string | null;
    points: string[] | null;
}

export default function RegulasiPage() {
    const [regs, setRegs] = useState<Regulation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/regulasi')
            .then(r => r.json())
            .then(d => { setRegs(d); setLoading(false); });
    }, []);

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
                }}>Regulasi Mangrove</h1>
                <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: 600, margin: '0 auto' }}>
                    Jelajahi upaya pelestarian mangrove yang dilakukan oleh Kementerian Kelautan dan Perikanan, mulai dari ketentuan hukum hingga program rehabilitasi.
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>⏳ Memuat data...</div>
            ) : (
                <div style={{ maxWidth: 900, margin: '0 auto' }}>
                    <h2 style={{
                        textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: 64,
                        background: 'var(--gradient-text)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>Timeline Regulasi</h2>

                    <div style={{ position: 'relative', paddingTop: 20 }}>
                        {/* Center line */}
                        <div style={{
                            position: 'absolute', left: '50%', top: 0, bottom: 0,
                            width: 4, transform: 'translateX(-50%)',
                            background: 'var(--gradient-primary)', borderRadius: 4,
                        }} />

                        {regs.map((reg, i) => {
                            const isLeft = i % 2 === 0;
                            return (
                                <div key={reg.id} style={{
                                    display: 'flex', marginBottom: 80,
                                    flexDirection: isLeft ? 'row' : 'row-reverse',
                                    position: 'relative',
                                }}>
                                    {/* Content */}
                                    <div style={{
                                        width: '45%', paddingRight: isLeft ? 48 : 0, paddingLeft: isLeft ? 0 : 48,
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: isLeft ? 'flex-end' : 'flex-start',
                                    }}>
                                        <div style={{
                                            background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)',
                                            border: '1px solid rgba(22,163,74,0.2)', borderRadius: 20,
                                            padding: 28, boxShadow: 'var(--shadow)',
                                            transition: 'all var(--transition)', width: '100%',
                                        }}>
                                            <div style={{
                                                fontSize: '2.2rem', fontWeight: 800, marginBottom: 12,
                                                background: 'var(--gradient-text)',
                                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                            }}>{reg.year}</div>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-dark)', marginBottom: 12 }}>
                                                {reg.title}
                                            </h3>
                                            {reg.description && (
                                                <p style={{ fontSize: '0.95rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12 }}>
                                                    {reg.description}
                                                </p>
                                            )}
                                            {reg.points && reg.points.length > 0 && (
                                                <ul style={{
                                                    marginTop: 16, paddingTop: 16,
                                                    borderTop: '1px solid rgba(22,163,74,0.15)',
                                                    paddingLeft: 20, fontSize: '0.85rem', color: 'var(--dark)',
                                                }}>
                                                    {(reg.points as string[]).map((pt, j) => (
                                                        <li key={j} style={{ marginBottom: 6 }}>{pt}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>

                                    {/* Center dot */}
                                    <div style={{
                                        position: 'absolute', left: '50%', top: 20,
                                        width: 20, height: 20, background: 'var(--accent)',
                                        border: '4px solid white', borderRadius: '50%',
                                        transform: 'translateX(-50%)', zIndex: 3,
                                        boxShadow: '0 0 0 4px rgba(22,163,74,0.2)',
                                    }} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
