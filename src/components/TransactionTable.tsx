import { useTransactions } from '../hooks/useTransactions';

export function TransactionTable() {
    const { data, isLoading, isError } = useTransactions({ page: 1, limit: 10 });

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    const formatDate = (dateString: string) =>
        new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateString));

    if (isLoading) return <div className="p-4 text-center text-gray-500 animate-pulse">Carregando transações...</div>;
    if (isError) return <div className="p-4 text-center text-red-500">Erro ao carregar o extrato.</div>;
    if (!data || data.data.length === 0) return <div className="p-4 text-center text-gray-500">Nenhuma transação encontrada.</div>;

    return (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
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
        </div>
    );
}
