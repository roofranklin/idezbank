export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    date: string; // ISO 8601
    category: string;
    description: string;
}

export interface Summary {
    totalBalance: number;
    totalIncome: number;
    totalExpense: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        totalCount: number;
        currentPage: number;
        totalPages: number;
    };
}