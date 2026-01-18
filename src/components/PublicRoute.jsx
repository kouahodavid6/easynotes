import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PublicRoute = ({ children }) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                    <p className="text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    // Si l'utilisateur est déjà authentifié, le rediriger vers son dashboard
    if (isAuthenticated && user) {
        switch(user.role) {
            case 1:
                return <Navigate to="/enseignant/dashboard" replace />;
            case 2:
                return <Navigate to="/etudiant/dashboard" replace />;
            case 3:
                return <Navigate to="/admin/dashboard" replace />;
            default:
                return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default PublicRoute;