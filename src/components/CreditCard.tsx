export function CreditCard() {
    return (
        <div className="bg-[#E4ECFA] p-7 rounded-[24px] text-gray-900 flex flex-col justify-between h-56 relative border-none">
            <div className="z-10 flex flex-col justify-center h-full gap-5">
                <div className="flex gap-2">
                    <span className="text-xl font-semibold tracking-[0.15em] text-gray-900">****</span>
                    <span className="text-xl font-semibold tracking-[0.15em] text-gray-900">****</span>
                    <span className="text-xl font-semibold tracking-[0.15em] text-gray-900">****</span>
                    <span className="text-xl font-semibold tracking-[0.15em] text-gray-900">8183</span>
                </div>
            </div>

            <div className="flex justify-between items-end mt-auto z-10 w-full pt-4">
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 text-[15px]">Roosevelt Santos</span>
                    <span className="font-medium text-xs text-gray-600 mt-1">12/31</span>
                </div>
                <div className="flex">
                    <div className="w-8 h-8 bg-red-500 rounded-full opacity-90 blur-[0.3px] -mr-3 relative z-10 mix-blend-multiply"></div>
                    <div className="w-8 h-8 bg-yellow-400 rounded-full opacity-90 blur-[0.3px] mix-blend-multiply"></div>
                </div>
            </div>
        </div>
    );
}
