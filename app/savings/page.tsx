'use client';

import { SavingsGoalTracker } from '@/components/goals/SavingsGoalTracker';
import { SavingsGoalForm } from '@/components/goals/SavingsGoalForm';
import { PiggyBank } from 'lucide-react';

export default function SavingsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <PiggyBank className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Savings Goals
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Create and track your savings goals and progress
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <SavingsGoalForm />
                    <SavingsGoalTracker />
                </div>
            </main>
        </div>
    );
}
