'use client';

import { Download, Upload, FileText } from 'lucide-react';
import { useBudgetStore } from '@/store/budgetStore';
import { exportToCSV, importFromCSV } from '@/lib/calculations';
import { useRef } from 'react';
import ResetDataButton from '@/components/ui/ResetDataButton';

export default function ReportsPage() {
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Reports & Data Management
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Export, import, and manage your financial data
                    </p>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Export Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                                <Download className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Export Data
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Download your transactions as CSV
                                </p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                Total Transactions: <strong>{transactions.length}</strong>
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Export all your transaction data to a CSV file for backup or analysis in external tools.
                            </p>
                        </div>

                        <button
                            onClick={handleExport}
                            disabled={transactions.length === 0}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="w-5 h-5" />
                            <span>Export to CSV</span>
                        </button>
                    </div>

                    {/* Import Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                                <Upload className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Import Data
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Upload transactions from CSV file
                                </p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                Supported Format: CSV
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Import transactions from a properly formatted CSV file. Existing transactions will be preserved.
                            </p>
                        </div>

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Upload className="w-5 h-5" />
                            <span>Import from CSV</span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleImport}
                            className="hidden"
                        />
                    </div>

                    {/* Data Management Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 md:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    Data Management
                                </h2>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Manage your application data and settings
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                    Reset All Data
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Clear all transactions, goals, and settings. This action cannot be undone.
                                </p>
                            </div>
                            <ResetDataButton />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
