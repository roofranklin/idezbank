import type { Summary } from '../types';

interface SummaryCardProps {
    data?: Summary;
    isLoading: boolean;
    isError: boolean;
}

export function SummaryCard({ data, isLoading, isError }: SummaryCardProps) {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    return (
        <div className="bg-white p-7 rounded-[24px] shadow-sm shadow-gray-100/50 border-none flex flex-col justify-between h-56">
            <div>
                <h3 className="text-[15px] font-medium text-gray-400 mb-2 mt-1">Meu saldo</h3>
                {isLoading ? (
                    <div className="h-10 w-3/4 bg-gray-50 rounded animate-pulse"></div>
                ) : isError ? (
                    <h2 className="text-xl font-bold text-red-500">Erro</h2>
                ) : (
                    <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
                        {formatCurrency(data?.totalBalance || 0)}
                    </h2>
                )}
            </div>

            <div className="flex gap-8 mt-auto">
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-green-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    </div>
                    <div>
                        {isLoading ? (
                            <div className="h-5 w-20 bg-gray-50 rounded animate-pulse"></div>
                        ) : (
                            <span className="font-semibold text-gray-900 text-sm block">
                                {formatCurrency(data?.totalIncome || 0)}
                            </span>
                        )}
                        <span className="text-xs font-medium text-gray-400">Receitas</span>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-red-50 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                    <div>
                        {isLoading ? (
                            <div className="h-5 w-20 bg-gray-50 rounded animate-pulse"></div>
                        ) : (
                            <span className="font-semibold text-gray-900 text-sm block">
                                {formatCurrency(data?.totalExpense || 0)}
                            </span>
                        )}
                        <span className="text-xs font-medium text-gray-400">Despesas</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
