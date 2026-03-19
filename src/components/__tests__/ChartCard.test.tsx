import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ChartCard } from '../ChartCard';

describe('ChartCard Component', () => {
    it('should render loading skeleton correctly', () => {
        render(<ChartCard isLoading={true} />);
        expect(screen.getByText('Fluxo de Caixa')).toBeInTheDocument();
        expect(screen.queryByText('Receitas')).not.toBeInTheDocument();
    });

    it('should render actual chart data when loaded', () => {
        const mockData = {
            totalIncome: 10000,
            totalExpense: 2000,
            totalBalance: 8000
        };
        render(<ChartCard isLoading={false} data={mockData} />);
        
        expect(screen.getByText('Receitas')).toBeInTheDocument();
        expect(screen.getByText('Despesas')).toBeInTheDocument();
        expect(screen.getByText(/10\.000,00/)).toBeInTheDocument();
        expect(screen.getByText(/2\.000,00/)).toBeInTheDocument();
    });
});
