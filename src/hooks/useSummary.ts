import { useQuery } from '@tanstack/react-query';
import type { Summary } from '../types';

const fetchSummary = async (): Promise<Summary> => {
    const response = await fetch('/api/summary');
    if (!response.ok) {
        throw new Error('Erro ao buscar o resumo financeiro');
    }
    return response.json();
};

export function useSummary() {
    return useQuery({
        queryKey: ['summary'],
        queryFn: fetchSummary,
    });
}