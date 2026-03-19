import { useQuery } from '@tanstack/react-query';
import type { Summary } from '../types';

interface SummaryParams {
    month?: number;
    year?: number;
}

const fetchSummary = async (params?: SummaryParams): Promise<Summary> => {
    const url = new URL('/api/summary', window.location.origin);

    if (params?.month) url.searchParams.append('month', params.month.toString());
    if (params?.year) url.searchParams.append('year', params.year.toString());

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error('Erro ao buscar o resumo financeiro');
    }
    return response.json();
};

export function useSummary(params?: SummaryParams) {
    return useQuery({
        queryKey: ['summary', params],
        queryFn: () => fetchSummary(params),
    });
}
