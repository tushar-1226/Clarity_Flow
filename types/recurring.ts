export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type RecurrenceStatus = 'active' | 'paused' | 'completed';

export interface RecurringTransaction {
    id: string;
    type: 'income' | 'expense';
    category: string;
    description: string;
    amount: number;
    frequency: RecurrenceFrequency;
    startDate: string; // ISO date string
    endDate?: string; // Optional end date
    occurrences?: number; // Optional: number of times to repeat
    status: RecurrenceStatus;
    lastGenerated?: string; // ISO date string of last generated transaction
    nextOccurrence: string; // ISO date string of next scheduled occurrence
    createdAt: string;
}

export interface RecurringTransactionFormData {
    type: 'income' | 'expense';
    category: string;
    description: string;
    amount: number;
    frequency: RecurrenceFrequency;
    startDate: string;
    endDate?: string;
    occurrences?: number;
}
