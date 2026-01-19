'use client';

import { Trash2 } from 'lucide-react';
import { useBudgetStore } from '@/store/budgetStore';
import { format } from 'date-fns';

export function TransactionList() {
    // Selective subscriptions - only re-renders when necessary
    const deleteTransaction = useBudgetStore(state => state.deleteTransaction);
    const getFilteredTransactions = useBudgetStore(state => state.getFilteredTransactions);
    const transactions = getFilteredTransactions();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'MMM dd, yyyy');
        } catch {
            return dateString;
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this transaction?')) {
            deleteTransaction(id);
        }
    };

    if (transactions.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Transaction History
                </h2>
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No transactions found. Add your first transaction to get started!
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Transaction History ({transactions.length})
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Date
                            </th>
                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Type
                            </th>
                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Category
                            </th>
                            <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Description
                            </th>
                            <th className="text-right py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Amount
                            </th>
                            <th className="text-center py-3 px-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr
                                key={transaction.id}
                                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <td className="py-3 px-2 text-sm text-gray-900 dark:text-gray-100">
                                    {formatDate(transaction.date)}
                                </td>
                                <td className="py-3 px-2">
                                    <span
                                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${transaction.type === 'income'
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                                            }`}
                                    >
                                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                    </span>
                                </td>
                                <td className="py-3 px-2 text-sm text-gray-700 dark:text-gray-300">
                                    {transaction.category}
                                </td>
                                <td className="py-3 px-2 text-sm text-gray-700 dark:text-gray-300">
                                    {transaction.description || '-'}
                                </td>
                                <td className={`py-3 px-2 text-sm text-right font-semibold ${transaction.type === 'income'
                                    ? 'text-green-600 dark:text-green-400'
                                    : 'text-red-600 dark:text-red-400'
                                    }`}>
                                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                </td>
                                <td className="py-3 px-2 text-center">
                                    <button
                                        onClick={() => handleDelete(transaction.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        aria-label="Delete transaction"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
