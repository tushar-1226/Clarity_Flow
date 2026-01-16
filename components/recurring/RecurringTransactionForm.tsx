'use client';

import { useState } from 'react';
import { useBudgetStore } from '@/store/budgetStore';
import { Plus } from 'lucide-react';
import { TransactionType, INCOME_CATEGORIES, EXPENSE_CATEGORIES, RecurrenceFrequency } from '@/types';
import { format, addDays } from 'date-fns';

export function RecurringTransactionForm() {
    const { addRecurringTransaction } = useBudgetStore();
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        type: 'expense' as TransactionType,
        category: EXPENSE_CATEGORIES[0] as string,
        description: '',
        amount: '',
        frequency: 'monthly' as RecurrenceFrequency,
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: '',
    });

    const categories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    const handleTypeChange = (type: TransactionType) => {
        setFormData({
            ...formData,
            type,
            category: type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        addRecurringTransaction({
            type: formData.type,
            category: formData.category,
            description: formData.description,
            amount: parseFloat(formData.amount),
            frequency: formData.frequency,
            startDate: formData.startDate,
            endDate: formData.endDate || undefined,
            nextDate: formData.startDate, // First occurrence
            isActive: true,
        });

        // Reset form
        setFormData({
            type: 'expense',
            category: EXPENSE_CATEGORIES[0],
            description: '',
            amount: '',
            frequency: 'monthly',
            startDate: format(new Date(), 'yyyy-MM-dd'),
            endDate: '',
        });
        setShowForm(false);
    };

    if (!showForm) {
        return (
            <button
                onClick={() => setShowForm(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
                <Plus className="w-5 h-5" />
                Create Recurring Transaction
            </button>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Create Recurring Transaction
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => handleTypeChange('income')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${formData.type === 'income'
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                        >
                            Income
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTypeChange('expense')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${formData.type === 'expense'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                        >
                            Expense
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Frequency
                    </label>
                    <select
                        value={formData.frequency}
                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value as RecurrenceFrequency })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Category
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                    </label>
                    <input
                        type="text"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="e.g., Netflix subscription, Monthly salary"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Amount
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            End Date (Optional)
                        </label>
                        <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            min={formData.startDate}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                        Create Recurring Transaction
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setShowForm(false);
                            setFormData({
                                type: 'expense',
                                category: EXPENSE_CATEGORIES[0],
                                description: '',
                                amount: '',
                                frequency: 'monthly',
                                startDate: format(new Date(), 'yyyy-MM-dd'),
                                endDate: '',
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
