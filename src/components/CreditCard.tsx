import { useState } from 'react';

export function CreditCard() {
    const [isVisible, setIsVisible] = useState(false);

    const cardDigits = ['5412', '7534', '9821', '8183'];
    const cvv = '472';

    return (
        <div className="bg-white/40 backdrop-blur-md p-7 rounded-[24px] text-gray-900 flex flex-col justify-between h-56 relative border border-white/60 shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent opacity-50 pointer-events-none"></div>
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none"></div>

            <div className="z-10 flex justify-end">
                <button
                    onClick={() => setIsVisible(!isVisible)}
                    className="text-gray-500 hover:text-gray-800 transition-colors p-1"
                    title={isVisible ? 'Ocultar dados' : 'Exibir dados'}
                >
                    {isVisible ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878l4.242 4.242M21 21l-3.122-3.122" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    )}
                </button>
            </div>

            <div className="z-10 flex flex-col justify-center gap-5">
                <div className="flex gap-2">
                    {cardDigits.map((group, i) => (
                        <span key={i} className="text-xl font-semibold tracking-[0.15em] text-gray-900">
                            {i < 3 && !isVisible ? '****' : group}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-end mt-auto z-10 w-full pt-4">
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 text-[15px]">Roosevelt Santos</span>
                    <span className="font-medium text-xs text-gray-600 mt-1">12/31</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-semibold text-gray-500">
                        CVV <span className="text-gray-900 ml-1 tracking-wider">{isVisible ? cvv : '***'}</span>
                    </span>
                    <div className="flex">
                        <div className="w-8 h-8 bg-red-500 rounded-full opacity-90 blur-[0.3px] -mr-3 relative z-10 mix-blend-multiply"></div>
                        <div className="w-8 h-8 bg-yellow-400 rounded-full opacity-90 blur-[0.3px] mix-blend-multiply"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
