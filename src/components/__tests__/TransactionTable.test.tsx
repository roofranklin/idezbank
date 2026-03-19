import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TransactionTable } from '../TransactionTable';
import * as useTransactionsModule from '../../hooks/useTransactions';

vi.mock('../../hooks/useTransactions', () => ({
    useTransactions: vi.fn()
}));

describe('TransactionTable Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render loading state', () => {
        vi.mocked(useTransactionsModule.useTransactions).mockReturnValue({
            data: undefined,
            isLoading: true,
            isFetching: true,
            isError: false,
            error: null,
            refetch: vi.fn(),
        } as any);

        render(<TransactionTable />);
        // Espera renderizar ao menos um dos skeletons do table row (que tem a classe animate-pulse)
        // Uma forma simples é checar a ausência do "Pesquisar" ou focar no texto "Carregando" caso exista.
        // A UI atual apenas exibe "Carregando..." silenciosamente ou spinners. 
        // Vamos checar pelas divs de skeleton que devem existir.
        const skeletons = document.querySelectorAll('.animate-pulse');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should render transactions list properly', () => {
        const mockData = {
            data: [
                { id: '1', description: 'Salário', amount: 5000, type: 'income', date: '2026-03-05T10:00:00Z', category: 'Salário' },
                { id: '2', description: 'Uber', amount: 50, type: 'expense', date: '2026-03-06T10:00:00Z', category: 'Transporte' }
            ],
            meta: { totalPages: 1, currentPage: 1, totalCount: 2 }
        };

        vi.mocked(useTransactionsModule.useTransactions).mockReturnValue({
            data: mockData,
            isLoading: false,
            isFetching: false,
            isError: false,
            error: null,
            refetch: vi.fn(),
        } as any);

        render(<TransactionTable />);

        expect(screen.getAllByText('Salário')[0]).toBeInTheDocument();
        expect(screen.getByText('Uber')).toBeInTheDocument();
        expect(screen.getByText('Transporte')).toBeInTheDocument();

        expect(screen.getByText(/5\.000,00/)).toBeInTheDocument();
        expect(screen.getByText(/50,00/)).toBeInTheDocument();
    });

    it('should render empty state when no transactions are found', () => {
        vi.mocked(useTransactionsModule.useTransactions).mockReturnValue({
            data: { data: [], meta: { totalPages: 0, currentPage: 1, totalCount: 0 } },
            isLoading: false,
            isFetching: false,
            isError: false,
            error: null,
            refetch: vi.fn(),
        } as any);

        render(<TransactionTable />);

        expect(screen.getByText('Nenhuma transação encontrada')).toBeInTheDocument();
    });
});
