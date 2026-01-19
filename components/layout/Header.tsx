'use client';

import { Download, Upload, BarChart2, Home, Wallet, Target, PiggyBank, RefreshCw, FileText, Settings, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useBudgetStore } from '@/store/budgetStore';
import { exportToCSV, importFromCSV } from '@/lib/calculations';
import { useRef, useState } from 'react';

export function Header() {
    // Selective subscriptions
    const transactions = useBudgetStore(state => state.transactions);
    const importTransactions = useBudgetStore(state => state.importTransactions);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    const navLinks = [
        { href: '/', label: 'Dashboard', icon: Home },
        { href: '/transactions', label: 'Transactions', icon: Wallet },
        { href: '/budget', label: 'Budget', icon: Target },
        { href: '/savings', label: 'Savings', icon: PiggyBank },
        { href: '/recurring', label: 'Recurring', icon: RefreshCw },
        { href: '/analytics', label: 'Analytics', icon: BarChart2 },
        { href: '/reports', label: 'Reports', icon: FileText },
        { href: '/settings', label: 'Settings', icon: Settings },
    ];

    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(href);
    };

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="flex-shrink-0">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                ClarityFlow
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Personal Budget Tracker
                            </p>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const active = isActive(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${active
                                            ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="text-sm font-medium">{link.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExport}
                            disabled={transactions.length === 0}
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden md:inline">Export</span>
                        </button>

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Upload className="w-4 h-4" />
                            <span className="hidden md:inline">Import</span>
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

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <nav className="lg:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const active = isActive(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
                                            ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{link.label}</span>
                                    </Link>
                                );
                            })}

                            <div className="flex gap-2 mt-2 sm:hidden">
                                <button
                                    onClick={handleExport}
                                    disabled={transactions.length === 0}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Export</span>
                                </button>
                                <button
                                    onClick={() => {
                                        fileInputRef.current?.click();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <Upload className="w-4 h-4" />
                                    <span>Import</span>
                                </button>
                            </div>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}
