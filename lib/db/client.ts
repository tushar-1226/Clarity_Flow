import { sql } from '@vercel/postgres';

export const db = {
    query: sql,
};

// Helper function to initialize database tables
export async function initializeDatabase() {
    try {
        // Read and execute schema.sql
        // Note: You'll need to run the schema.sql manually in Vercel Postgres dashboard
        // or use a migration tool. This is a placeholder for the connection.
        console.log('Database client initialized');
    } catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
}
