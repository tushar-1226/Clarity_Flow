'use client';

import { useBudgetStore } from '@/store/budgetStore';
import { calculateFinancialHealthScore } from '@/lib/analytics';
import { TrendingUp, TrendingDown, Minus, Target, PiggyBank, Activity, LayoutGrid } from 'lucide-react';

export default function FinancialHealthScore() {
    const { transactions, budgetGoals } = useBudgetStore();

    const healthData = calculateFinancialHealthScore(transactions, budgetGoals);

    // Determine score color and label
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 dark:text-green-400';
        if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
        if (score >= 40) return 'text-orange-600 dark:text-orange-400';
        return 'text-red-600 dark:text-red-400';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Needs Improvement';
    };

    const getTrendIcon = () => {
        switch (healthData.trend) {
            case 'improving':
                return <TrendingUp className="w-5 h-5 text-green-600" />;
            case 'declining':
                return <TrendingDown className="w-5 h-5 text-red-600" />;
            default:
                return <Minus className="w-5 h-5 text-gray-600" />;
        }
    };

    const scoreColor = getScoreColor(healthData.score);
    const scoreLabel = getScoreLabel(healthData.score);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Financial Health Score</h2>

            {/* Main Score */}
            <div className="flex items-center justify-center mb-6">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full border-8 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                        <div className={`text-center`}>
                            <div className={`text-4xl font-bold ${scoreColor}`}>{healthData.score}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">/ 100</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center mb-6">
                <div className={`text-lg font-semibold ${scoreColor}`}>{scoreLabel}</div>
                <div className="flex items-center justify-center gap-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {getTrendIcon()}
                    <span className="capitalize">{healthData.trend}</span>
                </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <PiggyBank className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Savings Rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${Math.min(healthData.savingsRate, 100)}%` }}
                            />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                            {Math.round(healthData.savingsRate)}%
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Budget Adherence</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${Math.min(healthData.budgetAdherence, 100)}%` }}
                            />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                            {Math.round(healthData.budgetAdherence)}%
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Income Stability</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-purple-600 h-2 rounded-full"
                                style={{ width: `${Math.min(healthData.incomeStability, 100)}%` }}
                            />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                            {Math.round(healthData.incomeStability)}%
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <LayoutGrid className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Expense Balance</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-orange-600 h-2 rounded-full"
                                style={{ width: `${Math.min(healthData.categoryBalance, 100)}%` }}
                            />
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                            {Math.round(healthData.categoryBalance)}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
