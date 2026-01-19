'use client';

import { TransactionForm } from '@/components/forms/TransactionForm';
import { SearchFilter } from '@/components/transactions/SearchFilter';
import { TransactionList } from '@/components/transactions/TransactionList';
import { Wallet } from 'lucide-react';

export default function TransactionsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Wallet className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Transactions
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Add, view, and manage all your financial transactions
                    </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Transaction Form */}
                    <div className="lg:col-span-1">
                        <TransactionForm />
                    </div>

                    {/* Right Column - Search & List */}
                    <div className="lg:col-span-2 space-y-6">
                        <SearchFilter />
                        <TransactionList />
                    </div>
                </div>
            </main>
        </div>
    );
}
