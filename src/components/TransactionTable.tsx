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
    const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
        sortBy,
        sortOrder,
    });

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', { month: 'short', day: '2-digit' }).format(date);
    };

    const handleSort = (column: 'date' | 'amount') => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
        setPage(1);
    };

    const SortIcon = ({ column }: { column: 'date' | 'amount' }) => {
        if (sortBy !== column) return <span className="text-gray-300 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">↕</span>;
        return sortOrder === 'asc' ? <span className="text-indigo-600 ml-1">↑</span> : <span className="text-indigo-600 ml-1">↓</span>;
    };

    return (
        <div className="flex flex-col w-full">
            <div className="flex flex-col gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Pesquisar transação..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50/80 hover:bg-gray-100/50 border-none rounded-2xl text-sm focus:ring-0 outline-none transition-all placeholder:text-gray-400 font-medium text-gray-900"
                        />
                        <svg className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="md:w-48 px-4 py-3 bg-gray-50/80 hover:bg-gray-100/50 border-none rounded-2xl text-sm focus:ring-0 outline-none cursor-pointer text-gray-900 font-medium transition-all"
                    >
                        <option value="all">Todos os Tipos</option>
                        <option value="income">Receitas</option>
                        <option value="expense">Despesas</option>
                    </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="px-4 py-3 bg-gray-50/80 hover:bg-gray-100/50 border-none rounded-xl text-sm focus:ring-0 outline-none text-gray-900 font-medium transition-all"
                        title="Data Inicial"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="px-4 py-3 bg-gray-50/80 hover:bg-gray-100/50 border-none rounded-xl text-sm focus:ring-0 outline-none text-gray-900 font-medium transition-all"
                        title="Data Final"
                    />
                    <input
                        type="number"
                        step="0.01"
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                        placeholder="Valor Min (R$)"
                        className="px-4 py-3 bg-gray-50/80 hover:bg-gray-100/50 border-none rounded-xl text-sm focus:ring-0 outline-none placeholder:text-gray-400 text-gray-900 font-medium transition-all"
                    />
                    <input
                        type="number"
                        step="0.01"
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                        placeholder="Valor Máx (R$)"
                        className="px-4 py-3 bg-gray-50/80 hover:bg-gray-100/50 border-none rounded-xl text-sm focus:ring-0 outline-none placeholder:text-gray-400 text-gray-900 font-medium transition-all"
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="p-12 text-center text-gray-400 animate-pulse font-medium">Carregando transações...</div>
            ) : isError ? (
                <div className="p-12 text-center text-danger font-medium">Erro ao carregar os dados.</div>
            ) : !data || data.data.length === 0 ? (
                <div className="p-16 text-center flex flex-col items-center justify-center">
                    <div className="bg-gray-50 p-4 rounded-full mb-3">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <p className="text-gray-900 font-semibold mb-1">Nenhuma transação encontrada</p>
                    <p className="text-gray-500 text-sm">Tente ajustar os filtros acima.</p>
                </div>
            ) : (
                <>
                    <div className={`overflow-x-auto transition-opacity duration-200 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-100 select-none">
                                <tr>
                                    <th
                                        className="px-4 sm:px-6 py-4 cursor-pointer hover:bg-gray-100 transition-colors group w-[120px]"
                                        onClick={() => handleSort('date')}
                                    >
                                        <div className="flex items-center">Data <SortIcon column="date" /></div>
                                    </th>
                                    <th className="px-4 sm:px-6 py-4 w-16 hidden sm:table-cell">Tipo</th>
                                    <th className="px-4 sm:px-6 py-4">Descrição</th>
                                    <th className="px-4 sm:px-6 py-4 hidden sm:table-cell">Categoria</th>
                                    <th
                                        className="px-4 sm:px-6 py-4 text-right cursor-pointer hover:bg-gray-100 transition-colors group"
                                        onClick={() => handleSort('amount')}
                                    >
                                        <div className="flex items-center justify-end">Valor <SortIcon column="amount" /></div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50/50">
                                {data.data.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-4 sm:px-6 py-4 text-gray-500 whitespace-nowrap text-xs sm:text-sm">{formatDate(transaction.date)}</td>
                                        <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${transaction.type === 'income' ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-500'}`}>
                                                {transaction.type === 'income' ? (
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                    </svg>
                                                )}
                                            </div>
                                        </td>
                                        <td
                                            className="px-4 sm:px-6 py-4 font-medium text-gray-900 max-w-[110px] sm:max-w-none truncate"
                                            title={transaction.description}
                                        >
                                            {transaction.description}
                                        </td>
                                        <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                                            <span className="bg-gray-100/80 text-gray-600 px-3 py-1 rounded-full text-xs font-medium border border-gray-200/60 inline-flex items-center justify-center">
                                                {transaction.category}
                                            </span>
                                        </td>
                                        <td className={`px-4 sm:px-6 py-4 text-right font-semibold whitespace-nowrap ${transaction.type === 'income' ? 'text-success' : 'text-gray-900'}`}>
                                            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
                        <span className="text-sm text-gray-400">
                            Página <span className="font-medium text-gray-900">{data.meta.currentPage}</span> de <span className="font-medium text-gray-900">{data.meta.totalPages}</span>
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((old) => Math.max(old - 1, 1))}
                                disabled={page === 1}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => setPage((old) => (!data || old >= data.meta.totalPages ? old : old + 1))}
                                disabled={!data || page >= data.meta.totalPages}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
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
