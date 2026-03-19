import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useSummary } from '../useSummary';

const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: { retry: false },
    },
});

describe('useSummary Hook', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
    });

    it('should fetch summary successfully', async () => {
        const mockResponse = { totalIncome: 100, totalExpense: 50, totalBalance: 50 };
        vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        } as any);

        const queryClient = createTestQueryClient();
        const wrapper = ({ children }: { children: ReactNode }) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );

        const { result } = renderHook(() => useSummary(), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockResponse);
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/summary'));
    });

    it('should handle fetch errors', async () => {
        vi.mocked(global.fetch).mockResolvedValueOnce({
            ok: false,
        } as any);

        const queryClient = createTestQueryClient();
        const wrapper = ({ children }: { children: ReactNode }) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );

        const { result } = renderHook(() => useSummary(), { wrapper });

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect(result.current.error?.message).toBe('Erro ao buscar o resumo financeiro');
    });
});
