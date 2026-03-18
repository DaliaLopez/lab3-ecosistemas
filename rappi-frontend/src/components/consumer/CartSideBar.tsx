import type { Product } from '../../types/products.types';

interface CartItem extends Product {
    quantity: number;
}

interface CartSidebarProps {
    cart: CartItem[];
    total: number;
    onRemove: (id: string) => void;
    onFinalize: () => void;
}

export default function CartSidebar({ cart, total, onRemove, onFinalize }: CartSidebarProps) {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-24 w-full">
            <h3 className="text-sm font-semibold text-gray-800 mb-6">Tu Carrito</h3>

            <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2">
                {cart.length > 0 ? (
                    cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-start border-b border-gray-100 pb-3">
                            <div className="flex-1">
                                <p className="font-medium text-gray-700 text-sm">
                                    {item.name} <span className="text-orange-500 ml-1">x{item.quantity}</span>
                                </p>
                                <p className="text-gray-400 text-xs mt-1">
                                    ${Math.round(item.price * item.quantity)}
                                </p>
                            </div>
                            <button
                                onClick={() => onRemove(item.id)}
                                className="text-red-500 hover:underline text-xs ml-2 transition-colors"
                            >
                                Eliminar
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400 py-6 text-sm">
                        Carrito vacío
                    </p>
                )}
            </div>

            <div className="border-t border-gray-100 pt-5">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 text-sm">Total</span>
                    <span className="text-xl font-semibold text-gray-800">${Math.round(total)}</span>
                </div>

                <button
                    disabled={cart.length === 0}
                    onClick={onFinalize}
                    className={`w-full py-3 rounded-lg text-sm font-semibold transition ${cart.length > 0
                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    Confirmar Pedido
                </button>
            </div>
        </div>
    );
}