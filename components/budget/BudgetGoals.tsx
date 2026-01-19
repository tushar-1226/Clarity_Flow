'use client';

import { useState } from 'react';
import { Target } from 'lucide-react';
import { useBudgetStore } from '@/store/budgetStore';
import { EXPENSE_CATEGORIES } from '@/types';

export function BudgetGoals() {
    // Selective subscription
    const setBudgetGoal = useBudgetStore(state => state.setBudgetGoal);
    const [category, setCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
    const [limit, setLimit] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!limit || parseFloat(limit) <= 0) {
            alert('Please enter a valid budget limit');
            return;
        }

        setBudgetGoal(category, parseFloat(limit));
        setLimit('');
        alert(`Budget goal set for ${category}`);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                <Target className="w-5 h-5 inline mr-2" />
                Set Budget Goals
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Expense Category
                    </label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {EXPENSE_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Monthly Limit
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                        placeholder="Enter budget limit..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                    Set Budget Goal
                </button>
            </form>
        </div>
    );
}
