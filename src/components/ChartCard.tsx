import { useState, useEffect } from 'react';
import { useSummary } from '../hooks/useSummary';
import { useAvailableMonths } from '../hooks/useAvailableMonths';

export function ChartCard() {
    const { data: monthsList, isLoading: isLoadingMonths } = useAvailableMonths();

    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

    /**
     * Quando a lista carregar, seleciona automaticamente o mês mais recente disponível
     * caso o mês atual não tenha transações.
    */
    useEffect(() => {
        if (monthsList && monthsList.length > 0) {
            const hasCurrentSelection = monthsList.some(m => m.month === selectedMonth && m.year === selectedYear);
            if (!hasCurrentSelection) {
                setSelectedMonth(monthsList[0].month);
                setSelectedYear(monthsList[0].year);
            }
        }
    }, [monthsList]);

    const { data, isLoading } = useSummary({ month: selectedMonth, year: selectedYear });

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    const getMonthName = (monthNumber: number) => {
        const names = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
        return names[monthNumber - 1];
    };

    const income = data?.totalIncome || 0;
    const expense = data?.totalExpense || 0;
    const max = Math.max(income, expense, 1);

    const incomeHeight = `${(income / max) * 100}%`;
    const expenseHeight = `${(expense / max) * 100}%`;

    return (
        <div className="bg-white p-7 rounded-[24px] shadow-sm shadow-gray-100/50 border-none flex flex-col justify-between h-56 relative overflow-hidden">
            <div className="z-10 relative mb-2 flex justify-between items-start">
                <h3 className="text-[15px] font-medium text-gray-400 mt-1">Fluxo de Caixa</h3>

                {isLoadingMonths ? (
                    <div className="h-6 w-24 bg-gray-100 rounded-xl animate-pulse"></div>
                ) : (
                    <select
                        value={`${selectedYear}-${selectedMonth}`}
                        onChange={(e) => {
                            const [year, month] = e.target.value.split('-');
                            setSelectedYear(Number(year));
                            setSelectedMonth(Number(month));
                        }}
                        className="text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-xl border-none outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                        {monthsList?.map(({ month, year }) => (
                            <option key={`${year}-${month}`} value={`${year}-${month}`}>
                                {getMonthName(month)} / {year}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <div className="flex-1 flex items-end gap-5 justify-center pb-1 z-10 w-full mt-4">
                {isLoading ? (
                    <div className="flex justify-center items-end gap-5 h-full">
                        <div className="w-12 bg-gray-50 rounded-t-xl h-3/4 animate-pulse"></div>
                        <div className="w-12 bg-gray-50 rounded-t-xl h-1/2 animate-pulse"></div>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col items-center h-full justify-end group w-16">
                            <div className="relative flex justify-center w-full h-[100px] items-end">
                                <span className="absolute -top-8 text-xs font-bold text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-2 py-1 shadow-sm border border-gray-100 rounded-lg z-20 whitespace-nowrap">
                                    {formatCurrency(income)}
                                </span>
                                <div
                                    className="w-full bg-green-300 rounded-t-[14px] transition-all duration-1000 ease-out origin-bottom hover:bg-green-600"
                                    style={{ height: incomeHeight === '0%' ? '5%' : incomeHeight }}
                                ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-400 mt-3">Receitas</span>
                        </div>

                        <div className="flex flex-col items-center h-full justify-end group w-16">
                            <div className="relative flex justify-center w-full h-[100px] items-end">
                                <span className="absolute -top-8 text-xs font-bold text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-2 py-1 shadow-sm border border-gray-100 rounded-lg z-20 whitespace-nowrap">
                                    {formatCurrency(expense)}
                                </span>
                                <div
                                    className="w-full bg-red-400 rounded-t-[14px] transition-all duration-1000 ease-out origin-bottom hover:bg-red-600"
                                    style={{ height: expenseHeight === '0%' ? '5%' : expenseHeight }}
                                ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-400 mt-3">Despesas</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
