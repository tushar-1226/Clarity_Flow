'use client';

import { useState } from 'react';
import { useBudgetStore } from '@/store/budgetStore';
import { CustomCategory } from '@/types';
import { getAllCategories, getCategoryIcon, getCategoryColor, isCategoryNameUnique } from '@/lib/categoryService';
import { Plus, Edit2, Trash2, Save, X, Palette } from 'lucide-react';

export function CategoryManager() {
    const customCategories = useBudgetStore(state => state.customCategories);
    const addCustomCategory = useBudgetStore(state => state.addCustomCategory);
    const updateCustomCategory = useBudgetStore(state => state.updateCustomCategory);
    const deleteCustomCategory = useBudgetStore(state => state.deleteCustomCategory);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'expense' as 'income' | 'expense',
        icon: '',
        color: '',
        parentCategoryId: '',
    });

    const allCategories = getAllCategories(customCategories);
    const customOnly = customCategories.filter(c => !c.isDefault);

    const handleAdd = () => {
        if (!formData.name.trim()) return;

        if (!isCategoryNameUnique(customCategories, formData.name)) {
            alert('Category name already exists!');
            return;
        }

        addCustomCategory({
            name: formData.name.trim(),
            type: formData.type,
            icon: formData.icon || undefined,
            color: formData.color || undefined,
            parentCategoryId: formData.parentCategoryId || undefined,
            isDefault: false,
        });

        // Reset form
        setFormData({
            name: '',
            type: 'expense',
            icon: '',
            color: '',
            parentCategoryId: '',
        });
        setShowAddForm(false);
    };

    const handleEdit = (category: CustomCategory) => {
        setEditingId(category.id);
        setFormData({
            name: category.name,
            type: category.type,
            icon: category.icon || '',
            color: category.color || '',
            parentCategoryId: category.parentCategoryId || '',
        });
    };

    const handleUpdate = () => {
        if (!editingId || !formData.name.trim()) return;

        if (!isCategoryNameUnique(customCategories, formData.name, editingId)) {
            alert('Category name already exists!');
            return;
        }

        updateCustomCategory(editingId, {
            name: formData.name.trim(),
            type: formData.type,
            icon: formData.icon || undefined,
            color: formData.color || undefined,
            parentCategoryId: formData.parentCategoryId || undefined,
        });

        setEditingId(null);
        setFormData({
            name: '',
            type: 'expense',
            icon: '',
            color: '',
            parentCategoryId: '',
        });
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this category?')) {
            deleteCustomCategory(id);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setShowAddForm(false);
        setFormData({
            name: '',
            type: 'expense',
            icon: '',
            color: '',
            parentCategoryId: '',
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Category Management
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Create and manage custom categories for your transactions
                    </p>
                </div>
                {!showAddForm && (
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Category
                    </button>
                )}
            </div>

            {/* Add Form */}
            {showAddForm && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                        New Category
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                placeholder="e.g., Groceries"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Type *
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            >
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Icon (emoji)
                            </label>
                            <input
                                type="text"
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                placeholder="e.g., 🛒"
                                maxLength={2}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Color
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={formData.color || '#6b7280'}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    placeholder="#6b7280"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Categories List */}
            <div className="space-y-4">
                {/* Default Categories (Read-only) */}
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Default Categories
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {allCategories.filter(c => c.isDefault).map((category) => (
                            <div
                                key={category.id}
                                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                            >
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                                    style={{ backgroundColor: getCategoryColor(category) + '20' }}
                                >
                                    {getCategoryIcon(category)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {category.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {category.type === 'income' ? 'Income' : 'Expense'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Custom Categories */}
                {customOnly.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            Custom Categories
                        </h3>
                        <div className="space-y-2">
                            {customOnly.map((category) => (
                                <div key={category.id}>
                                    {editingId === category.id ? (
                                        // Edit Form
                                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Type *
                                                    </label>
                                                    <select
                                                        value={formData.type}
                                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                    >
                                                        <option value="expense">Expense</option>
                                                        <option value="income">Income</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Icon
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData.icon}
                                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                        maxLength={2}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Color
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="color"
                                                            value={formData.color || '#6b7280'}
                                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                                            className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={formData.color}
                                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                                <button
                                                    onClick={handleUpdate}
                                                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                                >
                                                    <Save className="w-4 h-4" />
                                                    Save
                                                </button>
                                                <button
                                                    onClick={handleCancel}
                                                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // Display Mode
                                        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors">
                                            <div
                                                className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                                                style={{ backgroundColor: (category.color || getCategoryColor(category)) + '20' }}
                                            >
                                                {category.icon || getCategoryIcon(category)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {category.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {category.type === 'income' ? 'Income' : 'Expense'}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(category)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {customOnly.length === 0 && !showAddForm && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Palette className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No custom categories yet.</p>
                        <p className="text-sm">Click "Add Category" to create your first custom category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
