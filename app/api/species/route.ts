import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { species } from '@/lib/schema';

export async function GET() {
    try {
        const data = await db.select().from(species).orderBy(species.name);
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch species' }, { status: 500 });
    }
}
