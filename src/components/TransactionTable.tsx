import { useState, useEffect } from 'react';
import { useTransactions } from '../hooks/useTransactions';

export function TransactionTable() {
    const limit = 10;

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');

    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [debouncedMin, setDebouncedMin] = useState('');
    const [debouncedMax, setDebouncedMax] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setDebouncedMin(minAmount);
            setDebouncedMax(maxAmount);
            setPage(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, minAmount, maxAmount]);

    useEffect(() => {
        setPage(1);
    }, [typeFilter, startDate, endDate]);

    const { data, isLoading, isFetching, isError } = useTransactions({
        page,
        limit,
        search: debouncedSearch || undefined,
        type: typeFilter === 'all' ? undefined : typeFilter,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        minAmount: debouncedMin ? Number(debouncedMin) : undefined,
        maxAmount: debouncedMax ? Number(debouncedMax) : undefined,
    });

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    const formatDate = (dateString: string) =>
        new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateString));

    return (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

            <div className="p-5 border-b border-gray-100 bg-gray-50/50 space-y-4">

                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative w-full sm:w-2/3">
                        <input
                            type="text"
                            placeholder="Pesquisar por descrição..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                        <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <div className="w-full sm:w-1/3">
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white cursor-pointer"
                        >
                            <option value="all">Todas as transações</option>
                            <option value="income">Apenas Entradas</option>
                            <option value="expense">Apenas Saídas</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 font-medium mb-1">Data Inicial</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 font-medium mb-1">Data Final</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 font-medium mb-1">Valor Mínimo (R$)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={minAmount}
                            onChange={(e) => setMinAmount(e.target.value)}
                            placeholder="Ex: 100,00"
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs text-gray-500 font-medium mb-1">Valor Máximo (R$)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={maxAmount}
                            onChange={(e) => setMaxAmount(e.target.value)}
                            placeholder="Ex: 5000,00"
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

            </div>

            {isLoading ? (
                <div className="p-12 text-center text-gray-500 animate-pulse font-medium">Carregando extrato...</div>
            ) : isError ? (
                <div className="p-12 text-center text-red-500 font-medium">Erro ao carregar o extrato.</div>
            ) : !data || data.data.length === 0 ? (
                <div className="p-16 text-center flex flex-col items-center justify-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-3">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-gray-600 font-semibold text-lg">Nenhuma transação encontrada</p>
                    <p className="text-gray-400 text-sm mt-1">Ajuste os filtros de data, valor ou descrição acima.</p>
                </div>
            ) : (
                <>
                    <div className={`overflow-x-auto transition-opacity duration-200 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">Data</th>
                                    <th className="px-6 py-4">Descrição</th>
                                    <th className="px-6 py-4">Categoria</th>
                                    <th className="px-6 py-4 text-right">Valor</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {data.data.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(transaction.date)}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{transaction.description}</td>
                                        <td className="px-6 py-4">
                                            <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs">
                                                {transaction.category}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-medium whitespace-nowrap ${transaction.type === 'income' ? 'text-green-600' : 'text-gray-900'
                                            }`}>
                                            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                        <span className="text-sm text-gray-500">
                            Página <span className="font-medium text-gray-900">{data.meta.currentPage}</span> de <span className="font-medium text-gray-900">{data.meta.totalPages}</span>
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((old) => Math.max(old - 1, 1))}
                                disabled={page === 1}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => setPage((old) => (!data || old >= data.meta.totalPages ? old : old + 1))}
                                disabled={!data || page >= data.meta.totalPages}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Próximo
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
