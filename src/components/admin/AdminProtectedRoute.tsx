import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const AdminProtectedRoute = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Verificando permissões...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user?.user_metadata?.user_role === 'admin';

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-4xl font-bold">Acesso Negado</h1>
        <p className="text-lg mt-2">Você não tem permissão para acessar esta página.</p>
        <a href="/" className="mt-4 text-blue-500 hover:underline">Voltar para a página inicial</a>
      </div>
    );
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
