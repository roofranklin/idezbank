import { useQuery, keepPreviousData } from '@tanstack/react-query';
import type { PaginatedResponse, Transaction } from '../types';

interface UseTransactionsParams {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
}

const fetchTransactions = async (params: UseTransactionsParams): Promise<PaginatedResponse<Transaction>> => {
    const url = new URL('/api/transactions', window.location.origin);

    if (params.page) url.searchParams.append('page', params.page.toString());
    if (params.limit) url.searchParams.append('limit', params.limit.toString());
    if (params.search) url.searchParams.append('search', params.search);
    if (params.type) url.searchParams.append('type', params.type);

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