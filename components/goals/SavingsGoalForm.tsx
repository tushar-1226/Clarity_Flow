'use client';

import { useState } from 'react';
import { useBudgetStore } from '@/store/budgetStore';
import { Plus } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types';
import { format } from 'date-fns';

export function SavingsGoalForm() {
    const { addSavingsGoal, baseCurrency } = useBudgetStore();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        targetAmount: '',
        currentAmount: '',
        deadline: '',
        category: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
            alert('Please enter a valid goal name and target amount');
            return;
        }

        addSavingsGoal({
            name: formData.name,
            targetAmount: parseFloat(formData.targetAmount),
            currentAmount: formData.currentAmount ? parseFloat(formData.currentAmount) : 0,
            deadline: formData.deadline || undefined,
            category: formData.category || undefined,
            currency: baseCurrency,
            createdDate: format(new Date(), 'yyyy-MM-dd'),
        });

        // Reset form
        setFormData({
            name: '',
            targetAmount: '',
            currentAmount: '',
            deadline: '',
            category: '',
        });
        setShowForm(false);
    };

    if (!showForm) {
        return (
            <button
                onClick={() => setShowForm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
                <Plus className="w-5 h-5" />
                Create Savings Goal
            </button>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Create New Savings Goal
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Goal Name *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., New Laptop, Vacation, Emergency Fund"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Target Amount *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.targetAmount}
                            onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                            placeholder="0.00"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Amount
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.currentAmount}
                            onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                            placeholder="0.00"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Target Date (Optional)
                    </label>
                    <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category (Optional)
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="">-- Select Category --</option>
                        <optgroup label="General">
                            <option value="Emergency Fund">Emergency Fund</option>
                            <option value="Vacation">Vacation</option>
                            <option value="House">House/Property</option>
                            <option value="Vehicle">Vehicle</option>
                        </optgroup>
                        <optgroup label="Expense Categories">
                            {EXPENSE_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </optgroup>
                    </select>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                        Create Goal
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setShowForm(false);
                            setFormData({
                                name: '',
                                targetAmount: '',
                                currentAmount: '',
                                deadline: '',
                                category: '',
                            });
                        }}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
