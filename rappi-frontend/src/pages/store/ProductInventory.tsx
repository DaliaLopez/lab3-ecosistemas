import { useEffect, useState, useCallback } from "react";
import { getProductsByStoreService } from "../../services/consumer.service";
import { createProductService, deleteProductService } from "../../services/store.service";
import type { Product, CreateProductDTO } from "../../types/products.types";
import StoreNavbar from "../../components/store/NavBar";

export default function ProductInventory() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const [newProduct, setNewProduct] = useState<Partial<CreateProductDTO>>({
        name: '', description: '', price: 0, imageUrl: ''
    });

    const storeId = localStorage.getItem('storeId');

    const fetchProducts = useCallback(async () => {
        if (!storeId) return;
        try {
            setLoading(true);
            const data = await getProductsByStoreService(storeId);
            setProducts(data);
        } catch (error) {
            console.error("Error cargando productos:", error);
        } finally {
            setLoading(false);
        }
    }, [storeId]);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!storeId) return;
        try {
            await createProductService({ ...newProduct, storeid: storeId } as CreateProductDTO);
            setShowForm(false);
            setNewProduct({ name: '', description: '', price: 0, imageUrl: '' });
            fetchProducts();
        } catch (error) { console.error(error); }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("¿Estás seguro de eliminar este producto?")) {
            try {
                await deleteProductService(id);
                fetchProducts();
            } catch (error) { console.error(error); }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            <StoreNavbar />

            <main className="max-w-5xl mx-auto px-6 py-10">

                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Mi menú
                        </h1>
                        <p className="text-sm text-gray-500">
                            Gestiona tus productos
                        </p>
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        className={`px-5 py-2 rounded-lg text-sm font-medium transition ${showForm
                                ? 'bg-gray-200 text-gray-600'
                                : 'bg-orange-500 text-white hover:bg-orange-600'
                            }`}
                    >
                        {showForm ? "Cancelar" : "Nuevo producto"}
                    </button>
                </div>

                {showForm && (
                    <form
                        onSubmit={handleCreateProduct}
                        className="bg-white p-6 rounded-xl border border-gray-200 mb-10 grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <input
                            type="text"
                            placeholder="Nombre"
                            required
                            className="border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-400"
                            value={newProduct.name}
                            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                        />

                        <input
                            type="number"
                            placeholder="Precio"
                            required
                            className="border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-400"
                            value={newProduct.price || ''}
                            onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                        />

                        <input
                            type="url"
                            placeholder="URL imagen"
                            className="md:col-span-2 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-400"
                            value={newProduct.imageUrl}
                            onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                        />

                        <textarea
                            placeholder="Descripción"
                            required
                            className="md:col-span-2 border border-gray-200 rounded-lg p-3 text-sm h-24 focus:outline-none focus:border-orange-400"
                            value={newProduct.description}
                            onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                        />

                        <button
                            type="submit"
                            className="md:col-span-2 bg-orange-500 text-white py-3 rounded-lg text-sm hover:bg-orange-600 transition"
                        >
                            Guardar producto
                        </button>
                    </form>
                )}

                <div className="grid gap-4">

                    {loading ? (
                        <div className="text-center py-12 text-gray-400 text-sm">
                            Cargando inventario...
                        </div>
                    ) : products.length === 0 ? (
                        <div className="bg-white p-16 text-center rounded-xl border border-gray-200">
                            <p className="text-gray-400">
                                Aún no tienes productos
                            </p>
                        </div>
                    ) : (
                        products.map(product => (
                            <div
                                key={product.id}
                                className="bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center"
                            >
                                <div>
                                    <h3 className="text-gray-800 font-medium">
                                        {product.name}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        ${product.price}
                                    </p>

                                    <p className="text-xs text-gray-400 line-clamp-1">
                                        {product.description}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="px-4 py-2 text-sm rounded-lg border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 transition"
                                >
                                    Eliminar
                                </button>

                            </div>
                        ))
                    )}

                </div>

            </main>

        </div>
    );
}