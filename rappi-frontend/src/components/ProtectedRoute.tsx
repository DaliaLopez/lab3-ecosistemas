import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRole }: {allowedRole?: string}) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  if (!token) {
    return <Navigate to="/register" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to={userRole === 'consumer' ? '/browse' : '/store/dashboard'} replace />;
  }

  return <Outlet />;
}