import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';

// Mapping des routes
const routeMap = {
    dashboard: '/admin/dashboard',
    enseignant: '/admin/enseignant',
    classe: '/admin/classe',
    etudiant: '/admin/etudiant',
    matiere: '/admin/matiere',
    periode: '/admin/periode'
};

// Fonction pour déterminer l'item actif
const getActiveItemFromPath = (pathname) => {
    const path = pathname.split('/')[2] || 'dashboard';
    return Object.keys(routeMap).find(key => routeMap[key] === `/admin/${path}`) || 'dashboard';
};

const AdminLayout = ({ children }) => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const activeItem = getActiveItemFromPath(location.pathname);

    const toggleMobileSidebar = () => {
        setIsMobileSidebarOpen(!isMobileSidebarOpen);
    };

    const closeMobileSidebar = () => {
        setIsMobileSidebarOpen(false);
    };

    const handleItemClick = (itemId) => {
        const route = routeMap[itemId] || '/admin/dashboard';
        navigate(route);

        // Fermer la sidebar sur mobile après un clic
        if (window.innerWidth < 1024) {
            closeMobileSidebar();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white">
            {/* Navbar fixe */}
            <AdminNavbar 
                toggleSidebar={toggleMobileSidebar}
                isSidebarOpen={isMobileSidebarOpen}
            />

            {/* Sidebar - FIXE à 56px */}
            <AdminSidebar 
                activeItem={activeItem} 
                onItemClick={handleItemClick}
                isMobileOpen={isMobileSidebarOpen}
                onCloseMobile={closeMobileSidebar}
            />

            {/* Contenu principal - TOUJOURS pl-56 pour la sidebar de 56px */}
            <main className="pt-16 lg:pl-56 transition-all duration-300">
                <div className="p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default AdminLayout;