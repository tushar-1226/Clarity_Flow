'use client';

import { useBudgetStore } from '@/store/budgetStore';
import { getMonthlyData } from '@/lib/calculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function MonthlyBarChart() {
    const { transactions } = useBudgetStore();
    const monthlyData = getMonthlyData(transactions);

    const data = monthlyData.months.map((month, index) => ({
        month,
        income: monthlyData.income[index],
        expenses: monthlyData.expenses[index],
    }));

    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Monthly Overview
                </h3>
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500 dark:text-gray-400">
                        No monthly data available
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
                Monthly Overview
            </h3>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                        dataKey="month"
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                        contentStyle={{
                            backgroundColor: '#1f2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#fff',
                        }}
                    />
                    <Legend />
                    <Bar dataKey="income" fill="#10b981" name="Income" />
                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
