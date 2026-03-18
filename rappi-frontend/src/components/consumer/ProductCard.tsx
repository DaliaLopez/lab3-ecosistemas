import type { Product } from '../../types/products.types';

interface ProductCardProps {
    product: Product;
    onAdd: (product: Product) => void;
}

export default function ProductCard({ product, onAdd }: ProductCardProps) {
    return (
        <div className="bg-white p-4 rounded-xl flex justify-between items-center border border-gray-200 hover:border-orange-200 transition-all shadow-sm hover:shadow">
            <div className="flex gap-5 items-center">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                    {product.imageurl ? (
                        <img src={product.imageurl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-xs text-gray-300">NO-IMG</span>
                    )}
                </div>
                <div>
                    <h4 className="font-semibold text-gray-800 text-base">{product.name}</h4>
                    <p className="text-xs text-gray-400 mt-1">
                        {product.description || "Disponible ahora"}
                    </p>
                    <p className="text-orange-500 font-semibold mt-1">
                        ${Math.round(product.price)}
                    </p>
                </div>
            </div>
            <button
                onClick={() => onAdd(product)}
                className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition"
            >
                Agregar
            </button>
        </div>
    );
}