import { useQuery } from '@tanstack/react-query';

export interface AvailableMonth {
    month: number;
    year: number;
}

const fetchAvailableMonths = async (): Promise<AvailableMonth[]> => {
    const response = await fetch('/api/available-months');
    if (!response.ok) {
        throw new Error('Erro ao buscar meses disponíveis');
    }
    return response.json();
};

export function useAvailableMonths() {
    return useQuery({
        queryKey: ['available-months'],
        queryFn: fetchAvailableMonths,
    });
}
