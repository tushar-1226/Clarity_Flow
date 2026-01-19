export type TransactionType = 'income' | 'expense';
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type BudgetPeriod = 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type Currency = string; // ISO 4217 currency codes (USD, EUR, etc.)

export interface Transaction {
    id: string;
    date: string;
    type: TransactionType;
    category: string;
    description: string;
    amount: number;
    currency?: Currency; // Optional, defaults to base currency
    tags?: string[]; // Custom tags for flexible categorization
    recurringId?: string; // Link to recurring transaction template if auto-generated
}

// Recurring transactions
export interface RecurringTransaction {
    id: string;
    type: TransactionType;
    category: string;
    description: string;
    amount: number;
    currency?: Currency;
    tags?: string[];
    frequency: RecurrenceFrequency;
    startDate: string;
    endDate?: string; // Optional end date
    nextDate: string; // Next scheduled execution
    isActive: boolean;
}

// Savings goals
export interface SavingsGoal {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: string; // Optional target date
    currency?: Currency;
    category?: string; // Optional category
    createdDate: string;
}

// Multi-period budgets
export interface BudgetGoal {
    category: string;
    limit: number;
    period?: BudgetPeriod; // Defaults to 'monthly'
}

export interface BudgetGoals {
    [category: string]: number;
}

export interface MultiPeriodBudgetGoals {
    weekly: BudgetGoals;
    monthly: BudgetGoals;
    quarterly: BudgetGoals;
    yearly: BudgetGoals;
}

// Tags
export interface Tag {
    id: string;
    name: string;
    color?: string;
    createdDate: string;
}

// Custom Categories
export interface CustomCategory {
    id: string;
    name: string;
    type: 'income' | 'expense';
    icon?: string; // Lucide icon name or emoji
    color?: string; // Hex color code
    parentCategoryId?: string; // For hierarchical categories
    isDefault: boolean; // True for built-in categories
    createdDate?: string; // Auto-generated
    order?: number; // Display order
}


// Currency information
export interface CurrencyInfo {
    code: Currency;
    symbol: string;
    name: string;
    exchangeRate: number; // Rate relative to base currency
}

// Search and filters
export interface FilterState {
    searchText: string;
    type: TransactionType | 'all';
    dateFrom: string;
    dateTo: string;
    amountMin: string;
    amountMax: string;
    tags?: string[]; // Filter by tags
    categories?: string[]; // Multi-category filter
    currencies?: Currency[]; // Filter by currency
}

export interface SearchPreset {
    id: string;
    name: string;
    filters: FilterState;
    isDefault?: boolean;
}

// Notifications
export interface Notification {
    id: string;
    type: 'budget_alert' | 'recurring_reminder' | 'savings_milestone' | 'daily_summary' | 'anomaly';
    title: string;
    message: string;
    date: string;
    read: boolean;
    actionUrl?: string;
}

export interface NotificationSettings {
    enableDailySummary: boolean;
    enableBudgetAlerts: boolean;
    budgetAlertThresholds: number[]; // e.g., [75, 90, 100]
    enableRecurringReminders: boolean;
    enableSavingsMilestones: boolean;
    enableAnomalyDetection: boolean;
    browserNotificationsEnabled: boolean;
}

// User preferences
export interface DashboardWidget {
    id: string;
    name: string;
    enabled: boolean;
    order: number;
}

export interface UserPreferences {
    baseCurrency: Currency;
    dashboardWidgets: DashboardWidget[];
    dateFormat: string;
    startOfWeek: 0 | 1; // 0 = Sunday, 1 = Monday
    onboardingCompleted: boolean;
    theme?: 'light' | 'dark' | 'system';
}

// Analytics
export interface FinancialHealthMetrics {
    score: number; // 0-100
    savingsRate: number; // Percentage
    incomeExpenseRatio: number;
    budgetAdherence: number; // Percentage
    trend: 'improving' | 'stable' | 'declining';
}

export interface SpendingTrend {
    category: string;
    currentPeriod: number;
    previousPeriod: number;
    change: number; // Percentage change
    isAnomaly: boolean;
}

// Category definitions
export const INCOME_CATEGORIES = [
    'Salary',
    'Freelance',
    'Investments',
    'Business',
    'Gifts',
    'Other Income'
] as const;

export const EXPENSE_CATEGORIES = [
    'Food',
    'Transportation',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Shopping',
    'Education',
    'Housing',
    'Other Expenses'
] as const;

export type IncomeCategory = typeof INCOME_CATEGORIES[number];
export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
export type Category = IncomeCategory | ExpenseCategory;

// Default currencies
export const DEFAULT_CURRENCIES: CurrencyInfo[] = [
    { code: 'USD', symbol: '$', name: 'US Dollar', exchangeRate: 1.0 },
    { code: 'EUR', symbol: '€', name: 'Euro', exchangeRate: 0.92 },
    { code: 'GBP', symbol: '£', name: 'British Pound', exchangeRate: 0.79 },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', exchangeRate: 83.0 },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', exchangeRate: 149.0 },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', exchangeRate: 1.36 },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', exchangeRate: 1.52 },
];
