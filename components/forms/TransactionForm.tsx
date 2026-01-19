'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useBudgetStore } from '@/store/budgetStore';
import { TransactionType, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types';
import { format } from 'date-fns';

export function TransactionForm() {
    // Selective subscription
    const addTransaction = useBudgetStore(state => state.addTransaction);

    const [formData, setFormData] = useState({
        date: format(new Date(), 'yyyy-MM-dd'),
        type: 'expense' as TransactionType,
        category: EXPENSE_CATEGORIES[0] as string,
        description: '',
        amount: '',
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

        addTransaction({
            date: formData.date,
            type: formData.type,
            category: formData.category,
            description: formData.description,
            amount: parseFloat(formData.amount),
        });

        // Reset form
        setFormData({
            date: format(new Date(), 'yyyy-MM-dd'),
            type: 'expense',
            category: EXPENSE_CATEGORIES[0],
            description: '',
            amount: '',
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Add Transaction
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date
                    </label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>

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
                        Category
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        placeholder="Enter description..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    <Plus className="w-5 h-5" />
                    Add Transaction
                </button>
            </form>
        </div>
    );
}
