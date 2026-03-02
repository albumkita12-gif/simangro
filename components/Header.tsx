'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && menuOpen) setMenuOpen(false);
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [menuOpen]);

    const navLinks = [
        { href: '/', label: 'Beranda' },
        { href: '/jenis', label: 'Jenis Mangrove' },
        { href: '/peta-aksi', label: 'Peta Aksi Mangrove' },
        { href: '/monitoring', label: 'Monitoring & Evaluasi' },
        { href: '/quiz', label: 'Quiz' },
        { href: '/regulasi', label: 'Regulasi' },
        { href: '/galeri', label: 'Galeri' },
    ];

    return (
        <>
            <header style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                boxShadow: 'var(--shadow-intense)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                borderBottom: '3px solid transparent',
                borderImage: 'var(--gradient-primary) 1',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Link href="/" style={{
                        width: 48, height: 48, borderRadius: 12, overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(22,163,74,0.25)', flexShrink: 0, display: 'block',
                    }}>
                        <Image src="/img/logo-KKP.png" alt="Logo SIMANGRO" width={48} height={48} style={{ objectFit: 'contain' }} />
                    </Link>
                    <div style={{
                        fontWeight: 800, fontSize: '1.75rem',
                        background: 'var(--gradient-text)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text', letterSpacing: '-0.02em',
                    }}>
                        SIMANGRO KKP
                    </div>
                </div>

                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                    style={{
                        display: 'flex', cursor: 'pointer',
                        background: 'rgba(15,23,42,0.04)', border: 'none',
                        padding: 8, zIndex: 1001, alignItems: 'center', justifyContent: 'center',
                        width: 40, height: 40, borderRadius: 8,
                        transition: 'background-color var(--transition), transform var(--transition)',
                    }}
                >
                    <Image src="/img/menu-dark.png" alt="Menu" width={24} height={24} />
                </button>
            </header>

            {/* Overlay */}
            {menuOpen && (
                <div
                    onClick={() => setMenuOpen(false)}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 999,
                        background: 'rgba(0,0,0,0.2)',
                    }}
                />
            )}

            {/* Slide-in Nav */}
            <nav
                aria-label="Menu utama"
                style={{
                    position: 'fixed', top: 0, right: menuOpen ? 0 : '-100%',
                    height: '100vh', width: '80%', maxWidth: 300,
                    background: 'rgba(255,255,255,0.97)',
                    backdropFilter: 'blur(10px)',
                    flexDirection: 'column', padding: '80px 24px 24px',
                    transition: 'right var(--transition)',
                    boxShadow: 'var(--shadow)',
                    zIndex: 1000, display: 'flex', gap: 8,
                }}
            >
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        style={{
                            color: pathname === link.href ? 'var(--white)' : 'var(--muted)',
                            textDecoration: 'none', fontWeight: 600,
                            padding: '12px 20px', borderRadius: 25,
                            transition: 'all var(--transition)', fontSize: '0.9rem',
                            background: pathname === link.href ? 'var(--gradient-primary)' : 'transparent',
                            display: 'block',
                        }}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </>
    );
}
