'use client';

import { useBudgetStore } from '@/store/budgetStore';
import { getBalanceOverTime } from '@/lib/calculations';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export function BalanceLineChart() {
    const { transactions } = useBudgetStore();
    const balanceData = getBalanceOverTime(transactions);

    const data = balanceData.dates.map((date, index) => ({
        date,
        balance: balanceData.balances[index],
        displayDate: format(new Date(date), 'MMM dd'),
    }));

    if (data.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Balance Over Time
                </h3>
                <div className="flex items-center justify-center h-64">
                    <p className="text-gray-500 dark:text-gray-400">
                        No balance data available
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

    const minBalance = Math.min(...balanceData.balances);
    const maxBalance = Math.max(...balanceData.balances);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Balance Over Time
            </h3>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <defs>
                        <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis
                        dataKey="displayDate"
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                    />
                    <YAxis
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => formatCurrency(value)}
                        domain={[minBalance < 0 ? minBalance * 1.1 : 0, maxBalance * 1.1]}
                    />
                    <Tooltip
                        formatter={(value: number | undefined) => value !== undefined ? [formatCurrency(value), 'Balance'] : ['N/A', 'Balance']}
                        contentStyle={{
                            backgroundColor: '#1f2937',
                            border: '1px solid #374151',
                            borderRadius: '8px',
                            color: '#fff',
                        }}
                        labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Line
                        type="monotone"
                        dataKey="balance"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', r: 3 }}
                        activeDot={{ r: 5 }}
                        fill="url(#balanceGradient)"
                    />
                </LineChart>
            </ResponsiveContainer>

            <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Current</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(balanceData.balances[balanceData.balances.length - 1] || 0)}
                    </p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Peak</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(maxBalance)}
                    </p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Lowest</p>
                    <p className="text-lg font-bold text-red-600 dark:text-red-400">
                        {formatCurrency(minBalance)}
                    </p>
                </div>
            </div>
        </div>
    );
}
