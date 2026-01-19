'use client';

import MonthlyTrendChart from '@/components/charts/MonthlyTrendChart';
import CategoryTrendChart from '@/components/charts/CategoryTrendChart';
import FinancialHealthScore from '@/components/charts/FinancialHealthScore';
import { BarChart2 } from 'lucide-react';

export default function AnalyticsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <BarChart2 className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Analytics Dashboard
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Comprehensive insights into your financial health and spending patterns
                    </p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Financial Health Score - Spans 1 column */}
                    <div className="lg:col-span-1">
                        <FinancialHealthScore />
                    </div>

                    {/* Monthly Trend Chart - Spans 2 columns */}
                    <div className="lg:col-span-2">
                        <MonthlyTrendChart />
                    </div>

                    {/* Category Trends - Full width */}
                    <div className="lg:col-span-3">
                        <CategoryTrendChart />
                    </div>
                </div>
            </div>
        </div>
    );
}
