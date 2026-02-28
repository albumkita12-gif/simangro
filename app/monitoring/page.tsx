'use client';
import { useEffect, useState, useRef } from 'react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement,
    Title, Tooltip, Legend, type ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface MonData {
    id: number;
    kabupaten: string;
    provinsi: string | null;
    luasTarget: number | null;
    luasTanam: number | null;
    tahun: number | null;
}

export default function MonitoringPage() {
    const [data, setData] = useState<MonData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/monitoring')
            .then(r => r.json())
            .then(d => { setData(d); setLoading(false); });
    }, []);

    const labels = data.map(d => d.kabupaten);
    const chartData = {
        labels,
        datasets: [
            {
                label: 'Target (Ha)',
                data: data.map(d => d.luasTarget ?? 0),
                backgroundColor: 'rgba(22, 163, 74, 0.3)',
                borderColor: 'rgba(22, 163, 74, 0.8)',
                borderWidth: 2,
                borderRadius: 8,
            },
            {
                label: 'Realisasi (Ha)',
                data: data.map(d => d.luasTanam ?? 0),
                backgroundColor: 'rgba(14, 165, 233, 0.35)',
                borderColor: 'rgba(14, 165, 233, 0.9)',
                borderWidth: 2,
                borderRadius: 8,
            },
        ],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        plugins: {
            legend: { position: 'top' as const },
            title: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${ctx.raw?.toLocaleString()} Ha`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (v) => `${v} Ha`,
                },
                grid: { color: 'rgba(22,163,74,0.08)' },
            },
            x: {
                grid: { display: false },
                ticks: { maxRotation: 45 },
            },
        },
    };

    const totalTarget = data.reduce((s, d) => s + (d.luasTarget ?? 0), 0);
    const totalTanam = data.reduce((s, d) => s + (d.luasTanam ?? 0), 0);
    const pct = totalTarget > 0 ? Math.round((totalTanam / totalTarget) * 100) : 0;

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
                }}>Monitoring & Evaluasi</h1>
                <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: 600, margin: '0 auto' }}>
                    Data capaian rehabilitasi mangrove per kabupaten dalam program KKP tahun 2023.
                </p>
            </div>

            {/* Stats Cards */}
            {!loading && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
                    {[
                        { label: 'Total Target', value: `${totalTarget.toLocaleString()} Ha`, color: '#16a34a' },
                        { label: 'Total Realisasi', value: `${totalTanam.toLocaleString()} Ha`, color: '#0ea5e9' },
                        { label: 'Capaian', value: `${pct}%`, color: pct >= 80 ? '#16a34a' : '#f59e0b' },
                        { label: 'Total Kabupaten', value: `${data.length}`, color: '#8b5cf6' },
                    ].map(s => (
                        <div key={s.label} style={{
                            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
                            borderRadius: 20, padding: '28px 24px', textAlign: 'center',
                            boxShadow: 'var(--shadow)', border: '1px solid rgba(255,255,255,0.3)',
                        }}>
                            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: s.color, marginBottom: 8 }}>{s.value}</div>
                            <div style={{ color: 'var(--muted)', fontWeight: 600, fontSize: '0.9rem' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Chart */}
            <div style={{
                background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
                borderRadius: 24, padding: '32px', marginBottom: 32,
                boxShadow: 'var(--shadow)', border: '1px solid rgba(22,163,74,0.1)',
            }}>
                <h3 style={{
                    fontSize: '1.4rem', fontWeight: 800, marginBottom: 24, textAlign: 'center',
                    background: 'var(--gradient-text)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>Target vs Realisasi Luasan Mangrove per Kabupaten (2023)</h3>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>⏳ Memuat data...</div>
                ) : (
                    <Bar data={chartData} options={options} />
                )}
            </div>

            {/* Table */}
            {!loading && (
                <div style={{
                    background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
                    borderRadius: 24, padding: '32px', marginBottom: 40,
                    boxShadow: 'var(--shadow)', border: '1px solid rgba(22,163,74,0.1)',
                    overflowX: 'auto',
                }}>
                    <h3 style={{
                        fontSize: '1.4rem', fontWeight: 800, marginBottom: 24,
                        background: 'var(--gradient-text)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    }}>Tabel Data Lengkap</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                        <thead>
                            <tr style={{ background: 'var(--gradient-primary)', color: 'white' }}>
                                <th style={{ padding: '12px 16px', textAlign: 'left', borderRadius: '8px 0 0 8px' }}>Kabupaten</th>
                                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Provinsi</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Target (Ha)</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Realisasi (Ha)</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right', borderRadius: '0 8px 8px 0' }}>Capaian</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, i) => {
                                const pctRow = row.luasTarget ? Math.round(((row.luasTanam ?? 0) / row.luasTarget) * 100) : 0;
                                return (
                                    <tr key={row.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(22,163,74,0.03)' }}>
                                        <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--dark)' }}>{row.kabupaten}</td>
                                        <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{row.provinsi}</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--dark)' }}>{(row.luasTarget ?? 0).toLocaleString()}</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--dark)' }}>{(row.luasTanam ?? 0).toLocaleString()}</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                            <span style={{
                                                color: pctRow >= 80 ? '#16a34a' : '#f59e0b',
                                                fontWeight: 700,
                                            }}>{pctRow}%</span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
