'use client';

import { useState } from 'react';
import { useBudgetStore } from '@/store/budgetStore';
import { Repeat, Pause, Play, Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { RecurringTransaction } from '@/types';

export function RecurringTransactionList() {
    const { recurringTransactions, toggleRecurringTransaction, deleteRecurringTransaction } = useBudgetStore();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const getFrequencyDisplay = (frequency: string) => {
        const displays: Record<string, string> = {
            daily: 'Daily',
            weekly: 'Weekly',
            monthly: 'Monthly',
            yearly: 'Yearly',
        };
        return displays[frequency] || frequency;
    };

    const handleToggle = (id: string) => {
        toggleRecurringTransaction(id);
    };

    const handleDelete = (id: string, description: string) => {
        if (confirm(`Delete recurring transaction "${description}"?`)) {
            deleteRecurringTransaction(id);
        }
    };

    if (recurringTransactions.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <Repeat className="w-5 h-5" />
                    Recurring Transactions
                </h2>
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No recurring transactions set up. Create one to automate your regular transactions!
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                <Repeat className="w-5 h-5" />
                Recurring Transactions
            </h2>

            <div className="space-y-3">
                {recurringTransactions.map((recurring) => (
                    <div
                        key={recurring.id}
                        className={`p-4 rounded-lg border ${recurring.isActive
                                ? 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                                : 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 opacity-60'
                            }`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">
                                        {recurring.description}
                                    </h3>
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${recurring.type === 'income'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                                                : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                                            }`}
                                    >
                                        {recurring.type}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                                        {getFrequencyDisplay(recurring.frequency)}
                                    </span>
                                </div>

                                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                    <p>
                                        <span className="font-medium">Amount:</span>{' '}
                                        <span className={recurring.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                                            {formatCurrency(recurring.amount)}
                                        </span>
                                    </p>
                                    <p>
                                        <span className="font-medium">Category:</span> {recurring.category}
                                    </p>
                                    <p>
                                        <span className="font-medium">Next Date:</span>{' '}
                                        {format(new Date(recurring.nextDate), 'MMM dd, yyyy')}
                                    </p>
                                    {recurring.endDate && (
                                        <p>
                                            <span className="font-medium">End Date:</span>{' '}
                                            {format(new Date(recurring.endDate), 'MMM dd, yyyy')}
                                        </p>
                                    )}
                                    {recurring.tags && recurring.tags.length > 0 && (
                                        <p>
                                            <span className="font-medium">Tags:</span>{' '}
                                            {recurring.tags.map((tag, idx) => (
                                                <span key={idx} className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-600 px-2 py-0.5 text-xs text-gray-700 dark:text-gray-300 ml-1">
                                                    {tag}
                                                </span>
                                            ))}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                                <button
                                    onClick={() => handleToggle(recurring.id)}
                                    className={`p-2 rounded-lg transition-colors ${recurring.isActive
                                            ? 'text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                                            : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                                        }`}
                                    title={recurring.isActive ? 'Pause' : 'Resume'}
                                >
                                    {recurring.isActive ? (
                                        <Pause className="w-4 h-4" />
                                    ) : (
                                        <Play className="w-4 h-4" />
                                    )}
                                </button>
                                <button
                                    onClick={() => handleDelete(recurring.id, recurring.description)}
                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {!recurring.isActive && (
                            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic">
                                Paused - will not generate new transactions
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
