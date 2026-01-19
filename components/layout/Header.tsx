'use client';

import { Download, Upload, BarChart2, Home } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useBudgetStore } from '@/store/budgetStore';
import { exportToCSV, importFromCSV } from '@/lib/calculations';
import { useRef } from 'react';

export function Header() {
    // Selective subscriptions
    const transactions = useBudgetStore(state => state.transactions);
    const importTransactions = useBudgetStore(state => state.importTransactions);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = () => {
        exportToCSV(transactions);
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const imported = await importFromCSV(file);
            importTransactions(imported);
            alert(`Successfully imported ${imported.length} transactions`);
        } catch (error) {
            alert('Error importing CSV file. Please check the format.');
            console.error('Import error:', error);
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                ClarityFlow
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Personal Budget Tracker
                            </p>
                        </div>

                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center gap-4">
                            <Link
                                href="/"
                                className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                <span className="text-sm font-medium">Dashboard</span>
                            </Link>
                            <Link
                                href="/analytics"
                                className="flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                                <BarChart2 className="w-4 h-4" />
                                <span className="text-sm font-medium">Analytics</span>
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExport}
                            disabled={transactions.length === 0}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Export CSV</span>
                        </button>

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Upload className="w-4 h-4" />
                            <span className="hidden sm:inline">Import CSV</span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleImport}
                            className="hidden"
                        />

                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
}
