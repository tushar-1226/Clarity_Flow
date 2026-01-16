import {
    Transaction,
    BudgetGoals,
    RecurringTransaction,
    SavingsGoal,
    Tag,
    CurrencyInfo,
    SearchPreset,
    UserPreferences,
    NotificationSettings,
    Notification,
    MultiPeriodBudgetGoals,
    DEFAULT_CURRENCIES
} from '@/types';

const TRANSACTIONS_KEY = 'clarityflow_transactions';
const BUDGET_GOALS_KEY = 'clarityflow_budget_goals';
const RECURRING_TRANSACTIONS_KEY = 'clarityflow_recurring_transactions';
const SAVINGS_GOALS_KEY = 'clarityflow_savings_goals';
const TAGS_KEY = 'clarityflow_tags';
const CURRENCIES_KEY = 'clarityflow_currencies';
const SEARCH_PRESETS_KEY = 'clarityflow_search_presets';
const USER_PREFERENCES_KEY = 'clarityflow_preferences';
const NOTIFICATIONS_KEY = 'clarityflow_notifications';
const NOTIFICATION_SETTINGS_KEY = 'clarityflow_notification_settings';
const MULTI_PERIOD_BUDGETS_KEY = 'clarityflow_multi_period_budgets';
const SCHEMA_VERSION_KEY = 'clarityflow_schema_version';

const CURRENT_SCHEMA_VERSION = 2;

// Load transactions from localStorage
export const loadTransactions = (): Transaction[] => {
    if (typeof window === 'undefined') return [];

    try {
        const data = localStorage.getItem(TRANSACTIONS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading transactions:', error);
        return [];
    }
};

// Save transactions to localStorage
export const saveTransactions = (transactions: Transaction[]): void => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    } catch (error) {
        console.error('Error saving transactions:', error);
    }
};

// Load budget goals from localStorage
export const loadBudgetGoals = (): BudgetGoals => {
    if (typeof window === 'undefined') return {};

    try {
        const data = localStorage.getItem(BUDGET_GOALS_KEY);
        return data ? JSON.parse(data) : {};
    } catch (error) {
        console.error('Error loading budget goals:', error);
        return {};
    }
};

// Save budget goals to localStorage
export const saveBudgetGoals = (goals: BudgetGoals): void => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(BUDGET_GOALS_KEY, JSON.stringify(goals));
    } catch (error) {
        console.error('Error saving budget goals:', error);
    }
};

// Recurring Transactions
export const loadRecurringTransactions = (): RecurringTransaction[] => {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(RECURRING_TRANSACTIONS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading recurring transactions:', error);
        return [];
    }
};

export const saveRecurringTransactions = (recurring: RecurringTransaction[]): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(RECURRING_TRANSACTIONS_KEY, JSON.stringify(recurring));
    } catch (error) {
        console.error('Error saving recurring transactions:', error);
    }
};

// Savings Goals
export const loadSavingsGoals = (): SavingsGoal[] => {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(SAVINGS_GOALS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading savings goals:', error);
        return [];
    }
};

export const saveSavingsGoals = (goals: SavingsGoal[]): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(SAVINGS_GOALS_KEY, JSON.stringify(goals));
    } catch (error) {
        console.error('Error saving savings goals:', error);
    }
};

// Tags
export const loadTags = (): Tag[] => {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(TAGS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading tags:', error);
        return [];
    }
};

export const saveTags = (tags: Tag[]): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
    } catch (error) {
        console.error('Error saving tags:', error);
    }
};

// Currencies
export const loadCurrencies = (): CurrencyInfo[] => {
    if (typeof window === 'undefined') return DEFAULT_CURRENCIES;
    try {
        const data = localStorage.getItem(CURRENCIES_KEY);
        return data ? JSON.parse(data) : DEFAULT_CURRENCIES;
    } catch (error) {
        console.error('Error loading currencies:', error);
        return DEFAULT_CURRENCIES;
    }
};

export const saveCurrencies = (currencies: CurrencyInfo[]): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(CURRENCIES_KEY, JSON.stringify(currencies));
    } catch (error) {
        console.error('Error saving currencies:', error);
    }
};

// Search Presets
export const loadSearchPresets = (): SearchPreset[] => {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(SEARCH_PRESETS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading search presets:', error);
        return [];
    }
};

export const saveSearchPresets = (presets: SearchPreset[]): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(SEARCH_PRESETS_KEY, JSON.stringify(presets));
    } catch (error) {
        console.error('Error saving search presets:', error);
    }
};

// User Preferences
export const loadUserPreferences = (): UserPreferences | null => {
    if (typeof window === 'undefined') return null;
    try {
        const data = localStorage.getItem(USER_PREFERENCES_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading user preferences:', error);
        return null;
    }
};

export const saveUserPreferences = (preferences: UserPreferences): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
    } catch (error) {
        console.error('Error saving user preferences:', error);
    }
};

// Notifications
export const loadNotifications = (): Notification[] => {
    if (typeof window === 'undefined') return [];
    try {
        const data = localStorage.getItem(NOTIFICATIONS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading notifications:', error);
        return [];
    }
};

export const saveNotifications = (notifications: Notification[]): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    } catch (error) {
        console.error('Error saving notifications:', error);
    }
};

// Notification Settings
export const loadNotificationSettings = (): NotificationSettings => {
    if (typeof window === 'undefined') return getDefaultNotificationSettings();
    try {
        const data = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
        return data ? JSON.parse(data) : getDefaultNotificationSettings();
    } catch (error) {
        console.error('Error loading notification settings:', error);
        return getDefaultNotificationSettings();
    }
};

export const saveNotificationSettings = (settings: NotificationSettings): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
        console.error('Error saving notification settings:', error);
    }
};

const getDefaultNotificationSettings = (): NotificationSettings => ({
    enableDailySummary: true,
    enableBudgetAlerts: true,
    budgetAlertThresholds: [75, 90, 100],
    enableRecurringReminders: true,
    enableSavingsMilestones: true,
    enableAnomalyDetection: true,
    browserNotificationsEnabled: false,
});

// Multi-Period Budgets
export const loadMultiPeriodBudgets = (): MultiPeriodBudgetGoals => {
    if (typeof window === 'undefined') return getDefaultMultiPeriodBudgets();
    try {
        const data = localStorage.getItem(MULTI_PERIOD_BUDGETS_KEY);
        return data ? JSON.parse(data) : getDefaultMultiPeriodBudgets();
    } catch (error) {
        console.error('Error loading multi-period budgets:', error);
        return getDefaultMultiPeriodBudgets();
    }
};

export const saveMultiPeriodBudgets = (budgets: MultiPeriodBudgetGoals): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(MULTI_PERIOD_BUDGETS_KEY, JSON.stringify(budgets));
    } catch (error) {
        console.error('Error saving multi-period budgets:', error);
    }
};

const getDefaultMultiPeriodBudgets = (): MultiPeriodBudgetGoals => ({
    weekly: {},
    monthly: {},
    quarterly: {},
    yearly: {},
});

// Generate unique ID for transactions
export const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Data Migration
export const migrateDataSchema = (): void => {
    if (typeof window === 'undefined') return;

    try {
        const currentVersion = localStorage.getItem(SCHEMA_VERSION_KEY);
        const version = currentVersion ? parseInt(currentVersion) : 1;

        if (version < CURRENT_SCHEMA_VERSION) {
            console.log(`Migrating data schema from v${version} to v${CURRENT_SCHEMA_VERSION}`);

            // Migration from v1 to v2
            if (version < 2) {
                // Initialize new data structures if they don't exist
                if (!localStorage.getItem(RECURRING_TRANSACTIONS_KEY)) {
                    saveRecurringTransactions([]);
                }
                if (!localStorage.getItem(SAVINGS_GOALS_KEY)) {
                    saveSavingsGoals([]);
                }
                if (!localStorage.getItem(TAGS_KEY)) {
                    saveTags([]);
                }
                if (!localStorage.getItem(CURRENCIES_KEY)) {
                    saveCurrencies(DEFAULT_CURRENCIES);
                }
                if (!localStorage.getItem(SEARCH_PRESETS_KEY)) {
                    saveSearchPresets([]);
                }
                if (!localStorage.getItem(NOTIFICATION_SETTINGS_KEY)) {
                    saveNotificationSettings(getDefaultNotificationSettings());
                }
                if (!localStorage.getItem(NOTIFICATIONS_KEY)) {
                    saveNotifications([]);
                }
                if (!localStorage.getItem(MULTI_PERIOD_BUDGETS_KEY)) {
                    saveMultiPeriodBudgets(getDefaultMultiPeriodBudgets());
                }

                // Migrate existing transactions to add new optional fields
                const transactions = loadTransactions();
                if (transactions.length > 0) {
                    const updatedTransactions = transactions.map(t => ({
                        ...t,
                        tags: t.tags || [],
                        currency: t.currency || 'USD',
                    }));
                    saveTransactions(updatedTransactions);
                }
            }

            // Update schema version
            localStorage.setItem(SCHEMA_VERSION_KEY, CURRENT_SCHEMA_VERSION.toString());
            console.log('Data migration completed successfully');
        }
    } catch (error) {
        console.error('Error during data migration:', error);
    }
};

// Clear all data from localStorage
export const clearAllData = (): void => {
    if (typeof window === 'undefined') return;

    try {
        // Remove all ClarityFlow localStorage keys
        localStorage.removeItem(TRANSACTIONS_KEY);
        localStorage.removeItem(BUDGET_GOALS_KEY);
        localStorage.removeItem(RECURRING_TRANSACTIONS_KEY);
        localStorage.removeItem(SAVINGS_GOALS_KEY);
        localStorage.removeItem(TAGS_KEY);
        localStorage.removeItem(CURRENCIES_KEY);
        localStorage.removeItem(SEARCH_PRESETS_KEY);
        localStorage.removeItem(USER_PREFERENCES_KEY);
        localStorage.removeItem(NOTIFICATIONS_KEY);
        localStorage.removeItem(NOTIFICATION_SETTINGS_KEY);
        localStorage.removeItem(MULTI_PERIOD_BUDGETS_KEY);
        localStorage.removeItem(SCHEMA_VERSION_KEY);

        console.log('All ClarityFlow data cleared from localStorage');
    } catch (error) {
        console.error('Error clearing data:', error);
    }
};

