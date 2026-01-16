'use client';

import { useState } from 'react';
import { useBudgetStore } from '@/store/budgetStore';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ResetDataButton() {
    const [showModal, setShowModal] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [isResetting, setIsResetting] = useState(false);
    const resetAllData = useBudgetStore((state) => state.resetAllData);

    const handleReset = async () => {
        if (confirmText !== 'RESET') {
            toast.error('Please type RESET to confirm');
            return;
        }

        setIsResetting(true);

        try {
            // Reset all data
            resetAllData();

            // Show success message
            toast.success('All data has been reset successfully!', {
                position: 'top-center',
                autoClose: 1500,
            });

            // Close modal and reset state
            setShowModal(false);
            setConfirmText('');

            // Reload the page to reflect changes
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (error) {
            console.error('Error resetting data:', error);
            toast.error('Failed to reset data. Please try again.');
            setIsResetting(false);
        }
    };

    const handleClose = () => {
        if (!isResetting) {
            setShowModal(false);
            setConfirmText('');
        }
    };

    return (
        <>
            {/* Reset Button */}
            <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 
                         text-red-600 dark:text-red-400 rounded-lg transition-all duration-200 
                         border border-red-500/30 hover:border-red-500/50 font-medium"
                title="Reset all data"
            >
                <Trash2 className="w-4 h-4" />
                <span>Reset All Data</span>
            </button>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 bg-red-500/10 rounded-full">
                                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Reset All Data
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    This action cannot be undone. This will permanently delete:
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                disabled={isResetting}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 
                                         transition-colors disabled:opacity-50"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Warning List */}
                        <div className="mb-6 p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                            <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                    All transactions
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                    Budget goals and limits
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                    Recurring transactions
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                    Savings goals
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                    Tags and custom categories
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                    User preferences and settings
                                </li>
                            </ul>
                        </div>

                        {/* Confirmation Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Type <span className="font-bold text-red-600 dark:text-red-400">RESET</span> to confirm
                            </label>
                            <input
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                disabled={isResetting}
                                placeholder="Type RESET here"
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 
                                         dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 
                                         focus:border-red-500 outline-none transition-all text-gray-900 
                                         dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                autoFocus
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleClose}
                                disabled={isResetting}
                                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 
                                         dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 
                                         transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReset}
                                disabled={confirmText !== 'RESET' || isResetting}
                                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg 
                                         transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed
                                         disabled:hover:bg-red-600 flex items-center justify-center gap-2"
                            >
                                {isResetting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Resetting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        <span>Reset All Data</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
