import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { monitoringLapangan } from '@/lib/schema';
import { desc } from 'drizzle-orm';

export async function GET() {
    try {
        const data = await db
            .select()
            .from(monitoringLapangan)
            .orderBy(desc(monitoringLapangan.tahun));
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch lapangan data' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const record = await db
            .insert(monitoringLapangan)
            .values({
                lokasi: body.lokasi,
                kabupaten: body.kabupaten ?? null,
                provinsi: body.provinsi ?? null,
                tahun: body.tahun ? Number(body.tahun) : null,
                survivalRate: body.survivalRate ? Number(body.survivalRate) : null,
                kerapatan: body.kerapatan ? Number(body.kerapatan) : null,
                tinggiTanaman: body.tinggiTanaman ? Number(body.tinggiTanaman) : null,
                fotoUrl: body.fotoUrl ?? null,
                status: body.status ?? null,
                catatan: body.catatan ?? null,
            })
            .returning();
        return NextResponse.json(record[0], { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create lapangan record' }, { status: 500 });
    }
}
