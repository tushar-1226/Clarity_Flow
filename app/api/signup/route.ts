import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { email, password, name } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `;

        if (existingUser.rows.length > 0) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const result = await sql`
      INSERT INTO users (email, password_hash, name)
      VALUES (${email}, ${hashedPassword}, ${name || ''})
      RETURNING id, email, name
    `;

        return NextResponse.json({
            success: true,
            user: result.rows[0],
        });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'Failed to create account' },
            { status: 500 }
        );
    }
}
