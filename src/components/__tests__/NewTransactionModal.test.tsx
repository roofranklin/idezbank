import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NewTransactionModal } from '../NewTransactionModal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

const renderWithClient = (ui: React.ReactElement) => {
    return render(
        <QueryClientProvider client={queryClient}>
            {ui}
        </QueryClientProvider>
    );
};

global.fetch = vi.fn() as ReturnType<typeof vi.fn>;

describe('NewTransactionModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('não deve renderizar o modal se isOpen for falso', () => {
        renderWithClient(<NewTransactionModal isOpen={false} onClose={vi.fn()} />);
        expect(screen.queryByText('Nova Transação')).not.toBeInTheDocument();
    });

    it('deve exibir erros de validação ao tentar submeter um formulário vazio', async () => {
        renderWithClient(<NewTransactionModal isOpen={true} onClose={vi.fn()} />);

        const user = userEvent.setup();
        const submitButton = screen.getByRole('button', { name: /salvar transação/i });

        await user.click(submitButton);

        expect(await screen.findByText('A descrição deve ter pelo menos 3 caracteres')).toBeInTheDocument();
        expect(await screen.findByText('O valor deve ser maior que zero')).toBeInTheDocument();
    });

    it('deve submeter o formulário com sucesso e fechar o modal', async () => {
        (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ id: '123' }),
        });

        const handleClose = vi.fn(); // Um "espião" para sabermos se o modal fechou
        renderWithClient(<NewTransactionModal isOpen={true} onClose={handleClose} />);

        const user = userEvent.setup();

        await user.type(screen.getByPlaceholderText(/descrição/i), 'Conta da Internet');
        await user.type(screen.getByPlaceholderText(/valor/i), '150');
        await user.type(screen.getByPlaceholderText(/categoria/i), 'Despesas Fixas');

        const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
        await user.type(dateInput, '2026-03-20');

        const submitButton = screen.getByRole('button', { name: /salvar transação/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
            expect(handleClose).toHaveBeenCalledTimes(1);
        });
    });
});
