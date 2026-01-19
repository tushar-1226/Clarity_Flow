'use client';

import { RecurringTransactionList } from '@/components/recurring/RecurringTransactionList';
import { RecurringTransactionForm } from '@/components/recurring/RecurringTransactionForm';
import { RefreshCw } from 'lucide-react';

export default function RecurringPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <RefreshCw className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Recurring Transactions
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your recurring income and expenses
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <RecurringTransactionForm />
                    <RecurringTransactionList />
                </div>
            </main>
        </div>
    );
}
