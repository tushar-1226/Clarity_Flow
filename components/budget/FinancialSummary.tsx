'use client';

import { useBudgetStore } from '@/store/budgetStore';
import { calculateTotalIncome, calculateTotalExpenses, calculateBalance } from '@/lib/calculations';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export function FinancialSummary() {
    // Selective subscription - only re-renders when transactions change
    const transactions = useBudgetStore(state => state.transactions);

    const totalIncome = calculateTotalIncome(transactions);
    const totalExpenses = calculateTotalExpenses(transactions);
    const balance = calculateBalance(transactions);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Financial Summary
            </h2>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Income</p>
                            <p className="text-xl font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(totalIncome)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-lg">
                            <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</p>
                            <p className="text-xl font-bold text-red-600 dark:text-red-400">
                                {formatCurrency(totalExpenses)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className={`flex items-center justify-between p-4 rounded-lg ${balance >= 0
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : 'bg-orange-50 dark:bg-orange-900/20'
                    }`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${balance >= 0
                            ? 'bg-blue-100 dark:bg-blue-900/40'
                            : 'bg-orange-100 dark:bg-orange-900/40'
                            }`}>
                            <Wallet className={`w-6 h-6 ${balance >= 0
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-orange-600 dark:text-orange-400'
                                }`} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Current Balance</p>
                            <p className={`text-xl font-bold ${balance >= 0
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-orange-600 dark:text-orange-400'
                                }`}>
                                {formatCurrency(balance)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
