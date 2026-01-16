'use client';

import { useBudgetStore } from '@/store/budgetStore';
import { calculateFinancialHealthScore } from '@/lib/calculations';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function FinancialHealthScore() {
    const { transactions, budgetGoals } = useBudgetStore();

    const healthMetrics = calculateFinancialHealthScore(transactions, budgetGoals);

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'text-green-600 dark:text-green-400';
        if (score >= 50) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getScoreBg = (score: number) => {
        if (score >= 70) return 'bg-green-100 dark:bg-green-900/20';
        if (score >= 50) return 'bg-yellow-100 dark:bg-yellow-900/20';
        return 'bg-red-100 dark:bg-red-900/20';
    };

    const getTrendIcon = () => {
        if (healthMetrics.trend === 'improving') return <TrendingUp className="w-5 h-5" />;
        if (healthMetrics.trend === 'declining') return <TrendingDown className="w-5 h-5" />;
        return <Minus className="w-5 h-5" />;
    };

    const getTrendText = () => {
        if (healthMetrics.trend === 'improving') return 'Improving';
        if (healthMetrics.trend === 'declining') return 'Declining';
        return 'Stable';
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Financial Health Score
            </h2>

            <div className={`${getScoreBg(healthMetrics.score)} rounded-lg p-6 mb-4`}>
                <div className="flex items-center justify-center mb-4">
                    <div className="relative w-32 h-32">
                        <svg className="w-32 h-32 transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                className="text-gray-300 dark:text-gray-600"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${(healthMetrics.score / 100) * 351.86} 351.86`}
                                className={getScoreColor(healthMetrics.score)}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-3xl font-bold ${getScoreColor(healthMetrics.score)}`}>
                                {healthMetrics.score}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={`flex items-center justify-center gap-2 ${getScoreColor(healthMetrics.score)}`}>
                    {getTrendIcon()}
                    <span className="font-semibold">{getTrendText()}</span>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Savings Rate</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {healthMetrics.savingsRate.toFixed(1)}%
                    </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Budget Adherence</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {healthMetrics.budgetAdherence.toFixed(1)}%
                    </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Income/Expense Ratio</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {healthMetrics.incomeExpenseRatio.toFixed(2)}
                    </span>
                </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-300">
                    {healthMetrics.score >= 70 && '🎉 Excellent! Your finances are in great shape.'}
                    {healthMetrics.score >= 50 && healthMetrics.score < 70 && '👍 Good progress! Focus on increasing your savings rate.'}
                    {healthMetrics.score < 50 && '⚠️ Consider reviewing your budget and reducing expenses.'}
                </p>
            </div>
        </div>
    );
}
