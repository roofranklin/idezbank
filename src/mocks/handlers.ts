import { http, HttpResponse } from 'msw';
import type { Transaction, Summary, PaginatedResponse } from '../types';

// Nosso banco de dados em memória inicial
let transactions: Transaction[] = [
    { id: '1', type: 'income', amount: 5000, date: '2026-03-10T10:00:00Z', category: 'Salário', description: 'Salário Mensal' },
    { id: '2', type: 'expense', amount: 150, date: '2026-03-12T14:30:00Z', category: 'Alimentação', description: 'Restaurante' },
    { id: '3', type: 'expense', amount: 300, date: '2026-03-15T09:00:00Z', category: 'Transporte', description: 'Uber e Combustível' },
    { id: '4', type: 'income', amount: 1200, date: '2026-03-17T16:00:00Z', category: 'Freelance', description: 'Projeto Front-end' },
];

export const handlers = [
    // Endpoint: Resumo Financeiro
    http.get('/api/summary', () => {
        const summary = transactions.reduce(
            (acc, transaction) => {
                if (transaction.type === 'income') {
                    acc.totalIncome += transaction.amount;
                    acc.totalBalance += transaction.amount;
                } else {
                    acc.totalExpense += transaction.amount;
                    acc.totalBalance -= transaction.amount;
                }
                return acc;
            },
            { totalBalance: 0, totalIncome: 0, totalExpense: 0 } as Summary
        );

        return HttpResponse.json(summary);
    }),

    // Endpoint: Listagem de Transações (com filtros e paginação)
    http.get('/api/transactions', ({ request }) => {
        const url = new URL(request.url);
        const page = Number(url.searchParams.get('page')) || 1;
        const limit = Number(url.searchParams.get('limit')) || 10;
        const search = url.searchParams.get('search')?.toLowerCase();
        const type = url.searchParams.get('type');

        let filtered = [...transactions];

        // Filtro de busca por descrição
        if (search) {
            filtered = filtered.filter((t) => t.description.toLowerCase().includes(search));
        }

        // Filtro por tipo (entrada/saída)
        if (type === 'income' || type === 'expense') {
            filtered = filtered.filter((t) => t.type === type);
        }

        // Ordenação (Padrão: mais recentes primeiro)
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Paginação
        const totalCount = filtered.length;
        const totalPages = Math.ceil(totalCount / limit);
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedData = filtered.slice(start, end);

        const response: PaginatedResponse<Transaction> = {
            data: paginatedData,
            meta: { totalCount, currentPage: page, totalPages },
        };

        return HttpResponse.json(response);
    }),

    // Endpoint: Cadastro de Transação
    http.post('/api/transactions', async ({ request }) => {
        const newTx = (await request.json()) as Omit<Transaction, 'id'>;

        const transaction: Transaction = {
            ...newTx,
            id: crypto.randomUUID(), // Gera um ID único nativo do browser
        };

        transactions.push(transaction);

        return HttpResponse.json(transaction, { status: 201 });
    }),
];
