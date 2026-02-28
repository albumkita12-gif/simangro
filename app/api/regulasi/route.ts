import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { regulations } from '@/lib/schema';

export async function GET() {
    try {
        const data = await db.select().from(regulations).orderBy(regulations.year);
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch regulations' }, { status: 500 });
    }
}
