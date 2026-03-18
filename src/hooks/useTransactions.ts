import { useQuery, keepPreviousData } from '@tanstack/react-query';
import type { PaginatedResponse, Transaction } from '../types';

interface UseTransactionsParams {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
}

const fetchTransactions = async (params: UseTransactionsParams): Promise<PaginatedResponse<Transaction>> => {
    const url = new URL('/api/transactions', window.location.origin);

    if (params.page) url.searchParams.append('page', params.page.toString());
    if (params.limit) url.searchParams.append('limit', params.limit.toString());
    if (params.search) url.searchParams.append('search', params.search);
    if (params.type) url.searchParams.append('type', params.type);
    if (params.startDate) url.searchParams.append('startDate', params.startDate);
    if (params.endDate) url.searchParams.append('endDate', params.endDate);
    if (params.minAmount) url.searchParams.append('minAmount', params.minAmount.toString());
    if (params.maxAmount) url.searchParams.append('maxAmount', params.maxAmount.toString());

    const response = await fetch(url.toString());

    if (!response.ok) {
        throw new Error('Erro ao buscar transações');
    }

    return response.json();
};

export function useTransactions(params: UseTransactionsParams = { page: 1, limit: 10 }) {
    return useQuery({
        queryKey: ['transactions', params],
        queryFn: () => fetchTransactions(params),
        placeholderData: keepPreviousData,
    });
}
