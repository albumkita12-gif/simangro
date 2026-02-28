import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { quizQuestions } from '@/lib/schema';

export async function GET() {
    try {
        const data = await db.select().from(quizQuestions).orderBy(quizQuestions.id);
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch quiz' }, { status: 500 });
    }
}
