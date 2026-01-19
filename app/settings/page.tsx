'use client';

import { CategoryManager } from '@/components/settings/CategoryManager';
import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <SettingsIcon className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Settings
                        </h1>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your categories, tags, and preferences
                    </p>
                </div>

                {/* Category Management */}
                <CategoryManager />
            </main>
        </div>
    );
}
