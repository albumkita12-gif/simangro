import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { monitoringExtended } from '@/lib/schema';
import { sql } from 'drizzle-orm';

export async function GET() {
    try {
        const rows = await db.select().from(monitoringExtended).orderBy(monitoringExtended.tahun);

        // Aggregate totals
        const totalBibit = rows.reduce((s, r) => s + (r.jumlahBibit ?? 0), 0);
        const totalTK = rows.reduce((s, r) => s + (r.tenagaKerja ?? 0), 0);
        const totalHOK = rows.reduce((s, r) => s + (r.hok ?? 0), 0);
        const totalLuas = rows.reduce((s, r) => s + (r.luasTanam ?? 0), 0);

        // Group by year
        const byYear: Record<number, { bibit: number; tk: number; hok: number; luas: number }> = {};
        for (const r of rows) {
            const y = r.tahun;
            if (!byYear[y]) byYear[y] = { bibit: 0, tk: 0, hok: 0, luas: 0 };
            byYear[y].bibit += r.jumlahBibit ?? 0;
            byYear[y].tk += r.tenagaKerja ?? 0;
            byYear[y].hok += r.hok ?? 0;
            byYear[y].luas += r.luasTanam ?? 0;
        }

        // Group by provinsi
        const byProvinsi: Record<string, { bibit: number; tk: number; hok: number; luas: number }> = {};
        for (const r of rows) {
            const p = r.provinsi ?? 'Tidak Diketahui';
            if (!byProvinsi[p]) byProvinsi[p] = { bibit: 0, tk: 0, hok: 0, luas: 0 };
            byProvinsi[p].bibit += r.jumlahBibit ?? 0;
            byProvinsi[p].tk += r.tenagaKerja ?? 0;
            byProvinsi[p].hok += r.hok ?? 0;
            byProvinsi[p].luas += r.luasTanam ?? 0;
        }

        // Group by pola tanam
        const byPolaTanam: Record<string, { bibit: number; luas: number; count: number }> = {};
        for (const r of rows) {
            const pt = r.polaTanam ?? 'Tidak Diketahui';
            if (!byPolaTanam[pt]) byPolaTanam[pt] = { bibit: 0, luas: 0, count: 0 };
            byPolaTanam[pt].bibit += r.jumlahBibit ?? 0;
            byPolaTanam[pt].luas += r.luasTanam ?? 0;
            byPolaTanam[pt].count += 1;
        }

        return NextResponse.json({
            totals: { totalBibit, totalTK, totalHOK, totalLuas },
            byYear,
            byProvinsi,
            byPolaTanam,
            rows,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch extended monitoring data' }, { status: 500 });
    }
}
