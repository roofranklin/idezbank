import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateTransaction } from '../hooks/useCreateTransaction';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

const newTransactionSchema = z.object({
    description: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
    amount: z.string().min(1, 'O valor é obrigatório'),
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
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        formState: { errors },
    } = useForm<NewTransactionFormInputs>({
        resolver: zodResolver(newTransactionSchema),
        defaultValues: { type: 'expense' },
    });

    if (!isOpen) return null;

    const handleCreateNewTransaction = async (data: NewTransactionFormInputs) => {
        try {
            const cleanStr = data.amount.replace(/[^\d,-]/g, '').replace(',', '.');
            const numericAmount = Number(cleanStr);

            if (isNaN(numericAmount) || numericAmount <= 0) {
                toast.error('O valor deve ser maior que zero');
                return;
            }

            const formattedData = {
                ...data,
                amount: numericAmount,
                date: new Date(data.date).toISOString(),
            };

            await mutateAsync(formattedData);

            const formattedAmount = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(numericAmount);

            const typeLabel = data.type === 'income' ? 'recebida' : 'adicionada';
            const icon = data.type === 'income' ? '💰' : '✅';

            toast.success(
                `${icon} ${data.description} no valor de ${formattedAmount} foi ${typeLabel} com sucesso!`,
                {
                    duration: 6000,
                    style: {
                        borderRadius: '16px',
                        background: '#99edaaff',
                        color: '#0f3411ff',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                        fontWeight: '500',
                        fontSize: '14px',
                        padding: '22px 28px',
                        maxWidth: '380px',
                    },
                    iconTheme: {
                        primary: '#10B981',
                        secondary: '#fff',
                    },
                }
            );

            reset();
            setSelectedDate(null);
            onClose();
        } catch (error) {
            console.error('Erro ao salvar transação:', error);
            toast.error('Não foi possível salvar a transação. Tente novamente.', {
                duration: 6000,
                style: {
                    borderRadius: '16px',
                    background: '#fff',
                    color: '#111827',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    fontFamily: '"Plus Jakarta Sans", sans-serif',
                    fontWeight: '500',
                    fontSize: '14px',
                    padding: '14px 18px',
                },
                iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                },
            });
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        if (!value) {
            setValue('amount', '', { shouldValidate: true });
            return;
        }
        const numberValue = Number(value) / 100;
        const formatted = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(numberValue);
        setValue('amount', formatted, { shouldValidate: true });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 sm:slide-in-from-bottom-0 slide-in-from-bottom-full duration-300 pb-6 sm:pb-0">

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
                        <input type="text" placeholder="Descrição (ex: Conta de Luz)" {...register('description')} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                        {errors.description && <span className="text-red-500 text-xs mt-1">{errors.description.message}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Valor (R$)"
                                {...register('amount')}
                                onChange={(e) => {
                                    register('amount').onChange(e);
                                    handleAmountChange(e);
                                }}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                            {errors.amount && <span className="text-red-500 text-xs mt-1">{errors.amount.message as string}</span>}
                        </div>
                        <div>
                            <Controller
                                name="date"
                                control={control}
                                render={({ field }) => (
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={(date: Date | null) => {
                                            setSelectedDate(date);
                                            field.onChange(date ? format(date, 'yyyy-MM-dd') : '');
                                        }}
                                        locale={ptBR}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Data"
                                        className={`w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 ${errors.date ? 'border-red-300' : 'border-gray-300'}`}
                                        popperPlacement="top-start"
                                        wrapperClassName="w-full"
                                    />
                                )}
                            />
                            {errors.date && <span className="text-red-500 text-xs mt-1">{errors.date.message}</span>}
                        </div>
                    </div>

                    <div>
                        <input type="text" placeholder="Categoria (ex: Moradia)" {...register('category')} className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                        {errors.category && <span className="text-red-500 text-xs mt-1">{errors.category.message}</span>}
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors mt-2"
                    >
                        {isPending ? 'Salvando...' : 'Salvar Transação'}
                    </button>
                </form>
            </div>
        </div>
    );
}
