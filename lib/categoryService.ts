import { CustomCategory, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/types';

/**
 * Category Service
 * Handles custom category operations, hierarchy management, and validation
 */

// Generate default categories from existing constants
export const generateDefaultCategories = (): CustomCategory[] => {
    const categories: CustomCategory[] = [];
    let order = 0;

    // Add income categories
    INCOME_CATEGORIES.forEach((name) => {
        categories.push({
            id: `default-income-${name.toLowerCase().replace(/\s+/g, '-')}`,
            name,
            type: 'income',
            isDefault: true,
            createdDate: new Date().toISOString().split('T')[0],
            order: order++,
        });
    });

    // Add expense categories
    EXPENSE_CATEGORIES.forEach((name) => {
        categories.push({
            id: `default-expense-${name.toLowerCase().replace(/\s+/g, '-')}`,
            name,
            type: 'expense',
            isDefault: true,
            createdDate: new Date().toISOString().split('T')[0],
            order: order++,
        });
    });

    return categories;
};

// Get all categories (default + custom)
export const getAllCategories = (customCategories: CustomCategory[]): CustomCategory[] => {
    const defaultCategories = generateDefaultCategories();
    return [...defaultCategories, ...customCategories].sort((a, b) => (a.order || 0) - (b.order || 0));
};

// Get categories by type
export const getCategoriesByType = (
    customCategories: CustomCategory[],
    type: 'income' | 'expense'
): CustomCategory[] => {
    return getAllCategories(customCategories).filter((cat) => cat.type === type);
};

// Get category hierarchy (parent categories with their children)
export const getCategoryHierarchy = (customCategories: CustomCategory[]): Map<string, CustomCategory[]> => {
    const allCategories = getAllCategories(customCategories);
    const hierarchy = new Map<string, CustomCategory[]>();

    // Group by parent
    allCategories.forEach((category) => {
        const parentId = category.parentCategoryId || 'root';
        if (!hierarchy.has(parentId)) {
            hierarchy.set(parentId, []);
        }
        hierarchy.get(parentId)!.push(category);
    });

    return hierarchy;
};

// Get parent categories (categories without a parent)
export const getParentCategories = (customCategories: CustomCategory[]): CustomCategory[] => {
    return getAllCategories(customCategories).filter((cat) => !cat.parentCategoryId);
};

// Get child categories of a specific parent
export const getChildCategories = (
    customCategories: CustomCategory[],
    parentId: string
): CustomCategory[] => {
    return getAllCategories(customCategories).filter((cat) => cat.parentCategoryId === parentId);
};

// Validate category name uniqueness
export const isCategoryNameUnique = (
    customCategories: CustomCategory[],
    name: string,
    excludeId?: string
): boolean => {
    const allCategories = getAllCategories(customCategories);
    return !allCategories.some(
        (cat) => cat.name.toLowerCase() === name.toLowerCase() && cat.id !== excludeId
    );
};

// Validate category hierarchy (prevent circular references)
export const isValidHierarchy = (
    customCategories: CustomCategory[],
    categoryId: string,
    parentId?: string
): boolean => {
    if (!parentId) return true;

    // Can't be its own parent
    if (categoryId === parentId) return false;

    // Check for circular reference
    let currentParentId = parentId;
    const visited = new Set<string>();

    while (currentParentId) {
        if (visited.has(currentParentId)) return false; // Circular reference detected
        if (currentParentId === categoryId) return false; // Would create a cycle

        visited.add(currentParentId);

        const parent = getAllCategories(customCategories).find((cat) => cat.id === currentParentId);
        currentParentId = parent?.parentCategoryId || '';
    }

    return true;
};

// Get category by name (for backward compatibility with existing transactions)
export const getCategoryByName = (
    customCategories: CustomCategory[],
    name: string
): CustomCategory | undefined => {
    return getAllCategories(customCategories).find(
        (cat) => cat.name.toLowerCase() === name.toLowerCase()
    );
};

// Get category by ID
export const getCategoryById = (
    customCategories: CustomCategory[],
    id: string
): CustomCategory | undefined => {
    return getAllCategories(customCategories).find((cat) => cat.id === id);
};

// Get full category path (for hierarchical display)
export const getCategoryPath = (
    customCategories: CustomCategory[],
    categoryId: string
): string[] => {
    const path: string[] = [];
    let currentId: string | undefined = categoryId;

    while (currentId) {
        const category = getCategoryById(customCategories, currentId);
        if (!category) break;

        path.unshift(category.name);
        currentId = category.parentCategoryId;
    }

    return path;
};

// Merge categories (move all transactions from source to target)
export const canMergeCategories = (
    customCategories: CustomCategory[],
    sourceId: string,
    targetId: string
): boolean => {
    const source = getCategoryById(customCategories, sourceId);
    const target = getCategoryById(customCategories, targetId);

    if (!source || !target) return false;
    if (source.id === target.id) return false;
    if (source.type !== target.type) return false; // Can't merge income with expense

    return true;
};

// Get recently used categories (based on transaction history)
export const getRecentlyUsedCategories = (
    customCategories: CustomCategory[],
    recentCategoryNames: string[],
    limit: number = 5
): CustomCategory[] => {
    const categories: CustomCategory[] = [];
    const seen = new Set<string>();

    for (const name of recentCategoryNames) {
        if (categories.length >= limit) break;

        const category = getCategoryByName(customCategories, name);
        if (category && !seen.has(category.id)) {
            categories.push(category);
            seen.add(category.id);
        }
    }

    return categories;
};

// Search categories by name
export const searchCategories = (
    customCategories: CustomCategory[],
    query: string
): CustomCategory[] => {
    const lowerQuery = query.toLowerCase();
    return getAllCategories(customCategories).filter((cat) =>
        cat.name.toLowerCase().includes(lowerQuery)
    );
};

// Get category icon (returns emoji or lucide icon name)
export const getCategoryIcon = (category: CustomCategory): string => {
    if (category.icon) return category.icon;

    // Default icons based on category name
    const iconMap: Record<string, string> = {
        'Salary': '💰',
        'Freelance': '💼',
        'Investments': '📈',
        'Business': '🏢',
        'Gifts': '🎁',
        'Other Income': '💵',
        'Food': '🍔',
        'Transportation': '🚗',
        'Utilities': '💡',
        'Entertainment': '🎬',
        'Healthcare': '🏥',
        'Shopping': '🛍️',
        'Education': '📚',
        'Housing': '🏠',
        'Other Expenses': '📦',
    };

    return iconMap[category.name] || (category.type === 'income' ? '💵' : '📦');
};

// Get category color (returns hex color)
export const getCategoryColor = (category: CustomCategory): string => {
    if (category.color) return category.color;

    // Default colors based on category type
    const colorMap: Record<string, string> = {
        'Salary': '#10b981',
        'Freelance': '#3b82f6',
        'Investments': '#8b5cf6',
        'Business': '#f59e0b',
        'Gifts': '#ec4899',
        'Other Income': '#6366f1',
        'Food': '#ef4444',
        'Transportation': '#f97316',
        'Utilities': '#eab308',
        'Entertainment': '#a855f7',
        'Healthcare': '#06b6d4',
        'Shopping': '#ec4899',
        'Education': '#3b82f6',
        'Housing': '#8b5cf6',
        'Other Expenses': '#6b7280',
    };

    return colorMap[category.name] || (category.type === 'income' ? '#10b981' : '#6b7280');
};
