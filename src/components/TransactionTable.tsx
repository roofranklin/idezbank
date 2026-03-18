import { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';

export function TransactionTable() {

    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading, isFetching, isError } = useTransactions({ page, limit });

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    const formatDate = (dateString: string) =>
        new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateString));

    if (isLoading) return <div className="p-4 text-center text-gray-500 animate-pulse">A carregar transações...</div>;
    if (isError) return <div className="p-4 text-center text-red-500">Erro ao carregar o extrato.</div>;
    if (!data || data.data.length === 0) return <div className="p-4 text-center text-gray-500">Nenhuma transação encontrada.</div>;

    return (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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

            {/* Controlos de Paginação */}
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
        </div>
    );
}
