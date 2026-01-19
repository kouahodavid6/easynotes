import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getRoutePrefix } from '../data/menuData';

const PrivateRoute = ({ children, requiredRole }) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Vérification du rôle si spécifié
    if (requiredRole) {
        const userRole = user.role;
        let hasAccess = false;

        switch(requiredRole) {
            case 'admin':
                hasAccess = userRole === 3;
                break;
            case 'enseignant':
                hasAccess = userRole === 1;
                break;
            case 'etudiant':
                hasAccess = userRole === 2;
                break;
            default:
                hasAccess = true;
        }

        if (!hasAccess) {
            // Rediriger vers le dashboard correspondant à son rôle
            const routePrefix = getRoutePrefix(userRole);
            return <Navigate to={`${routePrefix}/dashboard`} replace />;
        }
    }

    return children;
};

export default PrivateRoute;