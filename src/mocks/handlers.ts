import { http, HttpResponse } from 'msw';
import type { Transaction, Summary, PaginatedResponse } from '../types';

// Nosso banco de dados em memória inicial
const transactions: Transaction[] = [
    { id: '1', type: 'income', amount: 8500, date: '2026-03-05T10:00:00Z', category: 'Salário', description: 'Salário Allintra' },
    { id: '2', type: 'expense', amount: 850, date: '2026-03-06T14:30:00Z', category: 'Alimentação', description: 'Supermercado' },
    { id: '3', type: 'expense', amount: 45, date: '2026-03-07T09:15:00Z', category: 'Transporte', description: 'Uber' },
    { id: '4', type: 'expense', amount: 120, date: '2026-03-08T11:00:00Z', category: 'Moradia', description: 'Conta de Energia' },
    { id: '5', type: 'income', amount: 4500, date: '2026-03-10T16:20:00Z', category: 'Freelance', description: 'Projeto OnlyEnergy' },
    { id: '6', type: 'expense', amount: 65, date: '2026-03-11T12:30:00Z', category: 'Alimentação', description: 'Almoço Restaurante' },
    { id: '7', type: 'expense', amount: 35, date: '2026-03-12T08:00:00Z', category: 'Assinaturas', description: 'Google One AI Premium' },
    { id: '8', type: 'expense', amount: 1000, date: '2026-03-12T15:45:00Z', category: 'Investimentos', description: 'Aporte Kast Finance' },
    { id: '9', type: 'expense', amount: 150, date: '2026-03-13T18:10:00Z', category: 'Saúde', description: 'Farmácia' },
    { id: '10', type: 'expense', amount: 500, date: '2026-03-14T10:30:00Z', category: 'Investimentos', description: 'Compra de USDT' },
    { id: '11', type: 'expense', amount: 220, date: '2026-03-14T20:00:00Z', category: 'Lazer', description: 'Jantar com a esposa' },
    { id: '12', type: 'expense', amount: 250, date: '2026-03-15T14:00:00Z', category: 'Educação', description: 'Curso de React e TS' },
    { id: '13', type: 'expense', amount: 120, date: '2026-03-15T16:30:00Z', category: 'Tecnologia', description: 'Acessórios Mac Mini' },
    { id: '14', type: 'expense', amount: 80, date: '2026-03-16T09:00:00Z', category: 'Infraestrutura', description: 'AWS DynamoDB' },
    { id: '15', type: 'expense', amount: 100, date: '2026-03-16T11:15:00Z', category: 'Moradia', description: 'Internet Banda Larga' },
    { id: '16', type: 'expense', amount: 70, date: '2026-03-17T19:30:00Z', category: 'Lazer', description: 'Cinema' },
    { id: '17', type: 'income', amount: 1200, date: '2026-03-17T10:00:00Z', category: 'Educação', description: 'Aulas de Programação' },
    { id: '18', type: 'expense', amount: 25, date: '2026-03-18T08:30:00Z', category: 'Alimentação', description: 'Padaria' },
];

export const handlers = [
    // Endpoint: Resumo Financeiro
    http.get('/api/summary', ({ request }) => {
        const url = new URL(request.url);
        const month = url.searchParams.get('month');
        const year = url.searchParams.get('year');

        let filteredTransactions = transactions;

        if (month && year) {
            filteredTransactions = transactions.filter((t) => {
                const date = new Date(t.date);
                // getMonth() em JS começa em 0, por isso o +1
                return (date.getMonth() + 1).toString() === month && date.getFullYear().toString() === year;
            });
        }

        const summary = filteredTransactions.reduce(
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

    // Endpoint: Meses Disponíveis para o Filtro
    http.get('/api/available-months', () => {
        const monthsSet = new Set<string>();

        transactions.forEach(t => {
            const date = new Date(t.date);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            // Salva como string "YYYY-MM" para garantir unicidade
            monthsSet.add(`${year}-${month}`);
        });

        const availableMonths = Array.from(monthsSet).map(item => {
            const [year, month] = item.split('-');
            return { year: Number(year), month: Number(month) };
        }).sort((a, b) => {
            // Ordena decrescente: ano maior primeiro, depois mês maior
            if (a.year !== b.year) return b.year - a.year;
            return b.month - a.month;
        });

        return HttpResponse.json(availableMonths);
    }),

    // Endpoint: Listagem de Transações (com filtros e paginação)
    http.get('/api/transactions', ({ request }) => {
        const url = new URL(request.url);
        const page = Number(url.searchParams.get('page')) || 1;
        const limit = Number(url.searchParams.get('limit')) || 10;
        const search = url.searchParams.get('search')?.toLowerCase();
        const type = url.searchParams.get('type');

        // Novos parâmetros
        const startDate = url.searchParams.get('startDate');
        const endDate = url.searchParams.get('endDate');
        const minAmount = url.searchParams.get('minAmount');
        const maxAmount = url.searchParams.get('maxAmount');

        let filtered = [...transactions];

        if (search) {
            filtered = filtered.filter((t) => t.description.toLowerCase().includes(search));
        }

        if (type === 'income' || type === 'expense') {
            filtered = filtered.filter((t) => t.type === type);
        }

        if (startDate) {
            filtered = filtered.filter((t) => new Date(t.date) >= new Date(startDate));
        }

        if (endDate) {
            const end = new Date(endDate);
            end.setUTCHours(23, 59, 59, 999);
            filtered = filtered.filter((t) => new Date(t.date) <= end);
        }

        if (minAmount) {
            filtered = filtered.filter((t) => t.amount >= Number(minAmount));
        }
        if (maxAmount) {
            filtered = filtered.filter((t) => t.amount <= Number(maxAmount));
        }

        const sortBy = url.searchParams.get('sortBy') || 'date';
        const sortOrder = url.searchParams.get('sortOrder') || 'desc';

        filtered.sort((a, b) => {
            let comparison = 0;

            if (sortBy === 'amount') {
                comparison = a.amount - b.amount;
            } else {
                comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
            }

            return sortOrder === 'desc' ? -comparison : comparison;
        });

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
