-- ClarityFlow Database Schema with Performance Indexes
-- This schema includes all necessary indexes for optimal query performance

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for fast login lookups
CREATE INDEX idx_users_email ON users(email);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    category VARCHAR(100) NOT NULL,
    description TEXT,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    tags TEXT[],
    recurring_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================
-- PERFORMANCE INDEXES FOR TRANSACTIONS
-- ========================================

-- Primary composite index for user-scoped queries sorted by date
-- Covers: SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);

-- Index for category filtering (most common filter)
-- Covers: SELECT * FROM transactions WHERE user_id = ? AND category = ?
CREATE INDEX idx_transactions_user_category ON transactions(user_id, category);

-- Index for type filtering (income vs expense)
-- Covers: SELECT * FROM transactions WHERE user_id = ? AND type = ?
CREATE INDEX idx_transactions_user_type ON transactions(user_id, type);

-- Index for date range queries
-- Covers: SELECT * FROM transactions WHERE date BETWEEN ? AND ?
CREATE INDEX idx_transactions_date ON transactions(date);

-- Index for recurring transaction lookups
-- Covers: SELECT * FROM transactions WHERE user_id = ? AND recurring_id IS NOT NULL
CREATE INDEX idx_transactions_recurring ON transactions(user_id, recurring_id) WHERE recurring_id IS NOT NULL;

-- GIN index for tag searches (PostgreSQL specific)
-- Covers: SELECT * FROM transactions WHERE tags @> ARRAY[?]
CREATE INDEX idx_transactions_tags ON transactions USING GIN (tags);

-- Recurring transactions table
CREATE TABLE IF NOT EXISTS recurring_transactions (
    id SERIAL PRIMARY KEY,
   user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    category VARCHAR(100) NOT NULL,
    description TEXT,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    frequency VARCHAR(20) NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
    next_date DATE NOT NULL,
    end_date DATE,
    tags TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for finding active recurring transactions by user
CREATE INDEX idx_recurring_user_active ON recurring_transactions(user_id, is_active) WHERE is_active = TRUE;

-- Index for finding due recurring transactions
CREATE INDEX idx_recurring_next_date ON recurring_transactions(next_date) WHERE is_active = TRUE;

-- Budget goals table
CREATE TABLE IF NOT EXISTS budget_goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    period VARCHAR(20) NOT NULL CHECK (period IN ('weekly', 'monthly', 'quarterly', 'yearly')),
    limit_amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, category, period)
);

-- Index for budget goals by user
CREATE INDEX idx_budget_goals_user ON budget_goals(user_id);

-- Index for budget goals by category
CREATE INDEX idx_budget_goals_user_category ON budget_goals(user_id, category);

-- Savings goals table
CREATE TABLE IF NOT EXISTS savings_goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    target_amount DECIMAL(12, 2) NOT NULL,
    current_amount DECIMAL(12, 2) DEFAULT 0,
    target_date DATE,
    currency VARCHAR(10) DEFAULT 'USD',
    created_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for savings goals by user
CREATE INDEX idx_savings_goals_user ON savings_goals(user_id);

-- Index for active savings goals (not yet reached)
CREATE INDEX idx_savings_goals_active ON savings_goals(user_id) WHERE current_amount < target_amount;

-- ========================================
-- HELPER FUNCTIONS FOR MAINTENANCE
-- ========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recurring_updated_at BEFORE UPDATE ON recurring_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_goals_updated_at BEFORE UPDATE ON budget_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_savings_goals_updated_at BEFORE UPDATE ON savings_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- INDEX USAGE STATISTICS VIEW (for monitoring)
-- ========================================

-- View to check index usage (run ANALYZE first)
CREATE OR REPLACE VIEW index_usage_stats AS
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM
    pg_stat_user_indexes
WHERE
    schemaname = 'public'
ORDER BY
    idx_scan DESC;

-- ========================================
-- PERFORMANCE NOTES
-- ========================================

/*
Expected Query Performance Improvements:

1. User transaction list (most common query):
   SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC LIMIT 50;
   - Before: Full table scan O(n)
   - After: Index seek O(log n) + sort 
   - Improvement: 10-100x faster

2. Category filtering:
   SELECT * FROM transactions WHERE user_id = ? AND category = 'Food';
   - Before: Full table scan O(n)
   - After: Index seek O(log n)
   - Improvement: 50-1000x faster

3. Date range queries:
   SELECT * FROM transactions WHERE user_id = ? AND date BETWEEN '2024-01-01' AND '2024-12-31';
   - Before: Full table scan O(n)
   - After: Composite index range scan O(log n)
   - Improvement: 20-500x faster

4. Tag searches:
   SELECT * FROM transactions WHERE user_id = ? AND tags @> ARRAY['vacation'];
   - Before: Full table scan O(n)
   - After: GIN index lookup O(log n)
   - Improvement: 100-1000x faster

MAINTENANCE RECOMMENDATIONS:
- Run VACUUM ANALYZE weekly
- Monitor index_usage_stats view
- Drop unused indexes if idx_scan = 0 after 30 days
- Consider partitioning transactions table by date for 1M+ rows
*/
