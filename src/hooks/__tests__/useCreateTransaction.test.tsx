import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useCreateTransaction } from '../useCreateTransaction';

describe('useCreateTransaction Hook', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        global.fetch = vi.fn();
        queryClient = new QueryClient({
            defaultOptions: {
                mutations: { retry: false },
            },
        });
        vi.spyOn(queryClient, 'invalidateQueries');
    });

    it('should mutate successfully and invalidate properly related queries', async () => {
        const mockNewTx = { id: 'test-id', type: 'income', amount: 100, category: 'Test', date: '2026-03-20', description: 'Test Income' };
        vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => mockNewTx,
        } as any);

        const wrapper = ({ children }: { children: ReactNode }) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );

        const { result } = renderHook(() => useCreateTransaction(), { wrapper });

        result.current.mutate({ type: 'income', amount: 100, category: 'Test', date: '2026-03-20', description: 'Test Income' });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(global.fetch).toHaveBeenCalledWith('/api/transactions', expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ type: 'income', amount: 100, category: 'Test', date: '2026-03-20', description: 'Test Income' })
        }));

        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['transactions'] });
        expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['summary'] });
    });

    it('should handle mutation and API errors', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: false,
        } as any);

        const wrapper = ({ children }: { children: ReactNode }) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );

        const { result } = renderHook(() => useCreateTransaction(), { wrapper });

        result.current.mutate({ type: 'expense', amount: 50, category: 'Test', date: '2026-03-20', description: 'Fail Test' });

        await waitFor(() => expect(result.current.isError).toBe(true));
        
        expect(result.current.error?.message).toBe('Erro ao criar transação');
        expect(queryClient.invalidateQueries).not.toHaveBeenCalled();
    });
});
