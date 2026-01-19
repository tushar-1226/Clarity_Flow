'use client';

import { useBudgetStore } from '@/store/budgetStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateMonthlyTotals } from '@/lib/analytics';
import { subMonths } from 'date-fns';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function MonthlyTrendChart() {
    // Selective subscription
    const transactions = useBudgetStore(state => state.transactions);

    // Calculate last 6 months of data
    const endDate = new Date();
    const startDate = subMonths(endDate, 5); // 6 months total including current

    const monthlyData = calculateMonthlyTotals(transactions, startDate, endDate);

    //Calculate trend for net savings
    const avgChange = monthlyData.length > 1
        ? (monthlyData[monthlyData.length - 1].net - monthlyData[0].net) / monthlyData.length
        : 0;

    const TrendIcon = avgChange > 0 ? TrendingUp : avgChange < 0 ? TrendingDown : Minus;
    const trendColor = avgChange > 0 ? 'text-green-600' : avgChange < 0 ? 'text-red-600' : 'text-gray-600';

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Monthly Trends</h2>
                <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
                    <TrendIcon className="w-4 h-4" />
                    <span className="font-medium">
                        {avgChange > 0 ? 'Improving' : avgChange < 0 ? 'Declining' : 'Stable'}
                    </span>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis
                        dataKey="month"
                        stroke="#6B7280"
                        style={{ fontSize: '12px' }}
                    />
                    <YAxis
                        stroke="#6B7280"
                        style={{ fontSize: '12px' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1F2937',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                        }}
                        formatter={(value: number | undefined) => value ? `$${value.toFixed(2)}` : '$0.00'}
                    />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#10B981"
                        strokeWidth={2}
                        name="Income"
                        dot={{ fill: '#10B981', r: 4 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="expenses"
                        stroke="#EF4444"
                        strokeWidth={2}
                        name="Expenses"
                        dot={{ fill: '#EF4444', r: 4 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="net"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        name="Net Savings"
                        dot={{ fill: '#3B82F6', r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
