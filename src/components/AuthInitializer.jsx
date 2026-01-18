import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AuthInitializer = ({ children }) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!isLoading) {
            // Empêcher l'accès à /login si déjà connecté
            if (isAuthenticated && location.pathname === '/login') {
                // Rediriger vers le dashboard approprié
                switch(user?.role) {
                    case 1:
                        navigate('/enseignant/dashboard', { replace: true });
                        break;
                    case 2:
                        navigate('/etudiant/dashboard', { replace: true });
                        break;
                    case 3:
                        navigate('/admin/dashboard', { replace: true });
                        break;
                    default:
                        navigate('/', { replace: true });
                }
            }

            // Empêcher l'accès aux routes protégées sans authentification
            const protectedRoutes = ['/admin', '/enseignant', '/etudiant'];
            const isProtectedRoute = protectedRoutes.some(route => 
                location.pathname.startsWith(route)
            );

            if (isProtectedRoute && !isAuthenticated) {
                navigate('/login', { replace: true });
            }
        }
    }, [isAuthenticated, isLoading, location, navigate, user]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
                    <p className="text-gray-600">Initialisation de la sécurité...</p>
                </div>
            </div>
        );
    }

    return children;
};

export default AuthInitializer;