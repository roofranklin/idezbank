import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateTransaction } from '../hooks/useCreateTransaction';

const newTransactionSchema = z.object({
    description: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
    amount: z.any().transform(Number).refine((val) => !isNaN(val) && val > 0, 'O valor deve ser maior que zero'),
    type: z.enum(['income', 'expense']),
    category: z.string().min(2, 'Informe uma categoria válida'),
    date: z.string().min(1, 'A data é obrigatória'),
});

type NewTransactionFormInputs = z.infer<typeof newTransactionSchema>;

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NewTransactionModal({ isOpen, onClose }: ModalProps) {
    const { mutateAsync, isPending } = useCreateTransaction();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<NewTransactionFormInputs>({
        resolver: zodResolver(newTransactionSchema),
        defaultValues: { type: 'expense' },
    });

    if (!isOpen) return null;

    const handleCreateNewTransaction = async (data: NewTransactionFormInputs) => {
        try {
            const formattedData = {
                ...data,
                date: new Date(data.date).toISOString(),
            };

            await mutateAsync(formattedData);
            reset();
            onClose();
        } catch (error) {
            console.error('Erro ao salvar transação:', error);
            alert('Erro ao salvar a transação. Tente novamente.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Nova Transação</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit(handleCreateNewTransaction)} className="p-6 space-y-4">

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <label className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-colors ${errors.type ? 'border-red-300' : 'border-gray-200'} has-[:checked]:bg-green-50 has-[:checked]:border-green-500 has-[:checked]:text-green-700`}>
                            <input type="radio" value="income" {...register('type')} className="sr-only" />
                            <span className="font-medium">Entrada</span>
                        </label>
                        <label className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-colors ${errors.type ? 'border-red-300' : 'border-gray-200'} has-[:checked]:bg-red-50 has-[:checked]:border-red-500 has-[:checked]:text-red-700`}>
                            <input type="radio" value="expense" {...register('type')} className="sr-only" />
                            <span className="font-medium">Saída</span>
                        </label>
                    </div>

                    <div>
                        <input type="text" placeholder="Descrição (ex: Conta de Luz)" {...register('description')} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        {errors.description && <span className="text-red-500 text-xs mt-1">{errors.description.message}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="Valor (R$)"
                                {...register('amount', { valueAsNumber: true })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.amount && <span className="text-red-500 text-xs mt-1">{errors.amount.message}</span>}
                        </div>
                        <div>
                            <input type="date" {...register('date')} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700" />
                            {errors.date && <span className="text-red-500 text-xs mt-1">{errors.date.message}</span>}
                        </div>
                    </div>

                    <div>
                        <input type="text" placeholder="Categoria (ex: Moradia)" {...register('category')} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        {errors.category && <span className="text-red-500 text-xs mt-1">{errors.category.message}</span>}
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors mt-2"
                    >
                        {isPending ? 'Salvando...' : 'Salvar Transação'}
                    </button>
                </form>
            </div>
        </div>
    );
}
