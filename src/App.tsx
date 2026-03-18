import { useState } from 'react';
import { useSummary } from './hooks/useSummary';
import { TransactionTable } from './components/TransactionTable';
import { NewTransactionModal } from './components/NewTransactionModal';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: summary, isLoading, isError } = useSummary();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 antialiased">
      <div className="w-full max-w-4xl">

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-gray-800">Sistema Bancário</h1>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">Mock</span>
          </div>

          <div className="bg-gradient-to-tr from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
            <p className="text-blue-100 text-sm font-medium mb-1 relative z-10">Saldo Disponível</p>
            <div className="relative z-10">
              {isLoading ? (
                <div className="h-10 w-3/4 bg-blue-500/50 rounded animate-pulse mt-1"></div>
              ) : isError ? (
                <h2 className="text-xl font-bold text-red-300 mt-1">Erro ao carregar</h2>
              ) : (
                <h2 className="text-4xl font-extrabold tracking-tight mt-1">
                  {formatCurrency(summary?.totalBalance || 0)}
                </h2>
              )}
            </div>
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200"
            >
              Nova Transação
            </button>
            <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 px-4 rounded-lg transition-colors duration-200">
              Exportar Extrato
            </button>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">Extrato Recente</h2>
        <TransactionTable />

      </div>

      <NewTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
