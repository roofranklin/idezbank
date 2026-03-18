function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 antialiased">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full border border-gray-100">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">Sistema Bancário</h1>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Mock
          </span>
        </div>

        <div className="bg-gradient-to-tr from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-md">
          <p className="text-blue-100 text-sm font-medium mb-1">Saldo Disponível</p>
          <h2 className="text-4xl font-extrabold tracking-tight">R$ 15.450,00</h2>
        </div>

        <div className="mt-6 flex gap-3">
          <button className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200">
            Depositar
          </button>
          <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2.5 px-4 rounded-lg transition-colors duration-200">
            Transferir
          </button>
        </div>

      </div>
    </div>
  )
}

export default App
