import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { monitoringExtended, monitoringLapangan } from '../lib/schema';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
    console.log('🌱 Seeding extended monitoring data...');

    await db.delete(monitoringExtended);
    await db.insert(monitoringExtended).values([
        // 2020
        { kabupaten: 'Kab. Indramayu', provinsi: 'Jawa Barat', tahun: 2020, polaTanam: 'Jalur', jumlahBibit: 175000, tenagaKerja: 420, hok: 2100, luasTanam: 175 },
        { kabupaten: 'Kab. Brebes', provinsi: 'Jawa Tengah', tahun: 2020, polaTanam: 'Monokultur', jumlahBibit: 70000, tenagaKerja: 210, hok: 1050, luasTanam: 70 },
        { kabupaten: 'Kab. Serang', provinsi: 'Banten', tahun: 2020, polaTanam: 'Campuran', jumlahBibit: 55000, tenagaKerja: 165, hok: 825, luasTanam: 55 },
        { kabupaten: 'Kab. Mempawah', provinsi: 'Kalimantan Barat', tahun: 2020, polaTanam: 'Jalur', jumlahBibit: 33000, tenagaKerja: 99, hok: 495, luasTanam: 33 },
        { kabupaten: 'Kab. Gresik', provinsi: 'Jawa Timur', tahun: 2020, polaTanam: 'Sisipan', jumlahBibit: 39000, tenagaKerja: 117, hok: 585, luasTanam: 39 },
        // 2021
        { kabupaten: 'Kab. Probolinggo', provinsi: 'Jawa Timur', tahun: 2021, polaTanam: 'Monokultur', jumlahBibit: 119000, tenagaKerja: 357, hok: 1785, luasTanam: 119 },
        { kabupaten: 'Kab. Karawang', provinsi: 'Jawa Barat', tahun: 2021, polaTanam: 'Jalur', jumlahBibit: 49000, tenagaKerja: 147, hok: 735, luasTanam: 49 },
        { kabupaten: 'Kab. Situbondo', provinsi: 'Jawa Timur', tahun: 2021, polaTanam: 'Campuran', jumlahBibit: 49000, tenagaKerja: 147, hok: 735, luasTanam: 49 },
        { kabupaten: 'Kab. Lampung Timur', provinsi: 'Lampung', tahun: 2021, polaTanam: 'Monokultur', jumlahBibit: 35000, tenagaKerja: 105, hok: 525, luasTanam: 35 },
        { kabupaten: 'Kab. Sampang', provinsi: 'Jawa Timur', tahun: 2021, polaTanam: 'Sisipan', jumlahBibit: 36000, tenagaKerja: 108, hok: 540, luasTanam: 36 },
        // 2022
        { kabupaten: 'Kab. Indramayu', provinsi: 'Jawa Barat', tahun: 2022, polaTanam: 'Jalur', jumlahBibit: 175000, tenagaKerja: 525, hok: 2625, luasTanam: 175 },
        { kabupaten: 'Kab. Banyuwangi', provinsi: 'Jawa Timur', tahun: 2022, polaTanam: 'Campuran', jumlahBibit: 31000, tenagaKerja: 93, hok: 465, luasTanam: 31 },
        { kabupaten: 'Kab. Aceh Jaya', provinsi: 'Aceh', tahun: 2022, polaTanam: 'Monokultur', jumlahBibit: 24000, tenagaKerja: 72, hok: 360, luasTanam: 24 },
        { kabupaten: 'Kab. Gorontalo Utara', provinsi: 'Gorontalo', tahun: 2022, polaTanam: 'Jalur', jumlahBibit: 21000, tenagaKerja: 63, hok: 315, luasTanam: 21 },
        { kabupaten: 'Kab. Sidoarjo', provinsi: 'Jawa Timur', tahun: 2022, polaTanam: 'Sisipan', jumlahBibit: 20000, tenagaKerja: 60, hok: 300, luasTanam: 20 },
        // 2023
        { kabupaten: 'Kab. Pamekasan', provinsi: 'Jawa Timur', tahun: 2023, polaTanam: 'Jalur', jumlahBibit: 17000, tenagaKerja: 51, hok: 255, luasTanam: 17 },
        { kabupaten: 'Kab. Pemalang', provinsi: 'Jawa Tengah', tahun: 2023, polaTanam: 'Campuran', jumlahBibit: 16000, tenagaKerja: 48, hok: 240, luasTanam: 16 },
        { kabupaten: 'Kota Surabaya', provinsi: 'Jawa Timur', tahun: 2023, polaTanam: 'Monokultur', jumlahBibit: 15000, tenagaKerja: 45, hok: 225, luasTanam: 15 },
        { kabupaten: 'Kab. Cirebon', provinsi: 'Jawa Barat', tahun: 2023, polaTanam: 'Sisipan', jumlahBibit: 15000, tenagaKerja: 45, hok: 225, luasTanam: 15 },
        { kabupaten: 'Kab. Rembang', provinsi: 'Jawa Tengah', tahun: 2023, polaTanam: 'Jalur', jumlahBibit: 6000, tenagaKerja: 18, hok: 90, luasTanam: 6 },
        // 2024
        { kabupaten: 'Kab. Dompu', provinsi: 'Nusa Tenggara Barat', tahun: 2024, polaTanam: 'Campuran', jumlahBibit: 16000, tenagaKerja: 48, hok: 240, luasTanam: 16 },
        { kabupaten: 'Kab. Muna Barat', provinsi: 'Sulawesi Tenggara', tahun: 2024, polaTanam: 'Jalur', jumlahBibit: 15000, tenagaKerja: 45, hok: 225, luasTanam: 15 },
        { kabupaten: 'Kab. Banggai', provinsi: 'Sulawesi Tengah', tahun: 2024, polaTanam: 'Monokultur', jumlahBibit: 8000, tenagaKerja: 24, hok: 120, luasTanam: 8 },
        { kabupaten: 'Kab. Rote Ndao', provinsi: 'Nusa Tenggara Timur', tahun: 2024, polaTanam: 'Sisipan', jumlahBibit: 7000, tenagaKerja: 21, hok: 105, luasTanam: 7 },
        { kabupaten: 'Kab. Pohuwato', provinsi: 'Gorontalo', tahun: 2024, polaTanam: 'Campuran', jumlahBibit: 5000, tenagaKerja: 15, hok: 75, luasTanam: 5 },
    ]);

    console.log('✅ Extended monitoring seeded.');

    console.log('🌱 Seeding field monitoring (lapangan) data...');
    await db.delete(monitoringLapangan);
    await db.insert(monitoringLapangan).values([
        {
            lokasi: 'Blok A – Pantai Eretan Wetan',
            kabupaten: 'Kab. Indramayu',
            provinsi: 'Jawa Barat',
            tahun: 2022,
            survivalRate: 85,
            kerapatan: 1800,
            tinggiTanaman: 145,
            fotoUrl: null,
            status: 'Berhasil',
            catatan: 'Pertumbuhan optimal, tegakan rapat.',
        },
        {
            lokasi: 'Blok B – Muara Cimanuk',
            kabupaten: 'Kab. Indramayu',
            provinsi: 'Jawa Barat',
            tahun: 2022,
            survivalRate: 62,
            kerapatan: 1100,
            tinggiTanaman: 98,
            fotoUrl: null,
            status: 'Perlu Rehabilitasi',
            catatan: 'Tingkat kematian tinggi akibat abrasi dan intrusi air asin.',
        },
        {
            lokasi: 'Kawasan Mangrove Pancer',
            kabupaten: 'Kab. Banyuwangi',
            provinsi: 'Jawa Timur',
            tahun: 2022,
            survivalRate: 78,
            kerapatan: 1600,
            tinggiTanaman: 130,
            fotoUrl: null,
            status: 'Berhasil',
            catatan: 'Kondisi baik, butuh penyulaman maks. 20%.',
        },
        {
            lokasi: 'Delta Mahakam – Petak 12',
            kabupaten: 'Kab. Kutai Kartanegara',
            provinsi: 'Kalimantan Timur',
            tahun: 2023,
            survivalRate: 70,
            kerapatan: 1250,
            tinggiTanaman: 110,
            fotoUrl: null,
            status: 'Dalam Pemantauan',
            catatan: 'Monitoring triwulan. Pertumbuhan sesuai target.',
        },
        {
            lokasi: 'Teluk Bintuni – Zona 3',
            kabupaten: 'Kab. Teluk Bintuni',
            provinsi: 'Papua Barat',
            tahun: 2023,
            survivalRate: 91,
            kerapatan: 2000,
            tinggiTanaman: 180,
            fotoUrl: null,
            status: 'Berhasil',
            catatan: 'Ekosistem terbaik, menjadi percontohan nasional.',
        },
        {
            lokasi: 'Taman Wisata Alam Pelawangan',
            kabupaten: 'Kab. Gresik',
            provinsi: 'Jawa Timur',
            tahun: 2021,
            survivalRate: 55,
            kerapatan: 900,
            tinggiTanaman: 75,
            fotoUrl: null,
            status: 'Perlu Rehabilitasi',
            catatan: 'Serangan hama dan sampling perambahan mengancam tegakan.',
        },
        {
            lokasi: 'Pantai Labu – Petak 5',
            kabupaten: 'Kab. Deli Serdang',
            provinsi: 'Sumatera Utara',
            tahun: 2023,
            survivalRate: 82,
            kerapatan: 1700,
            tinggiTanaman: 155,
            fotoUrl: null,
            status: 'Berhasil',
            catatan: 'Hasil rehabilitasi pascabanjir 2021 memuaskan.',
        },
        {
            lokasi: 'Teluk Segara Anakan',
            kabupaten: 'Kab. Cilacap',
            provinsi: 'Jawa Tengah',
            tahun: 2024,
            survivalRate: 74,
            kerapatan: 1400,
            tinggiTanaman: 95,
            fotoUrl: null,
            status: 'Dalam Pemantauan',
            catatan: 'Pasang surut ekstrim mempengaruhi pertumbuhan.',
        },
    ]);

    console.log('✅ Lapangan monitoring seeded.');
    console.log('🎉 All done!');
}

main().catch(console.error);
