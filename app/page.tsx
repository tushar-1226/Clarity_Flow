'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { TransactionForm } from '@/components/forms/TransactionForm';
import { FinancialSummary } from '@/components/budget/FinancialSummary';
import { SearchFilter } from '@/components/transactions/SearchFilter';
import { TransactionList } from '@/components/transactions/TransactionList';
import { BudgetGoals } from '@/components/budget/BudgetGoals';
import { BudgetTracking } from '@/components/budget/BudgetTracking';
import { ExpensePieChart } from '@/components/charts/ExpensePieChart';
import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart';
import { useBudgetStore } from '@/store/budgetStore';

// New components
import { FinancialHealthScore } from '@/components/dashboard/FinancialHealthScore';
import { SavingsGoalTracker } from '@/components/goals/SavingsGoalTracker';
import { SavingsGoalForm } from '@/components/goals/SavingsGoalForm';
import { BalanceLineChart } from '@/components/charts/BalanceLineChart';
import { RecurringTransactionList } from '@/components/recurring/RecurringTransactionList';
import { RecurringTransactionForm } from '@/components/recurring/RecurringTransactionForm';
import { QuickAddButton } from '@/components/ui/QuickAddButton';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import ResetDataButton from '@/components/ui/ResetDataButton';


export default function Home() {
    const { initialize, userPreferences } = useBudgetStore();

    useEffect(() => {
        initialize();
    }, [initialize]);

    // Check if widgets are enabled (for future customization)
    const isWidgetEnabled = (widgetId: string) => {
        if (!userPreferences?.dashboardWidgets) return true;
        const widget = userPreferences.dashboardWidgets.find(w => w.id === widgetId);
        return widget ? widget.enabled : true;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Utility Section */}
                <div className="mb-6 flex justify-end">
                    <ResetDataButton />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Input & Summary */}
                    <div className="space-y-6">
                        {isWidgetEnabled('transaction-form') && <TransactionForm />}
                        {isWidgetEnabled('financial-summary') && <FinancialSummary />}
                        {isWidgetEnabled('financial-health') && <FinancialHealthScore />}
                        {isWidgetEnabled('search-filter') && <SearchFilter />}
                    </div>

                    {/* Middle Column - Budget Goals & Savings */}
                    <div className="space-y-6">
                        {isWidgetEnabled('budget-goals') && <BudgetGoals />}
                        {isWidgetEnabled('budget-tracking') && <BudgetTracking />}

                        {/* Savings Goals */}
                        <div className="space-y-4">
                            <SavingsGoalForm />
                            {isWidgetEnabled('savings-goals') && <SavingsGoalTracker />}
                        </div>
                    </div>

                    {/* Right Column - Charts */}
                    <div className="space-y-6">
                        {isWidgetEnabled('expense-pie-chart') && <ExpensePieChart />}
                        {isWidgetEnabled('monthly-bar-chart') && <MonthlyBarChart />}
                        {isWidgetEnabled('balance-line-chart') && <BalanceLineChart />}
                    </div>
                </div>

                {/* Recurring Transactions - Full Width */}
                <div className="mt-6 space-y-4">
                    <RecurringTransactionForm />
                    {isWidgetEnabled('recurring-transactions') && <RecurringTransactionList />}
                </div>

                {/* Transaction History - Full Width */}
                <div className="mt-6">
                    <TransactionList />
                </div>
            </main>

            {/* Quick Add Floating Button */}
            <QuickAddButton />

            {/* Onboarding Modal */}
            <OnboardingModal />
        </div>
    );
}
