import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { monitoringData } from '@/lib/schema';

export async function GET() {
    try {
        const data = await db.select().from(monitoringData).orderBy(monitoringData.kabupaten);
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch monitoring data' }, { status: 500 });
    }
}
