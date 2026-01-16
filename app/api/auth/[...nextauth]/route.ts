// Simple API route that can be expanded later for cloud sync
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        message: 'NextAuth endpoint - Cloud sync not configured. See SETUP_GUIDE.md to enable authentication.',
    });
}

export async function POST() {
    return NextResponse.json({
        message: 'NextAuth endpoint - Cloud sync not configured.',
    });
}
