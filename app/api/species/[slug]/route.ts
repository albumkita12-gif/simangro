import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { species } from '@/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params;
        const data = await db.select().from(species).where(eq(species.slug, slug));
        if (!data.length) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        return NextResponse.json(data[0]);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch species' }, { status: 500 });
    }
}
