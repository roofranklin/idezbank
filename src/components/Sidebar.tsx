export function Sidebar() {
    return (
        <aside className="w-64 bg-white flex flex-col h-screen fixed left-0 top-0 py-8">
            <div className="flex flex-col items-center justify-center mb-10 px-6">
                <div className="w-20 h-20 rounded-full bg-gray-100 mb-4 overflow-hidden border-4 border-white shadow-sm">
                    <img src={`https://rcode.com.br/assets/images/roosevelt.webp`} alt="Roosevelt Franklin" className="w-full h-full object-cover" />
                </div>
                <h2 className="font-bold text-gray-900 text-[17px] tracking-tight">Roosevelt Franklin</h2>
                <p className="text-xs text-gray-400 font-medium">Cliente Black</p>
            </div>

            <nav className="flex-1 px-4 space-y-1.5 flex flex-col">
                <a href="#" className="flex items-center gap-4 px-5 py-3.5 bg-[#F0F5FF] text-gray-900 rounded-[14px] font-semibold transition-colors">
                    <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Dashboard
                </a>

                <a href="#" className="flex items-center gap-4 px-5 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-[14px] font-medium transition-colors">
                    <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Cartões
                </a>

                <a href="#" className="flex items-center gap-4 px-5 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-[14px] font-medium transition-colors">
                    <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Transações
                </a>

                <a href="#" className="flex items-center gap-4 px-5 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-[14px] font-medium transition-colors">
                    <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Investimentos
                </a>
            </nav>

            <div className="px-4 space-y-1.5 mt-8 border-t border-gray-100 pt-8 mx-4">
                <a href="#" className="flex items-center gap-4 px-5 py-3.5 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-[14px] font-medium transition-colors">
                    <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ajuda
                </a>
                <button className="flex items-center gap-4 px-5 py-3.5 w-full text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-[14px] font-medium transition-colors">
                    <svg className="w-5 h-5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sair
                </button>
            </div>
        </aside>
    );
}
