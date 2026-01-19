'use client';

import { useMemo } from 'react';

import { useBudgetStore } from '@/store/budgetStore';
import { getExpensesByCategory } from '@/lib/calculations';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = [
    '#3b82f6', // blue
    '#ef4444', // red
    '#10b981', // green
    '#f59e0b', // amber
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
    '#6366f1', // indigo
];

export function ExpensePieChart() {
    // Selective subscription - only re-renders when transactions change
    const transactions = useBudgetStore(state => state.transactions);

    // Memoize expensive calculations
    const expensesByCategory = useMemo(
        () => getExpensesByCategory(transactions),
        [transactions]
    );

    const data = useMemo(
        () => Object.entries(expensesByCategory).map(([name, value]) => ({
            name,
            value,
        })),
        [expensesByCategory]
    );

    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Expense Categories
                </h3>
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500 dark:text-gray-400">
                        No expense data available
                    </p>
                </div>
            </div>
        );
    }

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Expense Categories
            </h3>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
