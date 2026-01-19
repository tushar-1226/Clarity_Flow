'use client';

import { useState } from 'react';
import { useBudgetStore } from '@/store/budgetStore';
import { Target, Plus, Trash2, TrendingUp } from 'lucide-react';
import { calculateGoalProgress, calculateMonthsToGoal, getAverageMonthlySavings } from '@/lib/calculations';
import { format } from 'date-fns';

export function SavingsGoalTracker() {
    // Selective subscriptions
    const savingsGoals = useBudgetStore(state => state.savingsGoals);
    const transactions = useBudgetStore(state => state.transactions);
    const deleteSavingsGoal = useBudgetStore(state => state.deleteSavingsGoal);
    const contributeToSavingsGoal = useBudgetStore(state => state.contributeToSavingsGoal);
    const baseCurrency = useBudgetStore(state => state.baseCurrency);
    const [showForm, setShowForm] = useState(false);

    const averageSavings = getAverageMonthlySavings(transactions);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: baseCurrency,
        }).format(amount);
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this savings goal?')) {
            deleteSavingsGoal(id);
        }
    };

    const handleQuickContribute = (id: string) => {
        const amount = prompt('Enter amount to add to this goal:');
        if (amount && !isNaN(parseFloat(amount))) {
            contributeToSavingsGoal(id, parseFloat(amount));
        }
    };

    if (savingsGoals.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Savings Goals
                    </h2>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Goal
                    </button>
                </div>
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No savings goals set. Create a goal to start tracking your progress!
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Savings Goals
                </h2>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Add Goal
                </button>
            </div>

            <div className="space-y-4">
                {savingsGoals.map((goal) => {
                    const progress = calculateGoalProgress(goal);
                    const monthsToGoal = calculateMonthsToGoal(goal, averageSavings);

                    return (
                        <div
                            key={goal.id}
                            className={`p-4 rounded-lg border-2 ${progress.isComplete
                                ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                                : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                                        {goal.name}
                                        {progress.isComplete && ' ✅'}
                                    </h3>
                                    {goal.deadline && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Target: {format(new Date(goal.deadline), 'MMM dd, yyyy')}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleQuickContribute(goal.id)}
                                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                        title="Add funds"
                                    >
                                        <TrendingUp className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(goal.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Delete goal"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-2">
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                                    </span>
                                    <span className="font-semibold text-gray-900 dark:text-white">
                                        {progress.percentage.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-300 ${progress.isComplete
                                            ? 'bg-green-500'
                                            : progress.percentage >= 75
                                                ? 'bg-blue-500'
                                                : progress.percentage >= 50
                                                    ? 'bg-yellow-500'
                                                    : 'bg-purple-500'
                                            }`}
                                        style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                    {progress.isComplete
                                        ? '🎉 Goal Complete!'
                                        : `${formatCurrency(progress.remaining)} remaining`}
                                </span>
                                {!progress.isComplete && monthsToGoal !== null && (
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {monthsToGoal === 0
                                            ? 'Almost there!'
                                            : `~${monthsToGoal} month${monthsToGoal !== 1 ? 's' : ''} to go`}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
