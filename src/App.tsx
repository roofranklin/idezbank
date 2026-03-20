import { useState } from 'react';
import { useSummary } from './hooks/useSummary';
import { TransactionTable } from './components/TransactionTable';
import { NewTransactionModal } from './components/NewTransactionModal';
import { Sidebar } from './components/Sidebar';
import { CreditCard } from './components/CreditCard';
import { SummaryCard } from './components/SummaryCard';
import { ChartCard } from './components/ChartCard';

import { Toaster } from 'react-hot-toast';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: summary, isLoading, isError } = useSummary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 flex font-sans antialiased text-gray-900 overflow-x-hidden">
      <Toaster position="top-right" />
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <main className="flex-1 lg:ml-64 p-4 md:p-8 w-full max-w-[100vw]">
        <header className="mb-8 md:mb-10 flex gap-4 justify-between items-center">
          <div className="flex items-center gap-3 w-full">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="relative w-full max-w-sm md:w-96">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="pesquisar..."
                className="w-full pl-12 pr-4 py-3 bg-white/60 border-none rounded-2xl text-sm focus:ring-0 outline-none transition-all placeholder:text-gray-400 font-medium"
              />
            </div>
          </div>

          <div className="flex gap-2 md:gap-4 items-center">
            <button className="hidden sm:flex w-10 h-10 bg-white rounded-full items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </button>
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors relative flex-shrink-0">
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-400 rounded-full"></div>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
          </div>
        </header>

        <h1 className="text-[24px] md:text-[28px] font-bold tracking-tight text-gray-900 mb-6">Dashboard</h1>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <CreditCard />
          <SummaryCard data={summary} isLoading={isLoading} isError={isError} />
          <ChartCard />
        </section>

        <section className="bg-white rounded-[24px] p-5 md:p-8 -mx-4 md:mx-0 shadow-sm shadow-gray-100/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold tracking-tight text-gray-900">Transações</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md cursor-pointer py-2.5 md:py-2 px-6 rounded-xl transition-all active:scale-95 text-center focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              + Nova transação
            </button>
          </div>
          <TransactionTable />
        </section>
      </main>

      <NewTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
