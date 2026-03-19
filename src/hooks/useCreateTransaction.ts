import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Transaction } from '../types';

type NewTransactionInput = Omit<Transaction, 'id'>;

export function useCreateTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (transaction: NewTransactionInput) => {
            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transaction),
            });

            if (!response.ok) {
                throw new Error('Erro ao criar transação');
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['summary'] });
            queryClient.invalidateQueries({ queryKey: ['available-months'] });
        },
    });
}