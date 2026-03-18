import { useEffect, useState } from "react";
import { getStoresService } from "../../services/consumer.service";
import type { Store } from "../../types/stores.types";
import StoreCard from "../../components/consumer/StoreCard";
import Navbar from "../../components/consumer/NavBar";

export default function BrowseStores() {
    const [stores, setStores] = useState<Store[]>([]);

    const loadStores = async () => {
        try {
            const data = await getStoresService();
            // Filtramos para mostrar solo las tiendas abiertas
            const openStores = data.filter((s: Store) => s.isopen === true);
            setStores(openStores);
        } catch (error) {
            console.log("Error al conectar con el servidor", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await loadStores();
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">

            <Navbar />

            <main className="max-w-6xl mx-auto w-full px-6 py-10">

                <h1 className="text-2xl font-semibold text-gray-800 mb-8">
                    Tiendas disponibles
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stores.map((store) => (
                        <StoreCard key={store.id} store={store} />
                    ))}
                </div>

                {stores.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400">
                            No hay tiendas abiertas en este momento.
                        </p>
                    </div>
                )}

            </main>
        </div>
    );
}