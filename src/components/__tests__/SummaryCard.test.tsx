import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SummaryCard } from '../SummaryCard';

describe('SummaryCard Component', () => {
    it('should render skeleton and titles when loading', () => {
        render(<SummaryCard isLoading={true} isError={false} />);
        expect(screen.getByText('Meu saldo')).toBeInTheDocument();
        expect(screen.queryByText('Erro ao carregar os dados')).not.toBeInTheDocument();
    });

    it('should render error message when isError is true', () => {
        render(<SummaryCard isLoading={false} isError={true} />);
        expect(screen.getByText('Erro')).toBeInTheDocument();
    });

    it('should format and render correctly provided data values', () => {
        const mockData = {
            totalIncome: 15400.50,
            totalExpense: 4200.00,
            totalBalance: 11200.50
        };
        render(<SummaryCard data={mockData} isLoading={false} isError={false} />);

        expect(screen.getByText(/11\.200,50/)).toBeInTheDocument();
        expect(screen.getByText(/15\.400,50/)).toBeInTheDocument();
        expect(screen.getByText(/4\.200,00/)).toBeInTheDocument();
    });

    it('should fallback to 0 when data properties are undefined', () => {
        render(<SummaryCard data={undefined} isLoading={false} isError={false} />);

        const zeros = screen.getAllByText(/0,00/);
        expect(zeros.length).toBe(3); // Saldo, Receita e Despesa
    });
});
