import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  const features = [
    { icon: '/img/wave-dark.png', iconHover: '/img/wave-light.png', title: 'Penahan Abrasi', desc: 'Akar mangrove mampu menahan gelombang dan mencegah erosi pantai.' },
    { icon: '/img/fish-dark.png', iconHover: '/img/fish-light.png', title: 'Habitat Biota', desc: 'Menjadi tempat hidup, pemijahan, dan mencari makan bagi ikan, udang, dan kepiting.' },
    { icon: '/img/carbon-dark.png', iconHover: '/img/carbon-light.png', title: 'Penyerap Karbon', desc: 'Menyimpan karbon biru dalam jumlah besar untuk mitigasi perubahan iklim.' },
    { icon: '/img/economy-dark.png', iconHover: '/img/economy-light.png', title: 'Sumber Ekonomi', desc: 'Memberikan manfaat seperti kayu, obat, pewarna, produk pangan, dan ekowisata.' },
  ];

  return (
    <>
      {/* HERO */}
      <section style={{
        position: 'relative', width: '100%', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', overflow: 'hidden', background: 'var(--gradient-bg)',
      }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image src="/img/mangrove4.jpg" alt="Ekosistem mangrove" fill style={{ objectFit: 'cover', opacity: 0.15 }} priority />
        </div>
        <div style={{
          position: 'relative', zIndex: 2,
          maxWidth: 1000, padding: '48px 40px',
          background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(25px)',
          borderRadius: 32, boxShadow: 'var(--shadow-intense)',
          border: '1px solid rgba(255,255,255,0.5)', margin: '0 20px',
        }}>
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.2rem)', fontWeight: 800,
            lineHeight: 1.2, marginBottom: 24,
            background: 'var(--gradient-text)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            SIMANGRO KKP
          </h1>
          <p style={{ color: 'var(--dark)', fontSize: 'clamp(0.95rem, 2vw, 1rem)', lineHeight: 1.7, fontWeight: 500, marginBottom: 32 }}>
            Platform digital untuk informasi dan identifikasi jenis mangrove. Dengan deskripsi lengkap, ciri morfologi, dan informasi penting berbagai spesies mangrove, SIMANGRO membantu pengguna mengenali dan membandingkan jenis mangrove dengan mudah untuk penelitian dan survei lapangan yang akurat.
          </p>
          <Link href="/jenis" style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            padding: '16px 32px', background: 'var(--gradient-primary)',
            color: 'var(--white)', borderRadius: 50, fontWeight: 700,
            fontSize: '1rem', textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(22,163,74,0.3)',
            transition: 'all var(--transition)',
          }}>
            Mulai Jelajahi <span>→</span>
          </Link>
        </div>
      </section>

      {/* ABOUT MANGROVE */}
      <section style={{
        padding: '80px 40px', textAlign: 'center',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #d1fae5 100%)',
      }}>
        <h2 style={{
          fontSize: '2.4rem', fontWeight: 800, marginBottom: 32,
          background: 'var(--gradient-text)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>Sekilas Tentang Mangrove</h2>
        <p style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: '1rem', maxWidth: 900, margin: '0 auto' }}>
          Mangrove merupakan ekosistem hutan yang tumbuh di daerah pesisir tropis dan subtropis. Mangrove memiliki kemampuan unik untuk hidup di perairan payau dengan kondisi tanah berlumpur, pasang surut, dan kadar garam tinggi. Indonesia memiliki keanekaragaman mangrove terbesar di dunia dengan lebih dari 200 jenis tumbuhan.
        </p>
      </section>

      {/* FUNGSI MANGROVE */}
      <section style={{ padding: '80px 40px', textAlign: 'center', background: 'rgba(255,255,255,0.95)' }}>
        <h2 style={{
          fontSize: '2.4rem', fontWeight: 800, marginBottom: 48,
          background: 'var(--gradient-text)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>Fungsi dan Peran Mangrove</h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 24, maxWidth: 900, marginLeft: 'auto', marginRight: 'auto',
        }}>
          {features.map((f) => (
            <div key={f.title} style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.85), rgba(22,163,74,0.03))',
              backdropFilter: 'blur(15px)', border: '1px solid rgba(22,163,74,0.15)',
              padding: 28, borderRadius: 20,
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
              gap: 16, transition: 'all var(--transition)',
            }}>
              <div style={{
                width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 16, background: 'linear-gradient(145deg, rgba(22,163,74,0.1), rgba(22,163,74,0.15))',
              }}>
                <Image src={f.icon} alt={f.title} width={80} height={80} style={{ objectFit: 'contain' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-dark)', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        background: 'var(--accent)', padding: '80px 40px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'white', marginBottom: 24, lineHeight: 1.3 }}>
            Jelajahi Keanekaragaman Mangrove
          </h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.9)', marginBottom: 40, lineHeight: 1.7 }}>
            Temukan berbagai jenis mangrove Indonesia dengan informasi lengkap mulai dari ciri morfologi, habitat, hingga manfaatnya.
          </p>
          <Link href="/jenis" style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            padding: '18px 36px', background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(20px)', color: 'white',
            borderRadius: 50, fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
            border: '2px solid rgba(255,255,255,0.3)',
            transition: 'all var(--transition)',
          }}>
            Mulai Jelajahi <span>→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
