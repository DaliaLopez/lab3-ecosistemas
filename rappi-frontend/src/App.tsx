// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import BrowseStores from './pages/consumer/BrowseStores';
import MyOrders from './pages/consumer/MyOrders';
import StoreDashboard from './pages/store/StoreDashBoard';
import ProductInventory from './pages/store/ProductInventory';
import ProtectedRoute from './components/ProtectedRoute';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import StoreDetail from './pages/consumer/StoreDetail';
import DeliveryAcceptedOrders from './pages/delivery/DeliveryAcceptedOrders';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* REDIRECCIÓN INICIAL: Si entran a "/", mandarlos a login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* RUTAS PARA CONSUMIDORES (CLIENTES) */}
        <Route element={<ProtectedRoute allowedRole="consumer" />}>
          <Route path="/browse" element={<BrowseStores />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/stores/:id" element={<StoreDetail />} />
          
        </Route>

        {/* RUTAS PARA TIENDAS (BUSINESS) */}
        <Route element={<ProtectedRoute allowedRole="store" />}>
          <Route path="/store/dashboard" element={<StoreDashboard />} />
          <Route path="/store/inventory" element={<ProductInventory />} />
        </Route>

        <Route element={<ProtectedRoute allowedRole="delivery" />}>
          <Route path="/delivery/dashboard" element={<DeliveryDashboard />} />
          <Route path="/delivery/accepted-orders" element={<DeliveryAcceptedOrders />} />
        </Route>

        {/* 404 - Opcional */}
        <Route path="*" element={<div className="p-10 text-center">404 - No encontrado</div>} />
      </Routes>
    </BrowserRouter>
  );
}