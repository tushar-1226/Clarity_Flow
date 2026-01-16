'use client';

import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useBudgetStore } from '@/store/budgetStore';
import { TransactionType, INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/types';
import { format } from 'date-fns';

export function QuickAddButton() {
    const [isOpen, setIsOpen] = useState(false);
    const { addTransaction, baseCurrency } = useBudgetStore();
    const [formData, setFormData] = useState({
        type: 'expense' as TransactionType,
        category: EXPENSE_CATEGORIES[0] as string,
        amount: '',
    });

    const categories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        addTransaction({
            date: format(new Date(), 'yyyy-MM-dd'),
            type: formData.type,
            category: formData.category,
            description: `Quick add - ${formData.category}`,
            amount: parseFloat(formData.amount),
            currency: baseCurrency,
        });

        // Reset and close
        setFormData({
            ...formData,
            amount: '',
        });
        setIsOpen(false);
    };

    const handleTypeChange = (type: TransactionType) => {
        setFormData({
            ...formData,
            type,
            category: type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
        });
    };

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 animate-pulse hover:animate-none"
                    aria-label="Quick add transaction"
                >
                    <Plus className="w-6 h-6" />
                </button>
            )}

            {/* Quick Add Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Modal */}
                        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 animate-slideUp">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Quick Add Transaction
                                </h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Type Toggle */}
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleTypeChange('income')}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${formData.type === 'income'
                                                ? 'bg-green-600 text-white'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        Income
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleTypeChange('expense')}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${formData.type === 'expense'
                                                ? 'bg-red-600 text-white'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        Expense
                                    </button>
                                </div>

                                {/* Category */}
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

                                {/* Amount */}
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
                                        autoFocus
                                        className="w-full px-3 py-2 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
                                >
                                    Add Transaction
                                </button>
                            </form>

                            <p className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400">
                                Press ESC to close
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </>
    );
}
