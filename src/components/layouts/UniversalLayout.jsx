import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UniversalSidebar from './UniversalSidebar'
import UniversalNavbar from './UniversalNavbar';
import { useAuth } from '../../hooks/useAuth';
import { getRouteMap, getRoutePrefix } from '../../data/menuData'

// Fonction pour déterminer l'item actif
const getActiveItemFromPath = (pathname, routeMap) => {
    const pathSegments = pathname.split('/');
    const currentPath = pathSegments[pathSegments.length - 1];
    
    // Trouver la clé correspondant au chemin actuel
    return Object.keys(routeMap).find(key => {
        const routePath = routeMap[key];
        return routePath.includes(currentPath);
    }) || 'dashboard';
};

const UniversalLayout = ({ children }) => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    if (!user) {
        return null; // Ou un loader
    }

    const routeMap = getRouteMap(user.role);
    const routePrefix = getRoutePrefix(user.role);
    const activeItem = getActiveItemFromPath(location.pathname, routeMap);

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    const closeMobileSidebar = () => {
        setIsMobileSidebarOpen(false);
    };

    const handleItemClick = (itemId) => {
        const route = routeMap[itemId] || `${routePrefix}/dashboard`;
        navigate(route);

        // Fermer la sidebar sur mobile après un clic
        if (window.innerWidth < 1024) {
            closeMobileSidebar();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
            {/* Navbar universelle */}
            <UniversalNavbar 
                toggleSidebar={toggleMobileSidebar}
                isSidebarOpen={isMobileSidebarOpen}
                user={user}
            />

            {/* Sidebar universelle */}
            <UniversalSidebar 
                activeItem={activeItem} 
                onItemClick={handleItemClick}
                isMobileOpen={isMobileSidebarOpen}
                onCloseMobile={closeMobileSidebar}
                user={user}
            />

            {/* Contenu principal */}
            <main className="pt-16 lg:pl-56 transition-all duration-300">
                <div className="p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default UniversalLayout;