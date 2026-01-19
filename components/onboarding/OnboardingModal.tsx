'use client';

import { useState, useEffect } from 'react';
import { useBudgetStore } from '@/store/budgetStore';
import { X, ArrowRight, Check } from 'lucide-react';

export function OnboardingModal() {
    // Selective subscriptions
    const userPreferences = useBudgetStore(state => state.userPreferences);
    const completeOnboarding = useBudgetStore(state => state.completeOnboarding);
    const [currentStep, setCurrentStep] = useState(0);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Show onboarding if not completed
        if (userPreferences && !userPreferences.onboardingCompleted) {
            setShowModal(true);
        }
    }, [userPreferences]);

    const handleComplete = () => {
        completeOnboarding();
        setShowModal(false);
    };

    const handleSkip = () => {
        if (confirm('Skip onboarding? You can always view help later.')) {
            completeOnboarding();
            setShowModal(false);
        }
    };

    if (!showModal) return null;

    const steps = [
        {
            title: 'Welcome to ClarityFlow! 🎉',
            description: 'Your personal budget tracker with powerful features to help you manage your finances with clarity and ease.',
            content: (
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 dark:text-blue-400 font-bold">💰</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Track Transactions</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Record income and expenses with categories and tags</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                            <span className="text-green-600 dark:text-green-400 font-bold">📊</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Visual Analytics</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">See your financial health score and spending trends</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
                            <span className="text-purple-600 dark:text-purple-400 font-bold">🎯</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Savings Goals</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Set targets and track progress towards your goals</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center flex-shrink-0">
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold">🔄</span>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">Recurring Transactions</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Automate your regular income and expenses</p>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Quick Tour',
            description: 'Let&apos;s explore the main features of your dashboard.',
            content: (
                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">✨ Quick Add Button</h4>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            Look for the blue floating button in the bottom-right corner to quickly add transactions on the go!
                        </p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">📈 financial Health Score</h4>
                        <p className="text-sm text-green-800 dark:text-green-200">
                            Monitor your overall financial health with a score from 0-100 based on savings rate, budget adherence, and income/expense ratio.
                        </p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">🎯 Budget Goals</h4>
                        <p className="text-sm text-purple-800 dark:text-purple-200">
                            Set budgets for different time periods (weekly, monthly, quarterly, yearly) and track your spending against them.
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Ready to Get Started! 🚀',
            description: 'You\'re all set! Start by adding your first transaction or setting up a budget goal.',
            content: (
                <div className="space-y-4 text-center">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Check className="w-12 h-12 text-white" />
                    </div>
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    <p className="text-gray-600 dark:text-gray-400">
                        Click the Get Started button below to begin your financial journey with ClarityFlow!
                    </p>
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            <strong>Pro Tip:</strong> All your data is stored locally in your browser. Export to CSV regularly to keep backups!
                        </p>
                    </div>
                </div>
            ),
        },
    ];

    const currentStepData = steps[currentStep];

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
                {/* Backdrop */}
                <div className="fixed inset-0 bg-black bg-opacity-70 transition-opacity" />

                {/* Modal */}
                <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-8">
                    {/* Skip Button */}
                    <button
                        onClick={handleSkip}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Progress */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Step {currentStep + 1} of {steps.length}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {currentStepData.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {currentStepData.description}
                        </p>
                        {currentStepData.content}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                            disabled={currentStep === 0}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Back
                        </button>

                        {currentStep < steps.length - 1 ? (
                            <button
                                onClick={() => setCurrentStep(currentStep + 1)}
                                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                Next
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <button
                                onClick={handleComplete}
                                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                Get Started
                                <Check className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
