import { useEffect, useState, useCallback } from "react";
import { getAvailableOrdersService, acceptOrderService, getOrderDetailsService } from "../../services/delivery.service";
import type { Order } from "../../types/orders.types";
import DeliveryNavbar from "../../components/delivery/NavBar";

interface OrderItemDetail {
    id: string;
    orderid: string;
    productid: string;
    quantity: number;
    priceattime: number;
    name: string;
}

export default function DeliveryDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItemDetail[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingDetails, setLoadingDetails] = useState<boolean>(false);

    const deliveryId = localStorage.getItem('userId');

    const loadOrders = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAvailableOrdersService();
            setOrders(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const viewDetails = async (orderId: string): Promise<void> => {
        try {
            setLoadingDetails(true);
            const items = await getOrderDetailsService(orderId);

            if (!items || items.length === 0) {
                alert("No hay productos para esta orden.");
                return;
            }

            setSelectedOrderItems(items);
        } catch {
            alert("Error de conexión.");
        } finally {
            setLoadingDetails(false);
        }
    };

    const handleAccept = async (orderId: string): Promise<void> => {
        if (!deliveryId) return;
        try {
            await acceptOrderService(orderId, deliveryId);
            await loadOrders();
            alert("Pedido aceptado");
        } catch (error) { console.error("No se pudo aceptar el pedido", error); }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <DeliveryNavbar />

            <main className="max-w-md mx-auto px-4 py-10">

                <header className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Pedidos disponibles
                    </h1>
                    <p className="text-sm text-gray-400">
                        Acepta una orden para comenzar
                    </p>
                </header>

                {loading ? (
                    <div className="text-center py-12 text-gray-400 text-sm">
                        Cargando pedidos...
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white p-14 rounded-2xl border border-gray-100 text-center shadow-sm">
                        <p className="text-gray-400">
                            No hay pedidos disponibles
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">

                        {orders.map((order) => (

                            <div
                                key={order.id}
                                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4"
                            >

                                <div className="flex justify-between items-center">

                                    <h3 className="text-gray-900 font-semibold">
                                        ${order.total}
                                    </h3>

                                    <button
                                        onClick={() => viewDetails(order.id)}
                                        disabled={loadingDetails}
                                        className="text-sm text-orange-500 hover:underline disabled:opacity-50"
                                    >
                                        {loadingDetails ? '...' : 'Ver'}
                                    </button>

                                </div>

                                <button
                                    onClick={() => handleAccept(order.id)}
                                    className="bg-green-500 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-600 transition"
                                >
                                    Aceptar pedido
                                </button>

                            </div>

                        ))}

                    </div>
                )}

            </main>

            {selectedOrderItems && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-50">

                    <div className="bg-white w-full max-w-sm rounded-3xl p-6 border border-gray-100 shadow-xl">

                        <h2 className="text-lg font-semibold text-gray-900 mb-6">
                            Productos
                        </h2>

                        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">

                            {selectedOrderItems.map((item) => (

                                <div
                                    key={item.id}
                                    className="flex justify-between items-center bg-gray-50 p-3 rounded-xl"
                                >

                                    <div className="flex items-center gap-2">
                                        <span className="text-xs bg-orange-100 text-orange-500 px-2 py-1 rounded-md">
                                            x{item.quantity}
                                        </span>

                                        <p className="text-sm text-gray-700">
                                            {item.name}
                                        </p>
                                    </div>

                                    <span className="text-xs text-gray-400">
                                        ${item.priceattime}
                                    </span>

                                </div>

                            ))}

                        </div>

                        <button
                            onClick={() => setSelectedOrderItems(null)}
                            className="w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-black transition"
                        >
                            Cerrar
                        </button>

                    </div>

                </div>
            )}
        </div>
    );
}