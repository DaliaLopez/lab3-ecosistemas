import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductsByStoreService, getStoresService, createOrderService } from '../../services/consumer.service';
import type { Product } from '../../types/products.types';
import type { Store } from '../../types/stores.types';
import type { CreateOrderDTO } from '../../types/orders.types';

import ProductCard from '../../components/consumer/ProductCard';
import CartSidebar from '../../components/consumer/CartSideBar';
import Navbar from '../../components/consumer/NavBar';
import axios from 'axios';

interface CartItem extends Product {
    quantity: number;
}

export default function StoreDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [storeName, setStoreName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            navigate('/browse');
            return;
        }

        const loadData = async () => {
            try {
                const [productsData, allStores] = await Promise.all([
                    getProductsByStoreService(id),
                    getStoresService()
                ]);
                setProducts(productsData);
                const currentStore = allStores.find((s: Store) => s.id === id);
                if (currentStore) setStoreName(currentStore.name);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, navigate]);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const total = Math.round(cart.reduce((acc, item) => acc + (item.price * item.quantity), 0));

    const handleFinalize = async (): Promise<void> => {
        const userId = localStorage.getItem('userId');

        if (!userId || !id) {
            alert("Error: Sesión no válida o tienda no encontrada.");
            return;
        }

        const totalVenta = Math.round(cart.reduce((acc, item) => acc + (item.price * item.quantity), 0));

        const orderData: CreateOrderDTO = {
            consumerid: userId,
            storeid: id,
            total: totalVenta,
            items: cart.map((item) => ({
                productid: item.id,
                quantity: item.quantity,
                priceattime: Math.round(item.price)
            }))
        };

        try {
            setLoading(true);
            await createOrderService(orderData);
            alert("¡Pedido realizado con éxito!");
            setCart([]);
            navigate('/my-orders');
        } catch (error: unknown) {
            let errorMessage = "Error interno del servidor (500)";

            if (axios.isAxiosError(error) && error.response) {
                errorMessage = error.response.data.message || errorMessage;
            }

            alert(`No se pudo crear el pedido: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-10">
                <h2 className="text-2xl font-semibold text-gray-800 mb-10">
                    Menú / <span className="text-orange-500">{storeName}</span>
                </h2>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-4">
                        {loading ? (
                            <p className="text-gray-400 text-sm">Cargando menú...</p>
                        ) : (
                            products.map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} />)
                        )}
                    </div>

                    <div className="lg:w-80 w-full">
                        <CartSidebar
                            cart={cart}
                            total={total}
                            onRemove={removeFromCart}
                            onFinalize={handleFinalize}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}