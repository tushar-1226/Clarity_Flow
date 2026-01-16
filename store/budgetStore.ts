import { create } from 'zustand';
import {
    Transaction,
    BudgetGoals,
    FilterState,
    RecurringTransaction,
    SavingsGoal,
    Tag,
    CurrencyInfo,
    SearchPreset,
    UserPreferences,
    NotificationSettings,
    Notification,
    MultiPeriodBudgetGoals,
    BudgetPeriod,
    DashboardWidget,
    DEFAULT_CURRENCIES
} from '@/types';
import {
    loadTransactions,
    saveTransactions,
    loadBudgetGoals,
    saveBudgetGoals,
    loadRecurringTransactions,
    saveRecurringTransactions,
    loadSavingsGoals,
    saveSavingsGoals,
    loadTags,
    saveTags,
    loadCurrencies,
    saveCurrencies,
    loadSearchPresets,
    saveSearchPresets,
    loadUserPreferences,
    saveUserPreferences,
    loadNotifications,
    saveNotifications,
    loadNotificationSettings,
    saveNotificationSettings,
    loadMultiPeriodBudgets,
    saveMultiPeriodBudgets,
    generateId,
    migrateDataSchema,
    clearAllData
} from '@/lib/dataHandler';
import { processRecurringTransactions } from '@/lib/calculations';

interface BudgetStore {
    // Core data
    transactions: Transaction[];
    budgetGoals: BudgetGoals;
    filters: FilterState;

    // New features
    recurringTransactions: RecurringTransaction[];
    savingsGoals: SavingsGoal[];
    tags: Tag[];
    currencies: CurrencyInfo[];
    baseCurrency: string;
    searchPresets: SearchPreset[];
    userPreferences: UserPreferences | null;
    notifications: Notification[];
    notificationSettings: NotificationSettings;
    multiPeriodBudgets: MultiPeriodBudgetGoals;

    // Transaction methods
    addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    deleteTransaction: (id: string) => void;
    updateTransaction: (id: string, updates: Partial<Transaction>) => void;

    // Budget goal methods (existing monthly)
    setBudgetGoal: (category: string, limit: number) => void;
    removeBudgetGoal: (category: string) => void;

    // Multi-period budget methods
    setBudgetGoalForPeriod: (period: BudgetPeriod, category: string, limit: number) => void;
    removeBudgetGoalForPeriod: (period: BudgetPeriod, category: string) => void;

    // Recurring transaction methods
    addRecurringTransaction: (recurring: Omit<RecurringTransaction, 'id'>) => void;
    updateRecurringTransaction: (id: string, updates: Partial<RecurringTransaction>) => void;
    deleteRecurringTransaction: (id: string) => void;
    toggleRecurringTransaction: (id: string) => void;
    processRecurring: () => void;

    // Savings goal methods
    addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
    updateSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void;
    deleteSavingsGoal: (id: string) => void;
    contributeToSavingsGoal: (id: string, amount: number) => void;

    // Tag methods
    addTag: (tag: Omit<Tag, 'id'>) => void;
    deleteTag: (id: string) => void;
    addTagToTransaction: (transactionId: string, tagName: string) => void;
    removeTagFromTransaction: (transactionId: string, tagName: string) => void;

    // Currency methods
    updateBaseCurrency: (currency: string) => void;
    updateCurrencies: (currencies: CurrencyInfo[]) => void;
    updateExchangeRate: (currencyCode: string, rate: number) => void;

    // Search preset methods
    saveSearchPreset: (preset: Omit<SearchPreset, 'id'>) => void;
    deleteSearchPreset: (id: string) => void;
    applySearchPreset: (id: string) => void;

    // Filter methods
    setFilters: (filters: Partial<FilterState>) => void;
    clearFilters: () => void;
    getFilteredTransactions: () => Transaction[];

    // User preferences methods
    updateDashboardWidgets: (widgets: DashboardWidget[]) => void;
    toggleWidget: (widgetId: string) => void;
    completeOnboarding: () => void;
    resetOnboarding: () => void;

    // Notification methods
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    markNotificationAsRead: (id: string) => void;
    markAllNotificationsAsRead: () => void;
    clearAllNotifications: () => void;
    updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;

    // Data import/export
    importTransactions: (transactions: Transaction[]) => void;

    // Reset all data
    resetAllData: () => void;

    // Initialize
    initialize: () => void;
}

const initialFilterState: FilterState = {
    searchText: '',
    type: 'all',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    tags: [],
    categories: [],
    currencies: [],
};

const getDefaultDashboardWidgets = (): DashboardWidget[] => [
    { id: 'transaction-form', name: 'Add Transaction', enabled: true, order: 1 },
    { id: 'financial-summary', name: 'Financial Summary', enabled: true, order: 2 },
    { id: 'financial-health', name: 'Financial Health Score', enabled: true, order: 3 },
    { id: 'search-filter', name: 'Search & Filter', enabled: true, order: 4 },
    { id: 'budget-goals', name: 'Budget Goals', enabled: true, order: 5 },
    { id: 'budget-tracking', name: 'Budget Tracking', enabled: true, order: 6 },
    { id: 'savings-goals', name: 'Savings Goals', enabled: true, order: 7 },
    { id: 'weekly-summary', name: 'Weekly Summary', enabled: true, order: 8 },
    { id: 'trend-analysis', name: 'Trend Analysis', enabled: true, order: 9 },
    { id: 'expense-pie-chart', name: 'Expense Categories', enabled: true, order: 10 },
    { id: 'monthly-bar-chart', name: 'Monthly Overview', enabled: true, order: 11 },
    { id: 'balance-line-chart', name: 'Balance Over Time', enabled: true, order: 12 },
    { id: 'recurring-transactions', name: 'Recurring Transactions', enabled: true, order: 13 },
];

const getDefaultUserPreferences = (): UserPreferences => ({
    baseCurrency: 'USD',
    dashboardWidgets: getDefaultDashboardWidgets(),
    dateFormat: 'MM/dd/yyyy',
    startOfWeek: 1, // Monday
    onboardingCompleted: false,
});

export const useBudgetStore = create<BudgetStore>((set, get) => ({
    // Initial state
    transactions: [],
    budgetGoals: {},
    filters: initialFilterState,
    recurringTransactions: [],
    savingsGoals: [],
    tags: [],
    currencies: DEFAULT_CURRENCIES,
    baseCurrency: 'USD',
    searchPresets: [],
    userPreferences: null,
    notifications: [],
    notificationSettings: {
        enableDailySummary: true,
        enableBudgetAlerts: true,
        budgetAlertThresholds: [75, 90, 100],
        enableRecurringReminders: true,
        enableSavingsMilestones: true,
        enableAnomalyDetection: true,
        browserNotificationsEnabled: false,
    },
    multiPeriodBudgets: {
        weekly: {},
        monthly: {},
        quarterly: {},
        yearly: {},
    },

    // ============================================================================
    // TRANSACTION METHODS
    // ============================================================================

    addTransaction: (transaction) => {
        const newTransaction: Transaction = {
            ...transaction,
            id: generateId(),
            tags: transaction.tags || [],
            currency: transaction.currency || get().baseCurrency,
        };

        set((state) => {
            const newTransactions = [...state.transactions, newTransaction];
            saveTransactions(newTransactions);
            return { transactions: newTransactions };
        });
    },

    deleteTransaction: (id) => {
        set((state) => {
            const newTransactions = state.transactions.filter(t => t.id !== id);
            saveTransactions(newTransactions);
            return { transactions: newTransactions };
        });
    },

    updateTransaction: (id, updates) => {
        set((state) => {
            const newTransactions = state.transactions.map(t =>
                t.id === id ? { ...t, ...updates } : t
            );
            saveTransactions(newTransactions);
            return { transactions: newTransactions };
        });
    },

    // ============================================================================
    // BUDGET GOAL METHODS
    // ============================================================================

    setBudgetGoal: (category, limit) => {
        set((state) => {
            const newGoals = { ...state.budgetGoals, [category]: limit };
            saveBudgetGoals(newGoals);
            return { budgetGoals: newGoals };
        });
    },

    removeBudgetGoal: (category) => {
        set((state) => {
            const newGoals = { ...state.budgetGoals };
            delete newGoals[category];
            saveBudgetGoals(newGoals);
            return { budgetGoals: newGoals };
        });
    },

    setBudgetGoalForPeriod: (period, category, limit) => {
        set((state) => {
            const newMultiPeriodBudgets = { ...state.multiPeriodBudgets };
            newMultiPeriodBudgets[period] = {
                ...newMultiPeriodBudgets[period],
                [category]: limit
            };
            saveMultiPeriodBudgets(newMultiPeriodBudgets);
            return { multiPeriodBudgets: newMultiPeriodBudgets };
        });
    },

    removeBudgetGoalForPeriod: (period, category) => {
        set((state) => {
            const newMultiPeriodBudgets = { ...state.multiPeriodBudgets };
            const periodBudgets = { ...newMultiPeriodBudgets[period] };
            delete periodBudgets[category];
            newMultiPeriodBudgets[period] = periodBudgets;
            saveMultiPeriodBudgets(newMultiPeriodBudgets);
            return { multiPeriodBudgets: newMultiPeriodBudgets };
        });
    },

    // ============================================================================
    // RECURRING TRANSACTION METHODS
    // ============================================================================

    addRecurringTransaction: (recurring) => {
        const newRecurring: RecurringTransaction = {
            ...recurring,
            id: generateId(),
            isActive: true,
            tags: recurring.tags || [],
            currency: recurring.currency || get().baseCurrency,
        };

        set((state) => {
            const newRecurringList = [...state.recurringTransactions, newRecurring];
            saveRecurringTransactions(newRecurringList);
            return { recurringTransactions: newRecurringList };
        });
    },

    updateRecurringTransaction: (id, updates) => {
        set((state) => {
            const newRecurringList = state.recurringTransactions.map(r =>
                r.id === id ? { ...r, ...updates } : r
            );
            saveRecurringTransactions(newRecurringList);
            return { recurringTransactions: newRecurringList };
        });
    },

    deleteRecurringTransaction: (id) => {
        set((state) => {
            const newRecurringList = state.recurringTransactions.filter(r => r.id !== id);
            saveRecurringTransactions(newRecurringList);
            return { recurringTransactions: newRecurringList };
        });
    },

    toggleRecurringTransaction: (id) => {
        set((state) => {
            const newRecurringList = state.recurringTransactions.map(r =>
                r.id === id ? { ...r, isActive: !r.isActive } : r
            );
            saveRecurringTransactions(newRecurringList);
            return { recurringTransactions: newRecurringList };
        });
    },

    processRecurring: () => {
        const state = get();
        const { newTransactions, updatedRecurring } = processRecurringTransactions(
            state.recurringTransactions,
            new Date()
        );

        if (newTransactions.length > 0) {
            // Add new transactions
            newTransactions.forEach(tx => {
                get().addTransaction(tx);
            });

            // Update recurring transactions with new next dates
            set({ recurringTransactions: updatedRecurring });
            saveRecurringTransactions(updatedRecurring);

            console.log(`Processed ${newTransactions.length} recurring transactions`);
        }
    },

    // ============================================================================
    // SAVINGS GOAL METHODS
    // ============================================================================

    addSavingsGoal: (goal) => {
        const newGoal: SavingsGoal = {
            ...goal,
            id: generateId(),
            currentAmount: goal.currentAmount || 0,
            currency: goal.currency || get().baseCurrency,
            createdDate: new Date().toISOString().split('T')[0],
        };

        set((state) => {
            const newGoals = [...state.savingsGoals, newGoal];
            saveSavingsGoals(newGoals);
            return { savingsGoals: newGoals };
        });
    },

    updateSavingsGoal: (id, updates) => {
        set((state) => {
            const newGoals = state.savingsGoals.map(g =>
                g.id === id ? { ...g, ...updates } : g
            );
            saveSavingsGoals(newGoals);
            return { savingsGoals: newGoals };
        });
    },

    deleteSavingsGoal: (id) => {
        set((state) => {
            const newGoals = state.savingsGoals.filter(g => g.id !== id);
            saveSavingsGoals(newGoals);
            return { savingsGoals: newGoals };
        });
    },

    contributeToSavingsGoal: (id, amount) => {
        set((state) => {
            const newGoals = state.savingsGoals.map(g =>
                g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g
            );
            saveSavingsGoals(newGoals);
            return { savingsGoals: newGoals };
        });
    },

    // ============================================================================
    // TAG METHODS
    // ============================================================================

    addTag: (tag) => {
        const newTag: Tag = {
            ...tag,
            id: generateId(),
            createdDate: new Date().toISOString().split('T')[0],
        };

        set((state) => {
            const newTags = [...state.tags, newTag];
            saveTags(newTags);
            return { tags: newTags };
        });
    },

    deleteTag: (id) => {
        set((state) => {
            const newTags = state.tags.filter(t => t.id !== id);
            saveTags(newTags);

            // Remove tag from all transactions
            const tagToDelete = state.tags.find(t => t.id === id);
            if (tagToDelete) {
                const newTransactions = state.transactions.map(tx => ({
                    ...tx,
                    tags: tx.tags?.filter(t => t !== tagToDelete.name) || []
                }));
                saveTransactions(newTransactions);
                return { tags: newTags, transactions: newTransactions };
            }

            return { tags: newTags };
        });
    },

    addTagToTransaction: (transactionId, tagName) => {
        set((state) => {
            const newTransactions = state.transactions.map(tx =>
                tx.id === transactionId
                    ? { ...tx, tags: [...(tx.tags || []), tagName].filter((v, i, a) => a.indexOf(v) === i) }
                    : tx
            );
            saveTransactions(newTransactions);
            return { transactions: newTransactions };
        });
    },

    removeTagFromTransaction: (transactionId, tagName) => {
        set((state) => {
            const newTransactions = state.transactions.map(tx =>
                tx.id === transactionId
                    ? { ...tx, tags: (tx.tags || []).filter(t => t !== tagName) }
                    : tx
            );
            saveTransactions(newTransactions);
            return { transactions: newTransactions };
        });
    },

    // ============================================================================
    // CURRENCY METHODS
    // ============================================================================

    updateBaseCurrency: (currency) => {
        const prefs = get().userPreferences || getDefaultUserPreferences();
        const newPrefs = { ...prefs, baseCurrency: currency };
        saveUserPreferences(newPrefs);
        set({ baseCurrency: currency, userPreferences: newPrefs });
    },

    updateCurrencies: (currencies) => {
        saveCurrencies(currencies);
        set({ currencies });
    },

    updateExchangeRate: (currencyCode, rate) => {
        set((state) => {
            const newCurrencies = state.currencies.map(c =>
                c.code === currencyCode ? { ...c, exchangeRate: rate } : c
            );
            saveCurrencies(newCurrencies);
            return { currencies: newCurrencies };
        });
    },

    // ============================================================================
    // SEARCH PRESET METHODS
    // ============================================================================

    saveSearchPreset: (preset) => {
        const newPreset: SearchPreset = {
            ...preset,
            id: generateId(),
        };

        set((state) => {
            const newPresets = [...state.searchPresets, newPreset];
            saveSearchPresets(newPresets);
            return { searchPresets: newPresets };
        });
    },

    deleteSearchPreset: (id) => {
        set((state) => {
            const newPresets = state.searchPresets.filter(p => p.id !== id);
            saveSearchPresets(newPresets);
            return { searchPresets: newPresets };
        });
    },

    applySearchPreset: (id) => {
        const preset = get().searchPresets.find(p => p.id === id);
        if (preset) {
            set({ filters: preset.filters });
        }
    },

    // ============================================================================
    // FILTER METHODS
    // ============================================================================

    setFilters: (filters) => {
        set((state) => ({
            filters: { ...state.filters, ...filters },
        }));
    },

    clearFilters: () => {
        set({ filters: initialFilterState });
    },

    getFilteredTransactions: () => {
        const { transactions, filters } = get();

        return transactions.filter((transaction) => {
            // Search text filter
            if (filters.searchText) {
                const searchLower = filters.searchText.toLowerCase();
                const matchesSearch =
                    transaction.description.toLowerCase().includes(searchLower) ||
                    transaction.category.toLowerCase().includes(searchLower) ||
                    (transaction.tags && transaction.tags.some(tag => tag.toLowerCase().includes(searchLower)));
                if (!matchesSearch) return false;
            }

            // Type filter
            if (filters.type !== 'all' && transaction.type !== filters.type) {
                return false;
            }

            // Date range filter
            if (filters.dateFrom && transaction.date < filters.dateFrom) {
                return false;
            }
            if (filters.dateTo && transaction.date > filters.dateTo) {
                return false;
            }

            // Amount range filter
            if (filters.amountMin && transaction.amount < parseFloat(filters.amountMin)) {
                return false;
            }
            if (filters.amountMax && transaction.amount > parseFloat(filters.amountMax)) {
                return false;
            }

            // Tags filter
            if (filters.tags && filters.tags.length > 0) {
                const hasMatchingTag = filters.tags.some(filterTag =>
                    transaction.tags?.includes(filterTag)
                );
                if (!hasMatchingTag) return false;
            }

            // Categories filter
            if (filters.categories && filters.categories.length > 0) {
                if (!filters.categories.includes(transaction.category)) {
                    return false;
                }
            }

            // Currencies filter
            if (filters.currencies && filters.currencies.length > 0) {
                const txCurrency = transaction.currency || get().baseCurrency;
                if (!filters.currencies.includes(txCurrency)) {
                    return false;
                }
            }

            return true;
        });
    },

    // ============================================================================
    // USER PREFERENCES METHODS
    // ============================================================================

    updateDashboardWidgets: (widgets) => {
        const prefs = get().userPreferences || getDefaultUserPreferences();
        const newPrefs = { ...prefs, dashboardWidgets: widgets };
        saveUserPreferences(newPrefs);
        set({ userPreferences: newPrefs });
    },

    toggleWidget: (widgetId) => {
        const prefs = get().userPreferences || getDefaultUserPreferences();
        const newWidgets = prefs.dashboardWidgets.map(w =>
            w.id === widgetId ? { ...w, enabled: !w.enabled } : w
        );
        const newPrefs = { ...prefs, dashboardWidgets: newWidgets };
        saveUserPreferences(newPrefs);
        set({ userPreferences: newPrefs });
    },

    completeOnboarding: () => {
        const prefs = get().userPreferences || getDefaultUserPreferences();
        const newPrefs = { ...prefs, onboardingCompleted: true };
        saveUserPreferences(newPrefs);
        set({ userPreferences: newPrefs });
    },

    resetOnboarding: () => {
        const prefs = get().userPreferences || getDefaultUserPreferences();
        const newPrefs = { ...prefs, onboardingCompleted: false };
        saveUserPreferences(newPrefs);
        set({ userPreferences: newPrefs });
    },

    // ============================================================================
    // NOTIFICATION METHODS
    // ============================================================================

    addNotification: (notification) => {
        const newNotification: Notification = {
            ...notification,
            id: generateId(),
            read: false,
            date: new Date().toISOString(),
        };

        set((state) => {
            const newNotifications = [newNotification, ...state.notifications].slice(0, 50); // Keep last 50
            saveNotifications(newNotifications);
            return { notifications: newNotifications };
        });
    },

    markNotificationAsRead: (id) => {
        set((state) => {
            const newNotifications = state.notifications.map(n =>
                n.id === id ? { ...n, read: true } : n
            );
            saveNotifications(newNotifications);
            return { notifications: newNotifications };
        });
    },

    markAllNotificationsAsRead: () => {
        set((state) => {
            const newNotifications = state.notifications.map(n => ({ ...n, read: true }));
            saveNotifications(newNotifications);
            return { notifications: newNotifications };
        });
    },

    clearAllNotifications: () => {
        saveNotifications([]);
        set({ notifications: [] });
    },

    updateNotificationSettings: (settings) => {
        set((state) => {
            const newSettings = { ...state.notificationSettings, ...settings };
            saveNotificationSettings(newSettings);
            return { notificationSettings: newSettings };
        });
    },

    // ============================================================================
    // DATA IMPORT/EXPORT
    // ============================================================================

    importTransactions: (transactions) => {
        set(() => {
            saveTransactions(transactions);
            return { transactions };
        });
    },

    // ============================================================================
    // RESET ALL DATA
    // ============================================================================

    resetAllData: () => {
        // Clear all localStorage data
        clearAllData();

        // Reset store to initial state
        set({
            transactions: [],
            budgetGoals: {},
            filters: initialFilterState,
            recurringTransactions: [],
            savingsGoals: [],
            tags: [],
            currencies: DEFAULT_CURRENCIES,
            baseCurrency: 'USD',
            searchPresets: [],
            userPreferences: getDefaultUserPreferences(),
            notifications: [],
            notificationSettings: {
                enableDailySummary: true,
                enableBudgetAlerts: true,
                budgetAlertThresholds: [75, 90, 100],
                enableRecurringReminders: true,
                enableSavingsMilestones: true,
                enableAnomalyDetection: true,
                browserNotificationsEnabled: false,
            },
            multiPeriodBudgets: {
                weekly: {},
                monthly: {},
                quarterly: {},
                yearly: {},
            },
        });

        console.log('All data has been reset to initial state');
    },

    // ============================================================================
    // INITIALIZE
    // ============================================================================

    initialize: () => {
        // Run data migration first
        migrateDataSchema();

        // Load all data
        const transactions = loadTransactions();
        const budgetGoals = loadBudgetGoals();
        const recurringTransactions = loadRecurringTransactions();
        const savingsGoals = loadSavingsGoals();
        const tags = loadTags();
        const currencies = loadCurrencies();
        const searchPresets = loadSearchPresets();
        const userPreferences = loadUserPreferences() || getDefaultUserPreferences();
        const notifications = loadNotifications();
        const notificationSettings = loadNotificationSettings();
        const multiPeriodBudgets = loadMultiPeriodBudgets();

        set({
            transactions,
            budgetGoals,
            recurringTransactions,
            savingsGoals,
            tags,
            currencies,
            baseCurrency: userPreferences.baseCurrency,
            searchPresets,
            userPreferences,
            notifications,
            notificationSettings,
            multiPeriodBudgets,
        });

        // Process any pending recurring transactions
        get().processRecurring();
    },
}));
