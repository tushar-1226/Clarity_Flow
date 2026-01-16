import {
    Transaction,
    BudgetGoals,
    BudgetPeriod,
    CurrencyInfo,
    SavingsGoal,
    FinancialHealthMetrics,
    SpendingTrend,
    RecurringTransaction
} from '@/types';
import Papa from 'papaparse';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, addDays, addWeeks, addMonths, addYears, format, differenceInDays } from 'date-fns';


// Calculate total income
export const calculateTotalIncome = (transactions: Transaction[]): number => {
    return transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
};

// Calculate total expenses
export const calculateTotalExpenses = (transactions: Transaction[]): number => {
    return transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
};

// Calculate current balance
export const calculateBalance = (transactions: Transaction[]): number => {
    return calculateTotalIncome(transactions) - calculateTotalExpenses(transactions);
};

// Group transactions by category
export const groupByCategory = (transactions: Transaction[]): Record<string, number> => {
    return transactions.reduce((acc, transaction) => {
        const { category, amount } = transaction;
        acc[category] = (acc[category] || 0) + amount;
        return acc;
    }, {} as Record<string, number>);
};

// Group expenses by category (for pie chart)
export const getExpensesByCategory = (transactions: Transaction[]): Record<string, number> => {
    const expenses = transactions.filter(t => t.type === 'expense');
    return groupByCategory(expenses);
};

// Get monthly income and expenses for bar chart
export const getMonthlyData = (transactions: Transaction[]): {
    months: string[];
    income: number[];
    expenses: number[];
} => {
    const monthlyData: Record<string, { income: number; expenses: number }> = {};

    transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { income: 0, expenses: 0 };
        }

        if (transaction.type === 'income') {
            monthlyData[monthKey].income += transaction.amount;
        } else {
            monthlyData[monthKey].expenses += transaction.amount;
        }
    });

    const sortedMonths = Object.keys(monthlyData).sort();

    return {
        months: sortedMonths.map(m => {
            const [year, month] = m.split('-');
            const date = new Date(parseInt(year), parseInt(month) - 1);
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }),
        income: sortedMonths.map(m => monthlyData[m].income),
        expenses: sortedMonths.map(m => monthlyData[m].expenses),
    };
};

// Calculate budget progress for a category
export const calculateBudgetProgress = (
    transactions: Transaction[],
    category: string,
    limit: number
): {
    spent: number;
    remaining: number;
    percentage: number;
    status: 'safe' | 'caution' | 'warning' | 'over';
} => {
    const spent = transactions
        .filter(t => t.type === 'expense' && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);

    const remaining = limit - spent;
    const percentage = (spent / limit) * 100;

    let status: 'safe' | 'caution' | 'warning' | 'over' = 'safe';
    if (percentage >= 100) status = 'over';
    else if (percentage >= 90) status = 'warning';
    else if (percentage >= 75) status = 'caution';

    return { spent, remaining, percentage, status };
};

// Export transactions to CSV
export const exportToCSV = (transactions: Transaction[]): void => {
    const csv = Papa.unparse(transactions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `clarityflow_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Import transactions from CSV
export const importFromCSV = (file: File): Promise<Transaction[]> => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            complete: (results) => {
                try {
                    const transactions: Transaction[] = results.data
                        .filter((row: any) => row.id && row.date && row.type && row.category && row.amount)
                        .map((row: any) => ({
                            id: row.id,
                            date: row.date,
                            type: row.type,
                            category: row.category,
                            description: row.description || '',
                            amount: parseFloat(row.amount),
                        }));
                    resolve(transactions);
                } catch (error) {
                    reject(error);
                }
            },
            error: (error) => {
                reject(error);
            },
        });
    });
};

// ============================================================================
// CURRENCY FUNCTIONS
// ============================================================================

export const convertCurrency = (
    amount: number,
    fromCurrency: string,
    toCurrency: string,
    currencies: CurrencyInfo[]
): number => {
    if (fromCurrency === toCurrency) return amount;

    const fromRate = currencies.find(c => c.code === fromCurrency)?.exchangeRate || 1;
    const toRate = currencies.find(c => c.code === toCurrency)?.exchangeRate || 1;

    // Convert to base currency first, then to target currency
    const baseAmount = amount / fromRate;
    return baseAmount * toRate;
};

export const getCurrencySymbol = (currencyCode: string, currencies: CurrencyInfo[]): string => {
    return currencies.find(c => c.code === currencyCode)?.symbol || currencyCode;
};

export const convertTransactionToBaseCurrency = (
    transaction: Transaction,
    baseCurrency: string,
    currencies: CurrencyInfo[]
): Transaction => {
    const txCurrency = transaction.currency || baseCurrency;
    if (txCurrency === baseCurrency) return transaction;

    return {
        ...transaction,
        amount: convertCurrency(transaction.amount, txCurrency, baseCurrency, currencies),
        currency: baseCurrency
    };
};

// ============================================================================
// MULTI-PERIOD DATE FUNCTIONS
// ============================================================================

export const getPeriodDates = (period: BudgetPeriod, referenceDate: Date = new Date()): { start: Date; end: Date } => {
    switch (period) {
        case 'weekly':
            return {
                start: startOfWeek(referenceDate, { weekStartsOn: 1 }), // Monday
                end: endOfWeek(referenceDate, { weekStartsOn: 1 })
            };
        case 'monthly':
            return {
                start: startOfMonth(referenceDate),
                end: endOfMonth(referenceDate)
            };
        case 'quarterly':
            return {
                start: startOfQuarter(referenceDate),
                end: endOfQuarter(referenceDate)
            };
        case 'yearly':
            return {
                start: startOfYear(referenceDate),
                end: endOfYear(referenceDate)
            };
    }
};

export const getTransactionsForPeriod = (
    transactions: Transaction[],
    period: BudgetPeriod,
    referenceDate: Date = new Date()
): Transaction[] => {
    const { start, end } = getPeriodDates(period, referenceDate);

    return transactions.filter(t => {
        const txDate = new Date(t.date);
        return txDate >= start && txDate <= end;
    });
};

// ============================================================================
// WEEKLY, QUARTERLY, YEARLY DATA
// ============================================================================

export const getWeeklyData = (transactions: Transaction[]): {
    weeks: string[];
    income: number[];
    expenses: number[];
} => {
    const weeklyData: Record<string, { income: number; expenses: number }> = {};

    transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const weekStart = startOfWeek(date, { weekStartsOn: 1 });
        const weekKey = format(weekStart, 'yyyy-MM-dd');

        if (!weeklyData[weekKey]) {
            weeklyData[weekKey] = { income: 0, expenses: 0 };
        }

        if (transaction.type === 'income') {
            weeklyData[weekKey].income += transaction.amount;
        } else {
            weeklyData[weekKey].expenses += transaction.amount;
        }
    });

    const sortedWeeks = Object.keys(weeklyData).sort();

    return {
        weeks: sortedWeeks.map(w => format(new Date(w), 'MMM dd')),
        income: sortedWeeks.map(w => weeklyData[w].income),
        expenses: sortedWeeks.map(w => weeklyData[w].expenses),
    };
};

export const getQuarterlyData = (transactions: Transaction[]): {
    quarters: string[];
    income: number[];
    expenses: number[];
} => {
    const quarterlyData: Record<string, { income: number; expenses: number }> = {};

    transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const year = date.getFullYear();
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        const quarterKey = `${year}-Q${quarter}`;

        if (!quarterlyData[quarterKey]) {
            quarterlyData[quarterKey] = { income: 0, expenses: 0 };
        }

        if (transaction.type === 'income') {
            quarterlyData[quarterKey].income += transaction.amount;
        } else {
            quarterlyData[quarterKey].expenses += transaction.amount;
        }
    });

    const sortedQuarters = Object.keys(quarterlyData).sort();

    return {
        quarters: sortedQuarters,
        income: sortedQuarters.map(q => quarterlyData[q].income),
        expenses: sortedQuarters.map(q => quarterlyData[q].expenses),
    };
};

export const getYearlyData = (transactions: Transaction[]): {
    years: string[];
    income: number[];
    expenses: number[];
} => {
    const yearlyData: Record<string, { income: number; expenses: number }> = {};

    transactions.forEach(transaction => {
        const year = new Date(transaction.date).getFullYear().toString();

        if (!yearlyData[year]) {
            yearlyData[year] = { income: 0, expenses: 0 };
        }

        if (transaction.type === 'income') {
            yearlyData[year].income += transaction.amount;
        } else {
            yearlyData[year].expenses += transaction.amount;
        }
    });

    const sortedYears = Object.keys(yearlyData).sort();

    return {
        years: sortedYears,
        income: sortedYears.map(y => yearlyData[y].income),
        expenses: sortedYears.map(y => yearlyData[y].expenses),
    };
};

// ============================================================================
// MULTI-PERIOD BUDGET CALCULATIONS
// ============================================================================

export const calculateBudgetProgressForPeriod = (
    transactions: Transaction[],
    category: string,
    limit: number,
    period: BudgetPeriod,
    referenceDate: Date = new Date()
): {
    spent: number;
    remaining: number;
    percentage: number;
    status: 'safe' | 'caution' | 'warning' | 'over';
} => {
    const periodTransactions = getTransactionsForPeriod(transactions, period, referenceDate);

    const spent = periodTransactions
        .filter(t => t.type === 'expense' && t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);

    const remaining = limit - spent;
    const percentage = (spent / limit) * 100;

    let status: 'safe' | 'caution' | 'warning' | 'over' = 'safe';
    if (percentage >= 100) status = 'over';
    else if (percentage >= 90) status = 'warning';
    else if (percentage >= 75) status = 'caution';

    return { spent, remaining, percentage, status };
};

// ============================================================================
// SAVINGS GOAL CALCULATIONS
// ============================================================================

export const calculateGoalProgress = (goal: SavingsGoal): {
    percentage: number;
    remaining: number;
    isComplete: boolean;
} => {
    const percentage = (goal.currentAmount / goal.targetAmount) * 100;
    const remaining = goal.targetAmount - goal.currentAmount;

    return {
        percentage: Math.min(percentage, 100),
        remaining: Math.max(remaining, 0),
        isComplete: goal.currentAmount >= goal.targetAmount
    };
};

export const calculateMonthsToGoal = (
    goal: SavingsGoal,
    averageMonthlySavings: number
): number | null => {
    if (averageMonthlySavings <= 0) return null;

    const remaining = goal.targetAmount - goal.currentAmount;
    if (remaining <= 0) return 0;

    return Math.ceil(remaining / averageMonthlySavings);
};

export const getAverageMonthlySavings = (transactions: Transaction[]): number => {
    // Get last 3 months of data
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const recentTransactions = transactions.filter(t => new Date(t.date) >= threeMonthsAgo);

    if (recentTransactions.length === 0) return 0;

    const totalIncome = calculateTotalIncome(recentTransactions);
    const totalExpenses = calculateTotalExpenses(recentTransactions);
    const savings = totalIncome - totalExpenses;

    return savings / 3; // Average per month
};

// ============================================================================
// FINANCIAL HEALTH & ANALYTICS
// ============================================================================

export const calculateFinancialHealthScore = (
    transactions: Transaction[],
    budgetGoals: BudgetGoals
): FinancialHealthMetrics => {
    const income = calculateTotalIncome(transactions);
    const expenses = calculateTotalExpenses(transactions);

    // 1. Income/Expense Ratio (40 points)
    const incomeExpenseRatio = income > 0 ? (income - expenses) / income : 0;
    const ratioScore = Math.min(Math.max(incomeExpenseRatio * 100, 0), 40);

    // 2. Budget Adherence (30 points)
    let budgetScore = 30;
    const budgetEntries = Object.entries(budgetGoals);
    if (budgetEntries.length > 0) {
        const adherenceScores = budgetEntries.map(([category, limit]) => {
            const progress = calculateBudgetProgress(transactions, category, limit);
            if (progress.percentage <= 100) return 1;
            if (progress.percentage <= 110) return 0.5;
            return 0;
        });
        const avgAdherence = adherenceScores.reduce((a: number, b: number) => a + b, 0) / adherenceScores.length;
        budgetScore = avgAdherence * 30;
    }

    // 3. Savings Rate (30 points)
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
    const savingsScore = Math.min(Math.max(savingsRate, 0), 30);

    const totalScore = Math.round(ratioScore + budgetScore + savingsScore);

    // Determine trend
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (totalScore >= 70) trend = 'improving';
    else if (totalScore < 50) trend = 'declining';

    return {
        score: totalScore,
        savingsRate,
        incomeExpenseRatio,
        budgetAdherence: budgetScore / 30 * 100,
        trend
    };
};

export const detectSpendingAnomalies = (transactions: Transaction[]): SpendingTrend[] => {
    const thisMonth = startOfMonth(new Date());
    const lastMonth = startOfMonth(addMonths(new Date(), -1));

    const currentMonthTx = transactions.filter(t => new Date(t.date) >= thisMonth);
    const lastMonthTx = transactions.filter(t => {
        const date = new Date(t.date);
        return date >= lastMonth && date < thisMonth;
    });

    const currentByCategory = groupByCategory(currentMonthTx.filter(t => t.type === 'expense'));
    const lastByCategory = groupByCategory(lastMonthTx.filter(t => t.type === 'expense'));

    const allCategories = new Set([...Object.keys(currentByCategory), ...Object.keys(lastByCategory)]);

    return Array.from(allCategories).map(category => {
        const current = currentByCategory[category] || 0;
        const previous = lastByCategory[category] || 0;
        const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;

        // Anomaly if change > 50%
        const isAnomaly = Math.abs(change) > 50;

        return {
            category,
            currentPeriod: current,
            previousPeriod: previous,
            change,
            isAnomaly
        };
    });
};

export const predictNextMonthExpenses = (transactions: Transaction[]): number => {
    // Simple moving average of last 3 months
    const last3Months = [];
    for (let i = 0; i < 3; i++) {
        const monthStart = startOfMonth(addMonths(new Date(), -i));
        const monthEnd = endOfMonth(addMonths(new Date(), -i));

        const monthTx = transactions.filter(t => {
            const date = new Date(t.date);
            return date >= monthStart && date <= monthEnd && t.type === 'expense';
        });

        last3Months.push(calculateTotalExpenses(monthTx));
    }

    if (last3Months.length === 0) return 0;
    return last3Months.reduce((a, b) => a + b, 0) / last3Months.length;
};

export const compareYearOverYear = (transactions: Transaction[], category?: string): {
    thisYear: number;
    lastYear: number;
    change: number;
} => {
    const thisYearStart = startOfYear(new Date());
    const lastYearStart = startOfYear(addYears(new Date(), -1));
    const lastYearEnd = endOfYear(addYears(new Date(), -1));

    let thisYearTx = transactions.filter(t => new Date(t.date) >= thisYearStart);
    let lastYearTx = transactions.filter(t => {
        const date = new Date(t.date);
        return date >= lastYearStart && date <= lastYearEnd;
    });

    if (category) {
        thisYearTx = thisYearTx.filter(t => t.category === category);
        lastYearTx = lastYearTx.filter(t => t.category === category);
    }

    const thisYear = thisYearTx.reduce((sum, t) => sum + (t.type === 'expense' ? t.amount : 0), 0);
    const lastYear = lastYearTx.reduce((sum, t) => sum + (t.type === 'expense' ? t.amount : 0), 0);

    const change = lastYear > 0 ? ((thisYear - lastYear) / lastYear) * 100 : 0;

    return { thisYear, lastYear, change };
};

// ============================================================================
// RECURRING TRANSACTION PROCESSING
// ============================================================================

export const getNextRecurringDate = (
    frequency: string,
    currentDate: Date
): Date => {
    switch (frequency) {
        case 'daily':
            return addDays(currentDate, 1);
        case 'weekly':
            return addWeeks(currentDate, 1);
        case 'monthly':
            return addMonths(currentDate, 1);
        case 'yearly':
            return addYears(currentDate, 1);
        default:
            return currentDate;
    }
};

export const shouldProcessRecurringTransaction = (
    recurring: RecurringTransaction,
    today: Date = new Date()
): boolean => {
    if (!recurring.isActive) return false;

    const nextDate = new Date(recurring.nextDate);

    // Check if next date has passed
    if (nextDate > today) return false;

    // Check if end date has passed
    if (recurring.endDate) {
        const endDate = new Date(recurring.endDate);
        if (today > endDate) return false;
    }

    return true;
};

export const processRecurringTransactions = (
    recurringTransactions: RecurringTransaction[],
    today: Date = new Date()
): {
    newTransactions: Omit<Transaction, 'id'>[];
    updatedRecurring: RecurringTransaction[];
} => {
    const newTransactions: Omit<Transaction, 'id'>[] = [];
    const updatedRecurring: RecurringTransaction[] = [];

    recurringTransactions.forEach(recurring => {
        if (shouldProcessRecurringTransaction(recurring, today)) {
            // Create new transaction
            newTransactions.push({
                date: recurring.nextDate,
                type: recurring.type,
                category: recurring.category,
                description: recurring.description,
                amount: recurring.amount,
                currency: recurring.currency,
                tags: recurring.tags,
                recurringId: recurring.id
            });

            // Update next date
            const currentNext = new Date(recurring.nextDate);
            const newNextDate = getNextRecurringDate(recurring.frequency, currentNext);

            updatedRecurring.push({
                ...recurring,
                nextDate: newNextDate.toISOString().split('T')[0]
            });
        } else {
            updatedRecurring.push(recurring);
        }
    });

    return { newTransactions, updatedRecurring };
};

// ============================================================================
// BALANCE OVER TIME (for line chart)
// ============================================================================

export const getBalanceOverTime = (transactions: Transaction[]): {
    dates: string[];
    balances: number[];
} => {
    if (transactions.length === 0) return { dates: [], balances: [] };

    // Sort by date
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const balanceData: { date: string; balance: number }[] = [];
    let runningBalance = 0;

    sorted.forEach(tx => {
        const amount = tx.type === 'income' ? tx.amount : -tx.amount;
        runningBalance += amount;

        balanceData.push({
            date: tx.date,
            balance: runningBalance
        });
    });

    return {
        dates: balanceData.map(d => d.date),
        balances: balanceData.map(d => d.balance)
    };
};
