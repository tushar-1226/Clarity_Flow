'use client';

import { BudgetGoals } from '@/components/budget/BudgetGoals';
import { BudgetTracking } from '@/components/budget/BudgetTracking';
import { Target } from 'lucide-react';

export default function BudgetPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Target className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Budget Goals
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Set and track your budget goals by category
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <BudgetGoals />
                    <BudgetTracking />
                </div>
            </main>
        </div>
    );
}
