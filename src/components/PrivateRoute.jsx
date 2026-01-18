import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                    <p className="text-gray-600">Vérification des droits d'accès...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Vérifier le rôle si spécifié
    if (requiredRole) {
        const roleMap = {
            'admin': 3,
            'enseignant': 1,
            'etudiant': 2
        };

        const requiredRoleId = roleMap[requiredRole];
        
        if (user?.role !== requiredRoleId) {
            // Rediriger vers le dashboard approprié
            switch(user?.role) {
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
    }

    return children;
};

export default PrivateRoute;