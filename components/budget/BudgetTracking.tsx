'use client';

import { X } from 'lucide-react';
import { useBudgetStore } from '@/store/budgetStore';
import { calculateBudgetProgress } from '@/lib/calculations';

export function BudgetTracking() {
    // Selective subscriptions
    const transactions = useBudgetStore(state => state.transactions);
    const budgetGoals = useBudgetStore(state => state.budgetGoals);
    const removeBudgetGoal = useBudgetStore(state => state.removeBudgetGoal);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getProgressColor = (status: string) => {
        switch (status) {
            case 'safe':
                return 'bg-green-500';
            case 'caution':
                return 'bg-yellow-500';
            case 'warning':
                return 'bg-orange-500';
            case 'over':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    const getProgressBgColor = (status: string) => {
        switch (status) {
            case 'safe':
                return 'bg-green-100 dark:bg-green-900/20';
            case 'caution':
                return 'bg-yellow-100 dark:bg-yellow-900/20';
            case 'warning':
                return 'bg-orange-100 dark:bg-orange-900/20';
            case 'over':
                return 'bg-red-100 dark:bg-red-900/20';
            default:
                return 'bg-gray-100 dark:bg-gray-700';
        }
    };

    const handleRemove = (category: string) => {
        if (confirm(`Remove budget goal for ${category}?`)) {
            removeBudgetGoal(category);
        }
    };

    const budgetEntries = Object.entries(budgetGoals);

    if (budgetEntries.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Budget Tracking
                </h2>
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No budget goals set. Set a budget goal to start tracking your spending!
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Budget Tracking
            </h2>

            <div className="space-y-4">
                {budgetEntries.map(([category, limit]) => {
                    const progress = calculateBudgetProgress(transactions, category, limit);
                    const displayPercentage = Math.min(progress.percentage, 100);

                    return (
                        <div key={category} className={`p-4 rounded-lg ${getProgressBgColor(progress.status)}`}>
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {category}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatCurrency(progress.spent)} of {formatCurrency(limit)}
                                        {progress.remaining < 0 && (
                                            <span className="ml-2 text-red-600 dark:text-red-400 font-medium">
                                                ({formatCurrency(Math.abs(progress.remaining))} over)
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleRemove(category)}
                                    className="p-1 hover:bg-white/50 dark:hover:bg-black/20 rounded transition-colors"
                                    aria-label={`Remove ${category} budget goal`}
                                >
                                    <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>

                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                <div
                                    className={`h-full ${getProgressColor(progress.status)} transition-all duration-300`}
                                    style={{ width: `${displayPercentage}%` }}
                                />
                            </div>

                            <div className="mt-2 flex items-center justify-between text-sm">
                                <span className={`font-medium ${progress.status === 'over'
                                    ? 'text-red-600 dark:text-red-400'
                                    : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                    {progress.percentage.toFixed(1)}% used
                                </span>
                                <span className={`font-semibold ${progress.status === 'safe'
                                    ? 'text-green-600 dark:text-green-400'
                                    : progress.status === 'caution'
                                        ? 'text-yellow-600 dark:text-yellow-400'
                                        : progress.status === 'warning'
                                            ? 'text-orange-600 dark:text-orange-400'
                                            : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    {progress.status === 'safe' && '✓ Safe'}
                                    {progress.status === 'caution' && '⚠ Caution'}
                                    {progress.status === 'warning' && '⚠ Warning'}
                                    {progress.status === 'over' && '✗ Over Budget'}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
