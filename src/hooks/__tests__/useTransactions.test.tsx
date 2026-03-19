import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useTransactions } from '../useTransactions';

const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: { retry: false },
    },
});

describe('useTransactions Hook', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
    });

    it('should fetch paginated transactions successfully and append params', async () => {
        const mockResponse = { data: [], meta: { totalPages: 1 } };
        vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        } as any);

        const queryClient = createTestQueryClient();
        const wrapper = ({ children }: { children: ReactNode }) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );

        const { result } = renderHook(() => useTransactions({ page: 2, limit: 5 }), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(global.fetch).toHaveBeenCalled();
        const fetchUrl = vi.mocked(global.fetch).mock.calls[0][0] as string;
        expect(fetchUrl).toContain('page=2');
        expect(fetchUrl).toContain('limit=5');
    });

    it('should construct URL properly with multiple complex filters', async () => {
        vi.mocked(global.fetch).mockResolvedValue({
            ok: true,
            json: async () => ({}),
        } as any);

        const queryClient = createTestQueryClient();
        const wrapper = ({ children }: { children: ReactNode }) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );

        const { result } = renderHook(() => useTransactions({ search: 'compra', type: 'expense', minAmount: 10 }), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        const fetchUrl = vi.mocked(global.fetch).mock.calls[0][0] as string;
        expect(fetchUrl).toContain('search=compra');
        expect(fetchUrl).toContain('type=expense');
        expect(fetchUrl).toContain('minAmount=10');
    });

    it('should handle fetch throwing errors', async () => {
        vi.mocked(global.fetch).mockResolvedValue({
            ok: false,
        } as any);

        const queryClient = createTestQueryClient();
        const wrapper = ({ children }: { children: ReactNode }) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );

        const { result } = renderHook(() => useTransactions({}), { wrapper });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error?.message).toBe('Erro ao buscar transações');
    });
});
