import { Transaction } from '@/types';
import { startOfMonth, endOfMonth, eachMonthOfInterval, format, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';

export interface MonthlyTotal {
    month: string;
    income: number;
    expenses: number;
    net: number;
    date: Date;
}

export interface CategoryTrend {
    category: string;
    data: { month: string; amount: number }[];
    total: number;
    change: number; // Percentage change from previous period
}

export interface FinancialHealthData {
    score: number;
    savingsRate: number;
    budgetAdherence: number;
    incomeStability: number;
    categoryBalance: number;
    trend: 'improving' | 'stable' | 'declining';
}

/**
 * Calculate monthly totals for a given date range
 */
export function calculateMonthlyTotals(
    transactions: Transaction[],
    startDate: Date,
    endDate: Date
): MonthlyTotal[] {
    const months = eachMonthOfInterval({ start: startDate, end: endDate });

    return months.map((monthDate) => {
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);

        const monthTransactions = transactions.filter((t) => {
            const txDate = new Date(t.date);
            return txDate >= monthStart && txDate <= monthEnd;
        });

        const income = monthTransactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expenses = monthTransactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            month: format(monthDate, 'MMM yyyy'),
            income,
            expenses,
            net: income - expenses,
            date: monthDate,
        };
    });
}

/**
 * Calculate savings rate percentage
 */
export function calculateSavingsRate(income: number, expenses: number): number {
    if (income === 0) return 0;
    return ((income - expenses) / income) * 100;
}

/**
 * Calculate category trends over time
 */
export function calculateCategoryTrends(
    transactions: Transaction[],
    startDate: Date,
    endDate: Date,
    topN: number = 5
): CategoryTrend[] {
    const months = eachMonthOfInterval({ start: startDate, end: endDate });

    // Get all expense categories with total amounts
    const categoryTotals: Record<string, number> = {};
    transactions
        .filter((t) => t.type === 'expense')
        .forEach((t) => {
            categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        });

    // Get top N categories
    const topCategories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .map(([category]) => category);

    // Calculate monthly data for each category
    return topCategories.map((category) => {
        const monthlyData = months.map((monthDate) => {
            const monthStart = startOfMonth(monthDate);
            const monthEnd = endOfMonth(monthDate);

            const amount = transactions
                .filter((t) => {
                    const txDate = new Date(t.date);
                    return (
                        t.type === 'expense' &&
                        t.category === category &&
                        txDate >= monthStart &&
                        txDate <= monthEnd
                    );
                })
                .reduce((sum, t) => sum + t.amount, 0);

            return {
                month: format(monthDate, 'MMM yyyy'),
                amount,
            };
        });

        // Calculate percentage change from first to last period
        const firstAmount = monthlyData[0]?.amount || 0;
        const lastAmount = monthlyData[monthlyData.length - 1]?.amount || 0;
        const change = firstAmount === 0 ? 0 : ((lastAmount - firstAmount) / firstAmount) * 100;

        return {
            category,
            data: monthlyData,
            total: categoryTotals[category],
            change,
        };
    });
}

/**
 * Calculate Financial Health Score (0-100)
 */
export function calculateFinancialHealthScore(
    transactions: Transaction[],
    budgetGoals: Record<string, number>
): FinancialHealthData {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(new Date(now.getFullYear(), now.getMonth() - 1));
    const lastMonthEnd = endOfMonth(lastMonthStart);

    // Current month transactions
    const currentTx = transactions.filter((t) => new Date(t.date) >= currentMonthStart);
    const income = currentTx.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = currentTx.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    // Previous month transactions for comparison
    const lastTx = transactions.filter((t) => {
        const date = new Date(t.date);
        return date >= lastMonthStart && date <= lastMonthEnd;
    });
    const lastIncome = lastTx.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const lastExpenses = lastTx.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    // 1. Savings Rate (40% weight) - Target: 20%+
    const savingsRate = calculateSavingsRate(income, expenses);
    const savingsScore = Math.min((savingsRate / 20) * 40, 40);

    // 2. Budget Adherence (30% weight)
    let budgetScore = 30;
    if (Object.keys(budgetGoals).length > 0) {
        const categoryExpenses: Record<string, number> = {};
        currentTx
            .filter((t) => t.type === 'expense')
            .forEach((t) => {
                categoryExpenses[t.category] = (categoryExpenses[t.category] || 0) + t.amount;
            });

        let totalAdherence = 0;
        let categoriesWithBudgets = 0;

        Object.entries(budgetGoals).forEach(([category, limit]) => {
            const spent = categoryExpenses[category] || 0;
            const adherence = Math.max(0, 100 - ((spent - limit) / limit) * 100);
            totalAdherence += Math.min(adherence, 100);
            categoriesWithBudgets++;
        });

        const budgetAdherence = categoriesWithBudgets > 0 ? totalAdherence / categoriesWithBudgets : 100;
        budgetScore = (budgetAdherence / 100) * 30;
    }

    // 3. Income Stability (15% weight)
    const incomeChange = lastIncome === 0 ? 0 : Math.abs((income - lastIncome) / lastIncome);
    const stabilityScore = Math.max(0, 15 - incomeChange * 15);

    // 4. Expense Categories Balance (15% weight)
    const expenseCategories = currentTx.filter((t) => t.type === 'expense');
    const uniqueCategories = new Set(expenseCategories.map((t) => t.category)).size;
    const balanceScore = uniqueCategories >= 3 ? 15 : (uniqueCategories / 3) * 15;

    const totalScore = Math.round(savingsScore + budgetScore + stabilityScore + balanceScore);

    // Determine trend
    const lastScore = calculateSavingsRate(lastIncome, lastExpenses);
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (savingsRate > lastScore + 5) trend = 'improving';
    else if (savingsRate < lastScore - 5) trend = 'declining';

    return {
        score: totalScore,
        savingsRate,
        budgetAdherence: budgetScore / 0.3,
        incomeStability: stabilityScore / 0.15,
        categoryBalance: balanceScore / 0.15,
        trend,
    };
}

/**
 * Group transactions by period
 */
export function groupTransactionsByPeriod(
    transactions: Transaction[],
    period: 'day' | 'week' | 'month'
): Record<string, Transaction[]> {
    const grouped: Record<string, Transaction[]> = {};

    transactions.forEach((transaction) => {
        const date = new Date(transaction.date);
        let key: string;

        switch (period) {
            case 'day':
                key = format(date, 'yyyy-MM-dd');
                break;
            case 'week':
                key = format(startOfWeek(date), 'yyyy-MM-dd');
                break;
            case 'month':
                key = format(startOfMonth(date), 'yyyy-MM');
                break;
        }

        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(transaction);
    });

    return grouped;
}

/**
 * Calculate year-over-year comparison
 */
export function calculateYearOverYearComparison(
    transactions: Transaction[],
    currentYear: number
): {
    currentYear: MonthlyTotal[];
    previousYear: MonthlyTotal[];
} {
    const currentYearStart = new Date(currentYear, 0, 1);
    const currentYearEnd = new Date(currentYear, 11, 31);
    const previousYearStart = new Date(currentYear - 1, 0, 1);
    const previousYearEnd = new Date(currentYear - 1, 11, 31);

    return {
        currentYear: calculateMonthlyTotals(transactions, currentYearStart, currentYearEnd),
        previousYear: calculateMonthlyTotals(transactions, previousYearStart, previousYearEnd),
    };
}
