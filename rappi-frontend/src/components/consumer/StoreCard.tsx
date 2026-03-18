import type { Store } from "../../types/stores.types";
import { useNavigate } from "react-router-dom";

export default function StoreCard({ store }: { store: Store }) {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/stores/${store.id}`)}
            className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all cursor-pointer"
        >
            <div className="h-36 bg-gray-100 flex items-center justify-center">
                <span className="text-5xl">🍔</span>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="text-lg font-semibold text-gray-800">{store.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${store.isopen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {store.isopen ? "Abierto" : "Cerrado"}
                    </span>
                </div>

                <p className="text-sm text-gray-500">
                    Comida rápida • 15-25 min
                </p>
            </div>
        </div>
    );
}