import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NewTransactionModal } from '../NewTransactionModal';
import * as useCreateTransactionModule from '../../hooks/useCreateTransaction';

vi.mock('../../hooks/useCreateTransaction', () => ({
    useCreateTransaction: vi.fn()
}));

describe('NewTransactionModal Component', () => {
    const mockOnClose = vi.fn();
    const mockMutateAsync = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useCreateTransactionModule.useCreateTransaction).mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false
        } as any);
    });

    it('should not render if isOpen is false', () => {
        render(<NewTransactionModal isOpen={false} onClose={mockOnClose} />);
        expect(screen.queryByText('Nova Transação')).not.toBeInTheDocument();
    });

    it('should render correctly when isOpen is true', () => {
        render(<NewTransactionModal isOpen={true} onClose={mockOnClose} />);
        expect(screen.getByText('Nova Transação')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Descrição (ex: Conta de Luz)')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Valor (R$)')).toBeInTheDocument();
    });

    it('should submit form with correct values', async () => {
        render(<NewTransactionModal isOpen={true} onClose={mockOnClose} />);

        fireEvent.change(screen.getByPlaceholderText('Descrição (ex: Conta de Luz)'), { target: { value: 'Compra Teste' } });
        fireEvent.change(screen.getByPlaceholderText('Valor (R$)'), { target: { value: '150.50' } });
        fireEvent.change(screen.getByPlaceholderText('Categoria (ex: Moradia)'), { target: { value: 'Equipamentos' } });

        const dateInput = document.querySelector('input[type="date"]');
        if (dateInput) {
            fireEvent.change(dateInput, { target: { value: '2026-03-25' } });
        }

        fireEvent.submit(screen.getByRole('button', { name: /Salvar Transação/i }));

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledTimes(1);
            expect(mockMutateAsync).toHaveBeenCalledWith(expect.objectContaining({
                description: 'Compra Teste',
                amount: 150.5,
                category: 'Equipamentos',
                type: 'expense' // default
            }));
        });
    });

    it('should call onClose when close button is clicked', () => {
        const { container } = render(<NewTransactionModal isOpen={true} onClose={mockOnClose} />);
        const closeButton = container.querySelector('button.text-gray-400');
        if (closeButton) {
            fireEvent.click(closeButton);
        }
        expect(mockOnClose).toHaveBeenCalled();
    });
});
