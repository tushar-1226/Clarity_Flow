'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { FinancialSummary } from '@/components/budget/FinancialSummary';
import { ExpensePieChart } from '@/components/charts/ExpensePieChart';
import { MonthlyBarChart } from '@/components/charts/MonthlyBarChart';
import { useBudgetStore } from '@/store/budgetStore';
import { FinancialHealthScore } from '@/components/dashboard/FinancialHealthScore';
import { BalanceLineChart } from '@/components/charts/BalanceLineChart';
import { QuickAddButton } from '@/components/ui/QuickAddButton';
import { OnboardingModal } from '@/components/onboarding/OnboardingModal';
import { Wallet, Target, PiggyBank, RefreshCw, BarChart2, FileText, ArrowRight, Home } from 'lucide-react';

export default function DashboardPage() {
    const initialize = useBudgetStore(state => state.initialize);
    const userPreferences = useBudgetStore(state => state.userPreferences);

    useEffect(() => {
        initialize();
    }, [initialize]);

    const isWidgetEnabled = (widgetId: string) => {
        if (!userPreferences?.dashboardWidgets) return true;
        const widget = userPreferences.dashboardWidgets.find(w => w.id === widgetId);
        return widget ? widget.enabled : true;
    };

    const quickLinks = [
        {
            title: 'Transactions',
            description: 'Add and manage transactions',
            icon: Wallet,
            href: '/transactions',
            color: 'bg-blue-500',
        },
        {
            title: 'Budget Goals',
            description: 'Set category budgets',
            icon: Target,
            href: '/budget',
            color: 'bg-purple-500',
        },
        {
            title: 'Savings',
            description: 'Track savings goals',
            icon: PiggyBank,
            href: '/savings',
            color: 'bg-green-500',
        },
        {
            title: 'Recurring',
            description: 'Manage recurring items',
            icon: RefreshCw,
            href: '/recurring',
            color: 'bg-orange-500',
        },
        {
            title: 'Analytics',
            description: 'View detailed insights',
            icon: BarChart2,
            href: '/analytics',
            color: 'bg-indigo-500',
        },
        {
            title: 'Reports',
            description: 'Export & import data',
            icon: FileText,
            href: '/reports',
            color: 'bg-gray-500',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Home className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Dashboard
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Your financial overview and quick access to all tools
                    </p>
                </div>

                {/* Quick Links Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Quick Access
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {quickLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all hover:-translate-y-1"
                                >
                                    <div className={`${link.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                                        {link.title}
                                    </h3>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                        {link.description}
                                    </p>
                                    <div className="flex items-center text-xs text-indigo-600 dark:text-indigo-400">
                                        <span>Open</span>
                                        <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Overview Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Summary & Health */}
                    <div className="space-y-6">
                        {isWidgetEnabled('financial-summary') && <FinancialSummary />}
                        {isWidgetEnabled('financial-health') && <FinancialHealthScore />}
                    </div>

                    {/* Middle Column - Pie Chart */}
                    <div className="space-y-6">
                        {isWidgetEnabled('expense-pie-chart') && <ExpensePieChart />}
                    </div>

                    {/* Right Column - Bar Chart */}
                    <div className="space-y-6">
                        {isWidgetEnabled('monthly-bar-chart') && <MonthlyBarChart />}
                    </div>
                </div>

                {/* Balance Line Chart - Full Width */}
                <div className="mt-6">
                    {isWidgetEnabled('balance-line-chart') && <BalanceLineChart />}
                </div>
            </main>

            {/* Quick Add Floating Button */}
            <QuickAddButton />

            {/* Onboarding Modal */}
            <OnboardingModal />
        </div>
    );
}
