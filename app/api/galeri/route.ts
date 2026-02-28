import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { galleryItems } from '@/lib/schema';

export async function GET() {
    try {
        const data = await db.select().from(galleryItems).orderBy(galleryItems.id);
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
    }
}
