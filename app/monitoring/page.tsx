'use client';
import { useEffect, useState, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement, LineElement, PointElement,
    ArcElement, Title, Tooltip, Legend,
    type ChartOptions,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, LineElement, PointElement,
    ArcElement, Title, Tooltip, Legend,
);

// ─── Types ───────────────────────────────────────────────────────────────────
interface MonData {
    id: number;
    kabupaten: string;
    provinsi: string | null;
    luasTarget: number | null;
    luasTanam: number | null;
    tahun: number | null;
}

interface ExtendedAgg {
    totals: { totalBibit: number; totalTK: number; totalHOK: number; totalLuas: number };
    byYear: Record<string, { bibit: number; tk: number; hok: number; luas: number }>;
    byProvinsi: Record<string, { bibit: number; tk: number; hok: number; luas: number }>;
    byPolaTanam: Record<string, { bibit: number; luas: number; count: number }>;
}

interface LapanganRec {
    id: number;
    lokasi: string;
    kabupaten: string | null;
    provinsi: string | null;
    tahun: number | null;
    survivalRate: number | null;
    kerapatan: number | null;
    tinggiTanaman: number | null;
    fotoUrl: string | null;
    status: string | null;
    catatan: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const TABS = ['Dashboard', 'Monitoring Lapangan'] as const;
type Tab = typeof TABS[number];

const PIE_COLORS = ['#16a34a', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#3b82f6'];

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color: string }) {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
            borderRadius: 20, padding: '24px 20px', textAlign: 'center',
            boxShadow: 'var(--shadow)', border: `2px solid ${color}22`,
            transition: 'transform 0.2s', cursor: 'default',
        }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color, marginBottom: 4, lineHeight: 1.1 }}>{value}</div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color, marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
            {sub && <div style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{sub}</div>}
        </div>
    );
}

function SectionCard({ title, children }: { title?: string; children: React.ReactNode }) {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
            borderRadius: 20, padding: '28px 24px', marginBottom: 24,
            boxShadow: 'var(--shadow)', border: '1px solid rgba(22,163,74,0.1)',
        }}>
            {title && (
                <h3 style={{
                    fontSize: '1.15rem', fontWeight: 800, marginBottom: 20,
                    background: 'var(--gradient-text)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>{title}</h3>
            )}
            {children}
        </div>
    );
}

function StatusBadge({ status }: { status: string | null }) {
    const cfg: Record<string, { bg: string; color: string; icon: string }> = {
        'Berhasil': { bg: 'rgba(22,163,74,0.12)', color: '#16a34a', icon: '✅' },
        'Perlu Rehabilitasi': { bg: 'rgba(239,68,68,0.12)', color: '#dc2626', icon: '⚠️' },
        'Dalam Pemantauan': { bg: 'rgba(245,158,11,0.12)', color: '#d97706', icon: '🔍' },
    };
    const s = status ?? 'Dalam Pemantauan';
    const c = cfg[s] ?? cfg['Dalam Pemantauan'];
    return (
        <span style={{
            background: c.bg, color: c.color, padding: '4px 10px',
            borderRadius: 20, fontSize: '0.78rem', fontWeight: 700, whiteSpace: 'nowrap',
        }}>
            {c.icon} {s}
        </span>
    );
}

function SurvivalBar({ value }: { value: number | null }) {
    const v = value ?? 0;
    const color = v >= 80 ? '#16a34a' : v >= 60 ? '#f59e0b' : '#dc2626';
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 99, height: 8, overflow: 'hidden' }}>
                <div style={{ width: `${v}%`, height: '100%', background: color, borderRadius: 99, transition: 'width 0.6s' }} />
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color, minWidth: 36 }}>{v}%</span>
        </div>
    );
}

// ─── Form modal ──────────────────────────────────────────────────────────────
const EMPTY_FORM = {
    lokasi: '', kabupaten: '', provinsi: '', tahun: '',
    survivalRate: '', kerapatan: '', tinggiTanaman: '',
    fotoUrl: '', status: 'Dalam Pemantauan', catatan: '',
};

export default function MonitoringPage() {
    const [activeTab, setActiveTab] = useState<Tab>('Dashboard');

    // ── Existing monitoring data ─────────────────────────────────────
    const [monData, setMonData] = useState<MonData[]>([]);
    const [loading, setLoading] = useState(true);

    // ── Extended aggregate ───────────────────────────────────────────
    const [ext, setExt] = useState<ExtendedAgg | null>(null);
    const [extLoading, setExtLoading] = useState(true);

    // ── Lapangan ─────────────────────────────────────────────────────
    const [lapangan, setLapangan] = useState<LapanganRec[]>([]);
    const [lapLoading, setLapLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ ...EMPTY_FORM });
    const [submitting, setSubmitting] = useState(false);
    const [lapFilter, setLapFilter] = useState<'Semua' | 'Berhasil' | 'Perlu Rehabilitasi' | 'Dalam Pemantauan'>('Semua');

    useEffect(() => {
        fetch('/api/monitoring')
            .then(r => r.json())
            .then(d => { setMonData(d); setLoading(false); });
        fetch('/api/monitoring/extended')
            .then(r => r.json())
            .then(d => { setExt(d); setExtLoading(false); });
        fetch('/api/monitoring/lapangan')
            .then(r => r.json())
            .then(d => { setLapangan(d); setLapLoading(false); });
    }, []);

    const reloadLapangan = () => {
        setLapLoading(true);
        fetch('/api/monitoring/lapangan')
            .then(r => r.json())
            .then(d => { setLapangan(d); setLapLoading(false); });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await fetch('/api/monitoring/lapangan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...form,
                tahun: form.tahun ? Number(form.tahun) : null,
                survivalRate: form.survivalRate ? Number(form.survivalRate) : null,
                kerapatan: form.kerapatan ? Number(form.kerapatan) : null,
                tinggiTanaman: form.tinggiTanaman ? Number(form.tinggiTanaman) : null,
            }),
        });
        setSubmitting(false);
        setShowForm(false);
        setForm({ ...EMPTY_FORM });
        reloadLapangan();
    };

    // ── Charts: existing monitoring ─────────────────────────────────
    const totalTarget = monData.reduce((s, d) => s + (d.luasTarget ?? 0), 0);
    const totalTanam = monData.reduce((s, d) => s + (d.luasTanam ?? 0), 0);
    const pct = totalTarget > 0 ? Math.round((totalTanam / totalTarget) * 100) : 0;

    const barData = {
        labels: monData.map(d => d.kabupaten),
        datasets: [
            { label: 'Target (Ha)', data: monData.map(d => d.luasTarget ?? 0), backgroundColor: 'rgba(22,163,74,0.3)', borderColor: '#16a34a', borderWidth: 2, borderRadius: 6 },
            { label: 'Realisasi (Ha)', data: monData.map(d => d.luasTanam ?? 0), backgroundColor: 'rgba(14,165,233,0.35)', borderColor: '#0ea5e9', borderWidth: 2, borderRadius: 6 },
        ],
    };
    const barOptions: ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${(ctx.raw as number).toLocaleString()} Ha` } },
        },
        scales: {
            y: { beginAtZero: true, ticks: { callback: v => `${v} Ha` }, grid: { color: 'rgba(22,163,74,0.08)' } },
            x: { grid: { display: false }, ticks: { maxRotation: 45 } },
        },
    };

    // ── Charts: trend tahunan ────────────────────────────────────────
    const years = ext ? Object.keys(ext.byYear).sort() : [];
    const lineData = {
        labels: years,
        datasets: [
            { label: 'Luas Tanam (Ha)', data: years.map(y => ext?.byYear[y]?.luas ?? 0), borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.15)', fill: true, tension: 0.4, pointRadius: 5, pointBackgroundColor: '#16a34a' },
            { label: 'Bibit (×1000)', data: years.map(y => Math.round((ext?.byYear[y]?.bibit ?? 0) / 1000)), borderColor: '#0ea5e9', backgroundColor: 'rgba(14,165,233,0.1)', fill: false, tension: 0.4, pointRadius: 5, pointBackgroundColor: '#0ea5e9', yAxisID: 'y2' },
        ],
    };
    const lineOptions: ChartOptions<'line'> = {
        responsive: true,
        plugins: { legend: { position: 'top' } },
        scales: {
            y: { beginAtZero: true, ticks: { callback: v => `${v} Ha` }, grid: { color: 'rgba(22,163,74,0.08)' } },
            y2: { position: 'right', beginAtZero: true, ticks: { callback: v => `${v}K` }, grid: { display: false } },
            x: { grid: { display: false } },
        },
    };

    // ── Charts: per provinsi ─────────────────────────────────────────
    const provEntries = ext
        ? Object.entries(ext.byProvinsi).sort(([, a], [, b]) => b.luas - a.luas).slice(0, 12)
        : [];
    const hBarData = {
        labels: provEntries.map(([p]) => p),
        datasets: [{ label: 'Luas Tanam (Ha)', data: provEntries.map(([, v]) => v.luas), backgroundColor: provEntries.map((_, i) => PIE_COLORS[i % PIE_COLORS.length] + 'bb'), borderColor: provEntries.map((_, i) => PIE_COLORS[i % PIE_COLORS.length]), borderWidth: 2, borderRadius: 6 }],
    };
    const hBarOptions: ChartOptions<'bar'> = {
        indexAxis: 'y',
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { x: { beginAtZero: true, ticks: { callback: v => `${v} Ha` } }, y: { grid: { display: false } } },
    };

    // ── Charts: pola tanam ───────────────────────────────────────────
    const polaTanamEntries = ext ? Object.entries(ext.byPolaTanam) : [];
    const donutData = {
        labels: polaTanamEntries.map(([pt]) => pt),
        datasets: [{
            data: polaTanamEntries.map(([, v]) => v.bibit),
            backgroundColor: PIE_COLORS.slice(0, polaTanamEntries.length).map(c => c + 'cc'),
            borderColor: PIE_COLORS.slice(0, polaTanamEntries.length),
            borderWidth: 2, hoverOffset: 10,
        }],
    };
    const donutOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' as const },
            tooltip: { callbacks: { label: (ctx: { label: string; raw: unknown }) => ` ${ctx.label}: ${(ctx.raw as number).toLocaleString()} bibit` } },
        },
        cutout: '55%',
    };

    // ── Filtered lapangan ────────────────────────────────────────────
    const filteredLap = lapangan.filter(r => lapFilter === 'Semua' || r.status === lapFilter);

    // ── Stats lapangan ───────────────────────────────────────────────
    const avgSR = lapangan.length ? Math.round(lapangan.reduce((s, r) => s + (r.survivalRate ?? 0), 0) / lapangan.length) : 0;
    const berhasil = lapangan.filter(r => r.status === 'Berhasil').length;
    const rehab = lapangan.filter(r => r.status === 'Perlu Rehabilitasi').length;

    // ── Section header style ─────────────────────────────────────────
    const secH1: React.CSSProperties = {
        fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800, marginBottom: 12,
        background: 'var(--gradient-text)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
    };

    return (
        <div style={{ minHeight: '80vh', background: 'var(--gradient-bg)', backgroundAttachment: 'fixed' }}>

            {/* ── Page Hero ────────────────────────────────────────────── */}
            <section style={{
                background: 'linear-gradient(135deg,#16a34a 0%,#059669 55%,#047857 100%)',
                padding: '48px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.06, backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, color: 'white', marginBottom: 10 }}>
                    Monitoring &amp; Evaluasi
                </h1>
                <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: '0.97rem', maxWidth: 640, margin: '0 auto' }}>
                    Data capaian rehabilitasi mangrove program KKP: luasan tanam, bibit, tenaga kerja, serta kondisi lapangan per lokasi.
                </p>
            </section>

            {/* ── Tabs ─────────────────────────────────────────────────── */}
            <div style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', borderBottom: '2px solid rgba(22,163,74,0.12)', position: 'sticky', top: 64, zIndex: 40 }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 4, padding: '0 24px' }}>
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '14px 20px', border: 'none', cursor: 'pointer',
                                background: 'transparent', fontFamily: 'inherit', fontWeight: 700, fontSize: '0.9rem',
                                color: activeTab === tab ? '#16a34a' : 'var(--muted)',
                                borderBottom: activeTab === tab ? '3px solid #16a34a' : '3px solid transparent',
                                transition: 'all 0.2s',
                            }}
                        >
                            {tab === 'Dashboard' ? '📊 Dashboard' : '🌿 Monitoring Lapangan'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

                {/* ══════════════ TAB: DASHBOARD ══════════════*/}
                {activeTab === 'Dashboard' && (
                    <>
                        {/* Stat cards: existing + extended */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 28 }}>
                            <StatCard label="Total Target" value={`${totalTarget.toLocaleString()} Ha`} sub="Luas target tanam" color="#16a34a" />
                            <StatCard label="Total Realisasi" value={`${totalTanam.toLocaleString()} Ha`} sub="Luas terealisasi" color="#0ea5e9" />
                            <StatCard label="Capaian" value={`${pct}%`} sub="Target vs realisasi" color={pct >= 80 ? '#16a34a' : '#f59e0b'} />
                            {!extLoading && ext && <>
                                <StatCard label="Total Bibit" value={(ext.totals.totalBibit / 1000).toFixed(0) + 'K'} sub={ext.totals.totalBibit.toLocaleString() + ' batang'} color="#8b5cf6" />
                                <StatCard label="Tenaga Kerja" value={ext.totals.totalTK.toLocaleString()} sub="Total personil" color="#f59e0b" />
                                <StatCard label="Total HOK" value={ext.totals.totalHOK.toLocaleString()} sub="Hari Orang Kerja" color="#ec4899" />
                            </>}
                            <StatCard label="Kab / Kota" value={`${monData.length}`} sub="Lokasi rehabilitasi" color="#14b8a6" />
                        </div>

                        {/* Tren Tahunan */}
                        <SectionCard title="📈 Tren Tahunan – Luas Tanam &amp; Bibit">
                            {extLoading ? <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>⏳ Memuat...</div>
                                : <Line data={lineData} options={lineOptions} />}
                        </SectionCard>

                        {/* Per Provinsi */}
                        <SectionCard title="🗺️ Luas Tanam per Provinsi (Top 12)">
                            {extLoading ? <div style={{ textAlign: 'center', color: 'var(--muted)', padding: 32 }}>⏳ Memuat...</div>
                                : <Bar data={hBarData} options={hBarOptions} />}
                        </SectionCard>

                        {/* Pola Tanam */}
                        {!extLoading && ext && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                                <SectionCard title="🌱 Distribusi Pola Tanam (Bibit)">
                                    <div style={{ maxWidth: 320, margin: '0 auto' }}>
                                        <Doughnut data={donutData} options={donutOptions} />
                                    </div>
                                    {/* Summary table */}
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginTop: 20 }}>
                                        <thead>
                                            <tr style={{ background: 'var(--gradient-primary)', color: 'white' }}>
                                                <th style={{ padding: '8px 12px', textAlign: 'left', borderRadius: '6px 0 0 6px' }}>Pola Tanam</th>
                                                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Bibit</th>
                                                <th style={{ padding: '8px 12px', textAlign: 'right', borderRadius: '0 6px 6px 0' }}>Luas (Ha)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {polaTanamEntries.map(([pt, v], i) => (
                                                <tr key={pt} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(22,163,74,0.03)' }}>
                                                    <td style={{ padding: '8px 12px', color: 'var(--dark)', fontWeight: 600 }}>
                                                        <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: PIE_COLORS[i % PIE_COLORS.length], marginRight: 6 }} />
                                                        {pt}
                                                    </td>
                                                    <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--muted)' }}>{v.bibit.toLocaleString()}</td>
                                                    <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--muted)' }}>{v.luas.toLocaleString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </SectionCard>

                                {/* Target vs Realisasi chart */}
                                <SectionCard title="📊 Target vs Realisasi per Kabupaten (2023)">
                                    {loading ? (
                                        <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>⏳ Memuat data...</div>
                                    ) : (
                                        <Bar data={barData} options={{ ...barOptions, plugins: { ...barOptions.plugins, legend: { position: 'top' } }, maintainAspectRatio: true }} />
                                    )}
                                </SectionCard>
                            </div>
                        )}

                        {/* Table */}
                        {!loading && (
                            <SectionCard title="📋 Tabel Data Rehabilitasi Mangrove">
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                                        <thead>
                                            <tr style={{ background: 'var(--gradient-primary)', color: 'white' }}>
                                                {['Kabupaten', 'Provinsi', 'Tahun', 'Target (Ha)', 'Realisasi (Ha)', 'Capaian'].map((h, i, arr) => (
                                                    <th key={h} style={{ padding: '11px 14px', textAlign: i >= 3 ? 'right' : 'left', borderRadius: i === 0 ? '8px 0 0 8px' : i === arr.length - 1 ? '0 8px 8px 0' : 0 }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {monData.map((row, i) => {
                                                const p = row.luasTarget ? Math.round(((row.luasTanam ?? 0) / row.luasTarget) * 100) : 0;
                                                return (
                                                    <tr key={row.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(22,163,74,0.03)' }}>
                                                        <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--dark)' }}>{row.kabupaten}</td>
                                                        <td style={{ padding: '10px 14px', color: 'var(--muted)' }}>{row.provinsi}</td>
                                                        <td style={{ padding: '10px 14px', color: 'var(--muted)' }}>{row.tahun}</td>
                                                        <td style={{ padding: '10px 14px', textAlign: 'right', color: 'var(--dark)' }}>{(row.luasTarget ?? 0).toLocaleString()}</td>
                                                        <td style={{ padding: '10px 14px', textAlign: 'right', color: 'var(--dark)' }}>{(row.luasTanam ?? 0).toLocaleString()}</td>
                                                        <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                                                            <span style={{ color: p >= 80 ? '#16a34a' : '#f59e0b', fontWeight: 700 }}>{p}%</span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </SectionCard>
                        )}
                    </>
                )}

                {/* ══════════════ TAB: MONITORING LAPANGAN ══════════════*/}
                {activeTab === 'Monitoring Lapangan' && (
                    <>
                        {/* Stats summary */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 24 }}>
                            <StatCard label="Rata-rata Survival Rate" value={`${avgSR}%`} color={avgSR >= 75 ? '#16a34a' : '#f59e0b'} />
                            <StatCard label="Lokasi Berhasil" value={`${berhasil}`} sub="Status berhasil" color="#16a34a" />
                            <StatCard label="Perlu Rehabilitasi" value={`${rehab}`} sub="Butuh tindakan" color="#dc2626" />
                            <StatCard label="Total Lokasi" value={`${lapangan.length}`} sub="Titik monitoring" color="#0ea5e9" />
                        </div>

                        {/* Toolbar */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20, alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {(['Semua', 'Berhasil', 'Perlu Rehabilitasi', 'Dalam Pemantauan'] as const).map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setLapFilter(f)}
                                        style={{
                                            padding: '7px 16px', borderRadius: 50, border: '2px solid',
                                            borderColor: lapFilter === f ? '#16a34a' : 'rgba(22,163,74,0.2)',
                                            background: lapFilter === f ? '#16a34a' : 'transparent',
                                            color: lapFilter === f ? 'white' : 'var(--muted)',
                                            fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'inherit',
                                        }}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setShowForm(true)}
                                style={{
                                    padding: '10px 20px', background: 'var(--gradient-primary)',
                                    border: 'none', borderRadius: 50, color: 'white', fontWeight: 700,
                                    fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit',
                                    boxShadow: '0 4px 16px rgba(22,163,74,0.3)',
                                }}
                            >
                                + Input Data Lapangan
                            </button>
                        </div>

                        {/* Lapangan cards */}
                        {lapLoading ? (
                            <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>⏳ Memuat data lapangan...</div>
                        ) : filteredLap.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 60, color: 'var(--muted)' }}>Tidak ada data untuk filter ini.</div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
                                {filteredLap.map(rec => (
                                    <div key={rec.id} style={{
                                        background: 'rgba(255,255,255,0.95)', borderRadius: 20, padding: 24,
                                        boxShadow: 'var(--shadow)', border: '1px solid rgba(22,163,74,0.1)',
                                        transition: 'box-shadow 0.2s',
                                    }}>
                                        {/* Header */}
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 8 }}>
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--dark)', marginBottom: 2 }}>{rec.lokasi}</div>
                                                <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{rec.kabupaten}{rec.provinsi ? `, ${rec.provinsi}` : ''} {rec.tahun ? `– ${rec.tahun}` : ''}</div>
                                            </div>
                                            <StatusBadge status={rec.status} />
                                        </div>

                                        {/* Survival Rate */}
                                        <div style={{ marginBottom: 12 }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)', marginBottom: 5, textTransform: 'uppercase' }}>Survival Rate</div>
                                            <SurvivalBar value={rec.survivalRate} />
                                        </div>

                                        {/* Metrics */}
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                                            {[
                                                { label: 'Kerapatan', value: rec.kerapatan ? `${rec.kerapatan.toLocaleString()} pohon/Ha` : '–' },
                                                { label: 'Tinggi Tanaman', value: rec.tinggiTanaman ? `${rec.tinggiTanaman} cm` : '–' },
                                            ].map(m => (
                                                <div key={m.label} style={{ background: 'rgba(22,163,74,0.05)', borderRadius: 10, padding: '10px 14px' }}>
                                                    <div style={{ fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 600, marginBottom: 2 }}>{m.label}</div>
                                                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--dark)' }}>{m.value}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Foto placeholder */}
                                        {rec.fotoUrl ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img src={rec.fotoUrl} alt="Foto lokasi" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 10, marginBottom: 10 }} />
                                        ) : (
                                            <div style={{ background: 'linear-gradient(135deg,rgba(22,163,74,0.08),rgba(14,165,233,0.06))', height: 80, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: '0.8rem', marginBottom: 10 }}>
                                                📷 Belum ada dokumentasi foto
                                            </div>
                                        )}

                                        {/* Catatan */}
                                        {rec.catatan && (
                                            <div style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5, paddingTop: 8, borderTop: '1px solid rgba(22,163,74,0.1)' }}>
                                                💬 {rec.catatan}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ── Input Form Modal ─────────────────────────────────────── */}
            {showForm && (
                <div
                    onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
                        backdropFilter: 'blur(6px)', zIndex: 2000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
                    }}
                >
                    <div style={{
                        background: 'white', borderRadius: 24, padding: '32px 28px',
                        width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto',
                        boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, background: 'var(--gradient-text)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                🌿 Input Data Monitoring Lapangan
                            </h2>
                            <button onClick={() => setShowForm(false)} style={{ background: 'rgba(0,0,0,0.06)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: '1rem' }}>×</button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {([
                                { key: 'lokasi', label: 'Nama Lokasi *', type: 'text', required: true, placeholder: 'Blok A – Pantai ...' },
                                { key: 'kabupaten', label: 'Kabupaten/Kota', type: 'text', placeholder: 'Kab. ...' },
                                { key: 'provinsi', label: 'Provinsi', type: 'text', placeholder: 'Jawa Barat' },
                                { key: 'tahun', label: 'Tahun', type: 'number', placeholder: '2024' },
                                { key: 'survivalRate', label: 'Survival Rate (%)', type: 'number', placeholder: '0–100' },
                                { key: 'kerapatan', label: 'Kerapatan (pohon/Ha)', type: 'number', placeholder: '1500' },
                                { key: 'tinggiTanaman', label: 'Tinggi Tanaman (cm)', type: 'number', placeholder: '120' },
                                { key: 'fotoUrl', label: 'URL Foto Dokumentasi', type: 'url', placeholder: 'https://...' },
                            ] as { key: keyof typeof form; label: string; type: string; required?: boolean; placeholder: string }[]).map(field => (
                                <div key={field.key}>
                                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>{field.label}</label>
                                    <input
                                        type={field.type}
                                        required={field.required}
                                        placeholder={field.placeholder}
                                        value={form[field.key]}
                                        onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                                        style={{
                                            width: '100%', padding: '10px 14px', borderRadius: 10,
                                            border: '2px solid rgba(22,163,74,0.2)', fontSize: '0.9rem',
                                            outline: 'none', fontFamily: 'inherit', color: 'var(--dark)',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>
                            ))}

                            {/* Status select */}
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>Status Lokasi</label>
                                <select
                                    value={form.status}
                                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '2px solid rgba(22,163,74,0.2)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', color: 'var(--dark)' }}
                                >
                                    <option>Berhasil</option>
                                    <option>Perlu Rehabilitasi</option>
                                    <option>Dalam Pemantauan</option>
                                </select>
                            </div>

                            {/* Catatan */}
                            <div>
                                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--muted)', display: 'block', marginBottom: 5 }}>Catatan</label>
                                <textarea
                                    rows={3}
                                    placeholder="Deskripsi kondisi lapangan..."
                                    value={form.catatan}
                                    onChange={e => setForm(f => ({ ...f, catatan: e.target.value }))}
                                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '2px solid rgba(22,163,74,0.2)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', color: 'var(--dark)', resize: 'vertical', boxSizing: 'border-box' }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                style={{
                                    padding: '13px', background: 'var(--gradient-primary)',
                                    border: 'none', borderRadius: 12, color: 'white',
                                    fontWeight: 700, fontSize: '1rem', cursor: submitting ? 'not-allowed' : 'pointer',
                                    opacity: submitting ? 0.7 : 1, fontFamily: 'inherit',
                                    boxShadow: '0 4px 16px rgba(22,163,74,0.3)',
                                }}
                            >
                                {submitting ? '⏳ Menyimpan...' : '💾 Simpan Data'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
