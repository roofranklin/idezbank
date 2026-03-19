import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ChartCard } from '../ChartCard';
import { useSummary } from '../../hooks/useSummary';
import { useAvailableMonths } from '../../hooks/useAvailableMonths';

vi.mock('../../hooks/useSummary');
vi.mock('../../hooks/useAvailableMonths');

describe('ChartCard Component', () => {
    it('should render loading skeleton correctly', () => {
        vi.mocked(useAvailableMonths).mockReturnValue({ data: undefined, isLoading: true } as any);
        vi.mocked(useSummary).mockReturnValue({ data: undefined, isLoading: true } as any);
        
        render(<ChartCard />);
        expect(screen.getByText('Fluxo de Caixa')).toBeInTheDocument();
        expect(screen.queryByText('Receitas')).not.toBeInTheDocument();
    });

    it('should render actual chart data when loaded', () => {
        vi.mocked(useAvailableMonths).mockReturnValue({ 
            data: [{ month: 3, year: 2026 }], 
            isLoading: false 
        } as any);
        
        const mockData = {
            totalIncome: 10000,
            totalExpense: 2000,
            totalBalance: 8000
        };
        vi.mocked(useSummary).mockReturnValue({ data: mockData, isLoading: false } as any);

        render(<ChartCard />);
        
        expect(screen.getByText('Receitas')).toBeInTheDocument();
        expect(screen.getByText('Despesas')).toBeInTheDocument();
        expect(screen.getByText(/10\.000,00/)).toBeInTheDocument();
        expect(screen.getByText(/2\.000,00/)).toBeInTheDocument();
    });
});
