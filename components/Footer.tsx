import Image from 'next/image';

export default function Footer() {
    return (
        <footer style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(22,163,74,0.15)',
            padding: '32px 24px',
            display: 'flex', gap: 20, alignItems: 'center',
            justifyContent: 'center', flexWrap: 'wrap', textAlign: 'center',
            position: 'relative', marginTop: 'auto',
        }}>
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: 'var(--gradient-primary)',
            }} />
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, overflow: 'hidden', boxShadow: '0 4px 15px rgba(22,163,74,0.25)' }}>
                    <Image src="/img/logo-KKP.png" alt="Logo KKP" width={40} height={40} style={{ objectFit: 'contain' }} />
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 10, overflow: 'hidden', boxShadow: '0 4px 15px rgba(22,163,74,0.15)' }}>
                    <Image src="/img/upi-logo.png" alt="Logo UPI" width={40} height={40} style={{ objectFit: 'contain' }} />
                </div>
            </div>
            <div style={{ fontSize: '0.9rem' }}>
                <div style={{
                    fontWeight: 700, background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                    Kementerian Kelautan dan Perikanan
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 4 }}>
                    © 2025 Kementerian Kelautan dan Perikanan Republik Indonesia
                </div>
                <div style={{ color: 'var(--dark)', fontWeight: 600, marginTop: 4 }}>Developed by Raisa Maulidia</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 4 }}>
                    <a href="mailto:raisam@example.com" style={{ color: 'var(--primary)', fontWeight: 600 }}>raisam@example.com</a>
                    {' | '}
                    <a href="tel:+62812345678" style={{ color: 'var(--primary)', fontWeight: 600 }}>+62 812-345-678</a>
                </div>
            </div>
        </footer>
    );
}
