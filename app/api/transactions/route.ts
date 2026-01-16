import { NextResponse } from 'next/server';

// Cloud sync API routes - Optional feature
// Currently disabled. To enable, follow SETUP_GUIDE.md

export async function GET() {
    return NextResponse.json({
        message: 'Cloud sync not enabled. App uses localStorage. See SETUP_GUIDE.md',
        transactions: []
    });
}

export async function POST() {
    return NextResponse.json({
        message: 'Cloud sync not enabled. App uses localStorage. See SETUP_GUIDE.md',
    }, { status: 501 });
}

export async function DELETE() {
    return NextResponse.json({
        message: 'Cloud sync not enabled. App uses localStorage. See SETUP_GUIDE.md',
    }, { status: 501 });
}

export async function PUT() {
    return NextResponse.json({
        message: 'Cloud sync not enabled. App uses localStorage. See SETUP_GUIDE.md',
    }, { status: 501 });
}
