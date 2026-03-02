'use client';
import { useEffect, useRef, useState } from 'react';
import {
    Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartData
} from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// ─── Hardcoded CSV data (Luasan Penanaman Mangrove per Kabupaten) ─────────────
const chartRawData: { name: string; value: number }[] = [
    { name: 'Kab. Indramayu', value: 350.71 },
    { name: 'Kab. Probolinggo', value: 239.03 },
    { name: 'Kab. Brebes', value: 143.15 },
    { name: 'Kab. Serang', value: 113.14 },
    { name: 'Kab. Karawang', value: 98.9 },
    { name: 'Kab. Situbondo', value: 98.59 },
    { name: 'Kab. Gresik', value: 79.87 },
    { name: 'Kab. Sampang', value: 73.13 },
    { name: 'Kab. Lampung Timur', value: 70.89 },
    { name: 'Kab. Mempawah', value: 67.12 },
    { name: 'Kab. Banyuwangi', value: 63 },
    { name: 'Kab. Aceh Jaya', value: 49.5 },
    { name: 'Kab. Gorontalo Utara', value: 42.88 },
    { name: 'Kab. Sidoarjo', value: 40.95 },
    { name: 'Kab. Pamekasan', value: 34.08 },
    { name: 'Kab. Pemalang', value: 33.7 },
    { name: 'Kab. Dompu', value: 32.6 },
    { name: 'Kab. Muna Barat', value: 30.7 },
    { name: 'Kota Surabaya', value: 30.51 },
    { name: 'Kab. Cirebon', value: 30.14 },
    { name: 'Kab. Pasuruan', value: 24.33 },
    { name: 'Kota Baru', value: 22 },
    { name: 'Kab. Singkawang', value: 20.01 },
    { name: 'Kab. Pulang Pisau', value: 20 },
    { name: 'Kab. Tanah Laut', value: 20 },
    { name: 'Kab. Bima', value: 19.6 },
    { name: 'Kab. Lamongan', value: 18.34 },
    { name: 'Kota Pasuruan', value: 16.1 },
    { name: 'Kab. Banggai', value: 16 },
    { name: 'Kab. Rote Ndao', value: 14 },
    { name: 'Kab. Penajam Pasir Utara', value: 13.64 },
    { name: 'Kab. Sumbawa Besar', value: 13.4 },
    { name: 'Kab. Bombana', value: 13.1 },
    { name: 'Kab. Pesawaran', value: 13 },
    { name: 'Kab. Rembang', value: 12.12 },
    { name: 'Kab. Minahasa Tenggara', value: 11.8 },
    { name: 'Kab. Pohuwato', value: 11.61 },
    { name: 'Kab. Aceh Besar', value: 10.46 },
    { name: 'Kab. Tanjung Jabung Barat', value: 10 },
    { name: 'Kab. Pangandaran', value: 10 },
    { name: 'Kab. Pati', value: 10 },
    { name: 'Kab. Sambas', value: 10 },
    { name: 'Kab. Parigi Moutong', value: 10 },
    { name: 'Kab. Kolaka', value: 10 },
    { name: 'Kab. Lombok Barat', value: 10 },
    { name: 'Kab. Demak', value: 9 },
    { name: 'Kota Langsa', value: 7.89 },
    { name: 'Kab. Pesisir Selatan', value: 7 },
    { name: 'Kab. Pasang Kayu', value: 6.15 },
    { name: 'Kab. Sumbawa Barat', value: 6 },
    { name: 'Kab. Kebumen', value: 5.84 },
    { name: 'Kab. Aceh Utara', value: 4.02 },
    { name: 'Kab. Aceh Selatan', value: 3.18 },
    { name: 'Kota Probolinggo', value: 3.1 },
    { name: 'Kab. Pandeglang', value: 2 },
    { name: 'Kota Bima', value: 2 },
];

// Generate distinct colors
function generateColors(count: number) {
    const palette = [
        '#16a34a', '#22c55e', '#0ea5e9', '#059669', '#6366f1', '#f59e0b', '#10b981', '#3b82f6',
        '#a78bfa', '#f97316', '#ec4899', '#14b8a6', '#84cc16', '#e11d48', '#8b5cf6', '#06b6d4',
        '#fbbf24', '#4ade80', '#60a5fa', '#f472b6', '#34d399', '#fb923c', '#818cf8', '#2dd4bf',
        '#facc15', '#a3e635', '#38bdf8', '#c084fc', '#fb7185', '#4ade80',
    ];
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
        colors.push(palette[i % palette.length]);
    }
    return colors;
}

// Top N for pie, rest grouped as "Lainnya"
const TOP_N = 15;
function buildChartData(): ChartData<'pie'> {
    const sorted = [...chartRawData].sort((a, b) => b.value - a.value);
    const top = sorted.slice(0, TOP_N);
    const rest = sorted.slice(TOP_N);
    const othersTotal = rest.reduce((s, d) => s + d.value, 0);
    const labels = [...top.map(d => d.name), ...(othersTotal > 0 ? ['Lainnya'] : [])];
    const values = [...top.map(d => d.value), ...(othersTotal > 0 ? [othersTotal] : [])];
    const colors = generateColors(labels.length);
    return {
        labels,
        datasets: [{
            data: values,
            backgroundColor: colors.map(c => c + 'cc'),
            borderColor: colors,
            borderWidth: 2,
            hoverOffset: 12,
        }],
    };
}

const PIE_DATA = buildChartData();
const TOTAL_HA = chartRawData.reduce((s, d) => s + d.value, 0);

// ─── Legend item component ────────────────────────────────────────────────────
function LegendDot({ color, label }: { color: string; label: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, backgroundColor: color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{label}</span>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PetaAksiPage() {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMapRef = useRef<import('leaflet').Map | null>(null);
    const [filterProv, setFilterProv] = useState('');
    const [filterKab, setFilterKab] = useState('');
    const [filterYear, setFilterYear] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [provinces, setProvinces] = useState<string[]>([]);
    const [kabupatens, setKabupatens] = useState<string[]>([]);
    const [years, setYears] = useState<string[]>([]);
    const [mapReady, setMapReady] = useState(false);

    // Store layers refs
    const layersRef = useRef<{
        penanaman: import('leaflet').GeoJSON | null;
        prpep: import('leaflet').GeoJSON | null;
        produk: import('leaflet').GeoJSON | null;
        allFeatures: { props: Record<string, unknown>; layer: import('leaflet').Layer }[];
    }>({ penanaman: null, prpep: null, produk: null, allFeatures: [] });

    useEffect(() => {
        if (typeof window === 'undefined' || !mapRef.current || leafletMapRef.current) return;

        let isMounted = true;

        import('leaflet').then(async (L) => {
            if (!isMounted || !mapRef.current) return;

            // Fix default marker icons
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            });

            const map = L.map(mapRef.current!, {
                center: [-2.5, 118],
                zoom: 5,
                zoomControl: true,
            });
            leafletMapRef.current = map;

            // Tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(map);

            const provSet = new Set<string>();
            const kabSet = new Set<string>();
            const yearSet = new Set<string>();
            const allFeatures: { props: Record<string, unknown>; layer: import('leaflet').Layer }[] = [];

            // Helper to build popup HTML
            function makePrpepPopup(props: Record<string, unknown>) {
                return `
                    <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 220px;">
                        <div style="background: linear-gradient(135deg,#16a34a,#22c55e); color: white; padding: 10px 14px; border-radius: 8px 8px 0 0; font-weight: 700; font-size: 1rem; margin: -12px -12px 10px;">
                            📍 Lokasi PRPEP
                        </div>
                        <table style="width:100%; border-collapse:collapse; font-size: 0.85rem;">
                            ${row('Provinsi', props.Provinsi)}
                            ${row('Kabupaten', props.Kabupaten)}
                            ${row('Kecamatan', props.Kecamatan)}
                            ${row('Desa', props.Desa)}
                            ${row('Penerima Bantuan', props.Penerima_Bantuan)}
                            ${row('Bentuk Bantuan', props.Bantuan)}
                            ${row('Tahun', props.Tahun)}
                        </table>
                    </div>`;
            }

            function makePenanamanPopup(props: Record<string, unknown>) {
                return `
                    <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 220px;">
                        <div style="background: linear-gradient(135deg,#0ea5e9,#38bdf8); color: white; padding: 10px 14px; border-radius: 8px 8px 0 0; font-weight: 700; font-size: 1rem; margin: -12px -12px 10px;">
                            🌿 Penanaman Mangrove
                        </div>
                        <table style="width:100%; border-collapse:collapse; font-size: 0.85rem;">
                            ${row('Provinsi', props.Provinsi)}
                            ${row('Kabupaten', props.Kabupaten || props.Kabupaten_K)}
                            ${row('Kecamatan', props.Kecamatan)}
                            ${row('Desa', props.Desa)}
                            ${row('Luas (Ha)', props.Luas_Ha || props.LUAS_HA)}
                            ${row('Tahun', props.Tahun || props.TAHUN)}
                        </table>
                    </div>`;
            }

            function makeProdukPopup(props: Record<string, unknown>) {
                return `
                    <div style="font-family: 'Plus Jakarta Sans', sans-serif; min-width: 220px;">
                        <div style="background: linear-gradient(135deg,#f59e0b,#fbbf24); color: white; padding: 10px 14px; border-radius: 8px 8px 0 0; font-weight: 700; font-size: 1rem; margin: -12px -12px 10px;">
                            🏭 Produk Turunan
                        </div>
                        <table style="width:100%; border-collapse:collapse; font-size: 0.85rem;">
                            ${row('Provinsi', props.Provinsi)}
                            ${row('Kabupaten', props.Kabupaten)}
                            ${row('Kelompok', props.Kelompok)}
                            ${row('Produk', props.Produk)}
                            ${row('Tahun', props.Tahun)}
                        </table>
                    </div>`;
            }

            function row(label: string, value: unknown) {
                if (!value) return '';
                return `<tr>
                    <td style="padding:4px 8px; color:#64748b; font-weight:600; white-space:nowrap;">${label}</td>
                    <td style="padding:4px 8px; color:#0f172a;">${value}</td>
                </tr>`;
            }

            const PRPEP_ICON = L.divIcon({
                className: '',
                html: `<div style="width:10px;height:10px;border-radius:50%;background:#16a34a;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
                iconSize: [10, 10],
                iconAnchor: [5, 5],
            });

            const PRODUK_ICON = L.divIcon({
                className: '',
                html: `<div style="width:10px;height:10px;border-radius:50%;background:#f59e0b;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
                iconSize: [10, 10],
                iconAnchor: [5, 5],
            });

            try {
                // 1. Penanaman Mangrove (GeoJSON polygons/points)
                const penRes = await fetch('https://simangro.vercel.app/shp/Penanaman_Mangrove_KKP_2020_2024.geojson');
                const penData = await penRes.json();
                const penLayer = L.geoJSON(penData, {
                    style: {
                        color: '#0ea5e9',
                        fillColor: '#0ea5e9',
                        fillOpacity: 0.3,
                        weight: 1.5,
                    },
                    pointToLayer: (_feature, latlng) => L.circleMarker(latlng, {
                        radius: 6, color: '#0ea5e9', fillColor: '#38bdf8', fillOpacity: 0.7, weight: 2,
                    }),
                    onEachFeature: (feature, layer) => {
                        const p = feature.properties as Record<string, unknown>;
                        layer.bindPopup(makePenanamanPopup(p));
                        const prov = String(p.Provinsi || '').trim();
                        const kab = String(p.Kabupaten || p.Kabupaten_K || '').trim();
                        const yr = String(p.Tahun || p.TAHUN || '').trim();
                        if (prov) provSet.add(prov);
                        if (kab) kabSet.add(kab);
                        if (yr) yearSet.add(yr);
                        allFeatures.push({ props: p, layer });
                    },
                }).addTo(map);
                layersRef.current.penanaman = penLayer;

                // 2. Lokasi PRPEP (JSON with point features)
                const prpepRes = await fetch('https://simangro.vercel.app/shp/Lokasi_PRPEP_2015_2024.json');
                const prpepData = await prpepRes.json();
                const prpepLayer = L.geoJSON(prpepData, {
                    pointToLayer: (_feature, latlng) => L.marker(latlng, { icon: PRPEP_ICON }),
                    onEachFeature: (feature, layer) => {
                        const p = feature.properties as Record<string, unknown>;
                        layer.bindPopup(makePrpepPopup(p));
                        const prov = String(p.Provinsi || '').trim();
                        const kab = String(p.Kabupaten || '').trim();
                        const yr = String(p.Tahun || '').trim();
                        if (prov) provSet.add(prov);
                        if (kab) kabSet.add(kab);
                        if (yr) yearSet.add(yr);
                        allFeatures.push({ props: p, layer });
                    },
                }).addTo(map);
                layersRef.current.prpep = prpepLayer;

                // 3. Produk Turunan
                const prodRes = await fetch('https://simangro.vercel.app/shp/Produk_Turuna_2020_2024.json');
                const prodData = await prodRes.json();
                const prodLayer = L.geoJSON(prodData, {
                    pointToLayer: (_feature, latlng) => L.marker(latlng, { icon: PRODUK_ICON }),
                    onEachFeature: (feature, layer) => {
                        const p = feature.properties as Record<string, unknown>;
                        layer.bindPopup(makeProdukPopup(p));
                        const prov = String(p.Provinsi || '').trim();
                        const kab = String(p.Kabupaten || '').trim();
                        const yr = String(p.Tahun || '').trim();
                        if (prov) provSet.add(prov);
                        if (kab) kabSet.add(kab);
                        if (yr) yearSet.add(yr);
                        allFeatures.push({ props: p, layer });
                    },
                }).addTo(map);
                layersRef.current.produk = prodLayer;

                // Legend
                const legend = (L.control as unknown as ({ position }: { position: string }) => import('leaflet').Control)({ position: 'bottomright' });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (legend as any).onAdd = () => {
                    const div = L.DomUtil.create('div');
                    div.innerHTML = `
                        <div style="background:white;padding:12px 16px;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,0.15);font-family:'Plus Jakarta Sans',sans-serif;font-size:0.8rem;min-width:180px">
                            <div style="font-weight:700;color:#0f172a;margin-bottom:8px">Legenda</div>
                            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                                <div style="width:14px;height:14px;border-radius:50%;background:#0ea5e9;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.2)"></div>
                                <span style="color:#64748b">Penanaman Mangrove</span>
                            </div>
                            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
                                <div style="width:14px;height:14px;border-radius:50%;background:#16a34a;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.2)"></div>
                                <span style="color:#64748b">Lokasi PRPEP</span>
                            </div>
                            <div style="display:flex;align-items:center;gap:8px">
                                <div style="width:14px;height:14px;border-radius:50%;background:#f59e0b;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.2)"></div>
                                <span style="color:#64748b">Produk Turunan</span>
                            </div>
                        </div>`;
                    return div;
                };
                legend.addTo(map);

            } catch (err) {
                console.error('Failed to load map data:', err);
            }

            layersRef.current.allFeatures = allFeatures;
            if (isMounted) {
                setProvinces([...provSet].sort());
                setKabupatens([...kabSet].sort());
                setYears([...yearSet].sort((a, b) => Number(a) - Number(b)));
                setMapReady(true);
            }
        });

        return () => {
            isMounted = false;
            if (leafletMapRef.current) {
                leafletMapRef.current.remove();
                leafletMapRef.current = null;
            }
        };
    }, []);

    // Apply filters whenever filter state changes
    useEffect(() => {
        if (!mapReady || !leafletMapRef.current) return;
        const map = leafletMapRef.current;
        const { allFeatures } = layersRef.current;

        const matchedBounds: import('leaflet').LatLngBounds[] = [];

        allFeatures.forEach(({ props, layer }) => {
            const prov = String(props.Provinsi || '').toLowerCase();
            const kab = String(
                props.Kabupaten || props.Kabupaten_K || ''
            ).toLowerCase();
            const yr = String(props.Tahun || props.TAHUN || '').toLowerCase();

            const matchProv = !filterProv || prov === filterProv.toLowerCase();
            const matchKab = !filterKab || kab === filterKab.toLowerCase();
            const matchYr = !filterYear || yr === filterYear.toLowerCase();
            const matchSearch = !searchQuery || Object.values(props).some(
                v => String(v).toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (matchProv && matchKab && matchYr && matchSearch) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (layer as any).setStyle?.({ opacity: 1, fillOpacity: 0.7 });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const bounds = (layer as any).getBounds?.();
                if (bounds) matchedBounds.push(bounds);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const latlng = (layer as any).getLatLng?.();
                if (latlng) {
                    // point marker – create a tiny bounds
                    import('leaflet').then(L => {
                        matchedBounds.push(L.latLngBounds([latlng, latlng]));
                    });
                }
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (layer as any).setStyle?.({ opacity: 0.1, fillOpacity: 0.05 });
            }
        });

        if (matchedBounds.length > 0) {
            import('leaflet').then(L => {
                const combined = matchedBounds.reduce((acc, b) => acc.extend(b));
                const isFiltering = filterProv || filterKab || filterYear || searchQuery;
                if (isFiltering) map.fitBounds(combined, { padding: [40, 40] });
            });
        } else if (!filterProv && !filterKab && !filterYear && !searchQuery) {
            map.setView([-2.5, 118], 5);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterProv, filterKab, filterYear, searchQuery, mapReady]);

    const handleClear = () => {
        setFilterProv('');
        setFilterKab('');
        setFilterYear('');
        setSearchQuery('');
        leafletMapRef.current?.setView([-2.5, 118], 5);
    };

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    label: (ctx: any) => ` ${ctx.label}: ${ctx.raw.toLocaleString('id-ID')} Ha`,
                },
            },
        },
    };

    return (
        <>
            {/* ── Leaflet CSS ──────────────────────────────────────────── */}
            <style>{`
                .leaflet-container { font-family: 'Plus Jakarta Sans', sans-serif !important; }
                .leaflet-popup-content-wrapper { border-radius: 12px !important; padding: 2px !important; box-shadow: 0 8px 32px rgba(0,0,0,0.15) !important; }
                .leaflet-popup-content { margin: 12px !important; }
                .leaflet-popup-tip { background: white !important; }
            `}</style>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

            {/* ── Hero Header ─────────────────────────────────────────── */}
            <section style={{
                background: 'linear-gradient(135deg, #16a34a 0%, #059669 50%, #047857 100%)',
                padding: '48px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.05,
                    backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: 'white', marginBottom: 12, lineHeight: 1.2 }}>
                        Peta Aksi Mangrove
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: '1rem', maxWidth: 700, margin: '0 auto', lineHeight: 1.7 }}>
                        Jelajahi upaya pelestarian mangrove yang dilakukan oleh Kementerian Kelautan dan Perikanan, mulai dari kegiatan penanaman, pusat restorasi, hingga pengembangan berbagai produk turunan mangrove.
                    </p>
                </div>
            </section>

            {/* ── Filter Bar ───────────────────────────────────────────── */}
            <section style={{
                background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(22,163,74,0.12)',
                padding: '16px 24px', position: 'sticky', top: 64, zIndex: 50,
                boxShadow: '0 4px 16px rgba(22,163,74,0.08)',
            }}>
                <div style={{
                    maxWidth: 1200, margin: '0 auto',
                    display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center',
                }}>
                    {/* Search */}
                    <input
                        id="searchBox"
                        type="text"
                        placeholder="🔍 Cari lokasi, kelompok, desa..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{
                            flex: '1 1 200px', padding: '10px 16px', borderRadius: 50,
                            border: '2px solid rgba(22,163,74,0.2)', fontSize: '0.9rem',
                            background: 'rgba(240,253,244,0.8)', outline: 'none',
                            transition: 'border-color 0.2s', color: 'var(--dark)',
                        }}
                    />
                    {/* Provinsi */}
                    <select
                        id="filterProv"
                        value={filterProv}
                        onChange={e => { setFilterProv(e.target.value); setFilterKab(''); }}
                        style={selectStyle}
                    >
                        <option value="">Semua Provinsi</option>
                        {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {/* Kabupaten */}
                    <select
                        id="filterKab"
                        value={filterKab}
                        onChange={e => setFilterKab(e.target.value)}
                        style={selectStyle}
                    >
                        <option value="">Semua Kabupaten</option>
                        {kabupatens.map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                    {/* Tahun */}
                    <select
                        id="filterYear"
                        value={filterYear}
                        onChange={e => setFilterYear(e.target.value)}
                        style={selectStyle}
                    >
                        <option value="">Semua Tahun</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                    {/* Clear */}
                    <button
                        onClick={handleClear}
                        style={{
                            padding: '10px 20px', borderRadius: 50,
                            background: 'linear-gradient(135deg,#16a34a,#22c55e)',
                            border: 'none', color: 'white', fontWeight: 700,
                            fontSize: '0.85rem', cursor: 'pointer', transition: 'opacity 0.2s',
                            fontFamily: 'inherit',
                        }}
                    >
                        Reset
                    </button>
                </div>
            </section>

            {/* ── Map ────────────────────────────────────────────────────── */}
            <section style={{ padding: '24px', background: 'transparent' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{
                        borderRadius: 20, overflow: 'hidden',
                        boxShadow: '0 8px 40px rgba(22,163,74,0.18)',
                        border: '2px solid rgba(22,163,74,0.12)',
                    }}>
                        {!mapReady && (
                            <div style={{
                                height: 60, display: 'flex', alignItems: 'center',
                                justifyContent: 'center', background: 'rgba(240,253,244,0.9)',
                                color: 'var(--muted)', fontWeight: 600, fontSize: '0.9rem',
                            }}>
                                ⏳ Memuat data peta...
                            </div>
                        )}
                        <div
                            ref={mapRef}
                            id="map"
                            style={{ width: '100%', height: 'clamp(400px, 60vh, 600px)' }}
                        />
                    </div>
                </div>
            </section>

            {/* ── Stats + Pie Chart ────────────────────────────────────── */}
            <section style={{ padding: '0 24px 48px', background: 'transparent' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>

                    {/* Stat Card */}
                    <div style={{
                        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
                        borderRadius: 20, padding: '28px 32px', marginBottom: 28,
                        boxShadow: 'var(--shadow)', border: '1px solid rgba(22,163,74,0.1)',
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                        gap: 20, textAlign: 'center',
                    }}>
                        {[
                            { label: 'Total Luasan', value: `${TOTAL_HA.toLocaleString('id-ID')} Ha`, color: '#16a34a' },
                            { label: 'Kabupaten/Kota', value: `${chartRawData.length}`, color: '#0ea5e9' },
                            { label: 'Tahun Program', value: '2020–2024', color: '#8b5cf6' },
                            { label: 'Kementerian', value: 'KKP', color: '#f59e0b' },
                        ].map(s => (
                            <div key={s.label}>
                                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, marginBottom: 4 }}>
                                    {s.value}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Chart Container */}
                    <div style={{
                        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
                        borderRadius: 20, padding: '32px',
                        boxShadow: 'var(--shadow)', border: '1px solid rgba(22,163,74,0.1)',
                    }}>
                        <h2 style={{
                            fontSize: '1.4rem', fontWeight: 800, marginBottom: 8, textAlign: 'center',
                            background: 'var(--gradient-text)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                        }}>
                            Luasan Penanaman Mangrove per Kabupaten &amp; Kota
                        </h2>
                        <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem', marginBottom: 28 }}>
                            Data Program Rehabilitasi Mangrove Indonesia (Hektar)
                        </p>

                        <div style={{
                            display: 'flex', flexWrap: 'wrap', gap: 32,
                            justifyContent: 'center', alignItems: 'flex-start',
                        }}>
                            {/* Pie */}
                            <div style={{ width: 'clamp(240px, 40%, 360px)', flexShrink: 0 }}>
                                <Pie data={PIE_DATA} options={pieOptions} />
                            </div>
                            {/* Legend */}
                            <div style={{
                                flex: '1 1 260px', display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                gap: '8px 20px', alignContent: 'start',
                                paddingTop: 8,
                            }}>
                                {PIE_DATA.labels?.map((label, i) => (
                                    <LegendDot
                                        key={String(label)}
                                        color={String((PIE_DATA.datasets[0].borderColor as string[])[i])}
                                        label={`${label} (${(PIE_DATA.datasets[0].data[i] as number).toLocaleString('id-ID')} Ha)`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

const selectStyle: React.CSSProperties = {
    flex: '1 1 140px', padding: '10px 14px', borderRadius: 50,
    border: '2px solid rgba(22,163,74,0.2)', fontSize: '0.85rem',
    background: 'rgba(240,253,244,0.8)', outline: 'none', color: 'var(--dark)',
    cursor: 'pointer', fontFamily: 'inherit',
};
