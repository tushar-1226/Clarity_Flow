'use client';

import { useBudgetStore } from '@/store/budgetStore';
import { calculateCategoryTrends } from '@/lib/analytics';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { subMonths } from 'date-fns';

const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function CategoryTrendChart() {
    // Selective subscription
    const transactions = useBudgetStore(state => state.transactions);

    const endDate = new Date();
    const startDate = subMonths(endDate, 5); // Last 6 months

    const categoryTrends = calculateCategoryTrends(transactions, startDate, endDate, 5);

    // Transform data for stacked area chart
    const chartData = categoryTrends[0]?.data.map((_, monthIndex) => {
        const dataPoint: any = {
            month: categoryTrends[0].data[monthIndex].month,
        };

        categoryTrends.forEach((trend) => {
            dataPoint[trend.category] = trend.data[monthIndex].amount;
        });

        return dataPoint;
    }) || [];

    if (categoryTrends.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Category Trends</h2>
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No expense data available for category trends.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Top 5 Expense Categories</h2>

            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
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
                    {categoryTrends.map((trend, index) => (
                        <Area
                            key={trend.category}
                            type="monotone"
                            dataKey={trend.category}
                            stackId="1"
                            stroke={CHART_COLORS[index % CHART_COLORS.length]}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                            fillOpacity={0.6}
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categoryTrends.map((trend, index) => (
                    <div key={trend.category} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                            />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{trend.category}</span>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                ${trend.total.toFixed(0)}
                            </div>
                            <div className={`text-xs ${trend.change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {trend.change >= 0 ? '+' : ''}{trend.change.toFixed(1)}%
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
