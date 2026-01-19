import { Bell, Settings, User, Menu, X, LogOut, GraduationCap, UserCircle, ShieldUser } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLogout } from '../../hooks/useAuth'
import ConfirmLogoutModal from '../../components/ConfirmLogoutModal'

const UniversalNavbar = ({ toggleSidebar, isSidebarOpen, user }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const location = useLocation();
    
    const mobileMenuRef = useRef(null);
    const menuButtonRef = useRef(null);
    
    const { logout } = useLogout();

    // Fermer le menu mobile quand la route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Gérer les clics en dehors
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobileMenuOpen && 
                mobileMenuRef.current && 
                !mobileMenuRef.current.contains(event.target) &&
                menuButtonRef.current && 
                !menuButtonRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const openLogoutModal = () => {
        setIsLogoutModalOpen(true);
        closeMobileMenu();
    };

    const closeLogoutModal = () => {
        setIsLogoutModalOpen(false);
    };

    const handleConfirmLogout = () => {
        logout();
    };

    // Obtenir le préfixe de route selon le rôle
    const getRoutePrefix = () => {
        switch(user.role) {
            case 1: return '/enseignant';
            case 2: return '/etudiant';
            case 3: return '/admin';
            default: return '/';
        }
    };

    // Obtenir le nom d'affichage
    const getDisplayName = () => {
        switch(user.role) {
            case 1: // Enseignant
                return `${user.prenomEns || ''} ${user.nomEns || ''}`.trim();
            case 2: // Étudiant
                return `${user.prenomEtu || ''} ${user.nomEtu || ''}`.trim();
            case 3: // Admin
                return `${user.prenom || ''} ${user.nom || ''}`.trim();
            default:
                return 'Utilisateur';
        }
    };

    // Obtenir l'email
    const getEmail = () => {
        return user.email || "utilisateur@example.com";
    };

    // Obtenir le titre du rôle
    const getRoleTitle = () => {
        switch(user.role) {
            case 1: return "Enseignant";
            case 2: return "Étudiant";
            case 3: return "Administrateur";
            default: return "Utilisateur";
        }
    };

    // Obtenir l'icône du rôle
    const getRoleIcon = () => {
        switch(user.role) {
            case 1: return GraduationCap;
            case 2: return UserCircle;
            case 3: return ShieldUser;
            default: return User;
        }
    };

    // Fonction pour afficher l'avatar
    const renderAvatar = () => {
        if (user?.photo && !imageError) {
            return (
                <img 
                    src={user.photo} 
                    alt={getDisplayName()} 
                    className="w-full h-full object-cover rounded-lg"
                    onError={() => setImageError(true)}
                    loading="lazy"
                />
            );
        }
        
        const RoleIcon = getRoleIcon();
        const gradientClass = () => {
            switch(user.role) {
                case 1: return 'from-blue-500 to-cyan-500';
                case 2: return 'from-emerald-500 to-teal-500';
                case 3: return 'from-pink-500 to-rose-500';
                default: return 'from-gray-500 to-gray-700';
            }
        };
        
        return (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradientClass()}`}>
                <RoleIcon size={16} className="text-white" />
            </div>
        );
    };

    const routePrefix = getRoutePrefix();

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-xl border-b border-pink-100 z-40 px-4 sm:px-6 flex items-center justify-between shadow-sm">
                {/* Section gauche */}
                <div className="flex items-center gap-4">
                    {/* Bouton menu mobile */}
                    <button 
                        className="lg:hidden w-10 h-10 rounded-lg bg-pink-50 hover:bg-pink-100 text-gray-700 hover:text-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
                        onClick={toggleSidebar}
                        aria-label={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
                    >
                        {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>

                    {/* Logo et nom */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm border border-pink-100 overflow-hidden">
                            <img 
                                src="/logoEasyNote.png" 
                                alt="EasyNotes" 
                                className="w-full h-full object-contain p-1"
                                onError={(e) => {
                                    console.error('❌ Erreur de chargement du logo');
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                        <div className="hidden sm:block">
                            <h1 className="text-gray-900 font-bold text-lg">
                                Easy<span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Notes</span>
                            </h1>
                            <p className="text-gray-500 text-xs">{getRoleTitle()} Dashboard</p>
                        </div>
                    </div>
                </div>

                {/* Navigation desktop */}
                <div className="hidden lg:flex items-center gap-3">
                    {/* Bouton Notifications */}
                    <Link to={`${routePrefix}/notifications`}>
                        <button 
                            className="w-10 h-10 rounded-lg bg-pink-50 hover:bg-pink-100 text-gray-700 hover:text-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 relative group"
                            aria-label="Notifications"
                        >
                            <Bell size={18} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
                        </button>
                    </Link>

                    {/* Bouton Paramètres */}
                    <Link to={`${routePrefix}/parametres`}>
                        <button 
                            className="w-10 h-10 rounded-lg bg-pink-50 hover:bg-pink-100 text-gray-700 hover:text-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
                            aria-label="Paramètres"
                        >
                            <Settings size={18} />
                        </button>
                    </Link>

                    {/* Bouton déconnexion desktop */}
                    <button 
                        className="w-10 h-10 rounded-lg bg-pink-50 hover:bg-pink-100 text-gray-700 hover:text-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
                        onClick={openLogoutModal}
                        aria-label="Déconnexion"
                    >
                        <LogOut size={18} />
                    </button>

                    <div className="w-px h-6 bg-pink-200 mx-2" />

                    <Link 
                        to={`${routePrefix}/profil`} 
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-pink-50 transition-all duration-300 group"
                        aria-label="Mon profil"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center overflow-hidden border border-pink-200">
                            {renderAvatar()}
                        </div>
                        <div className="text-left">
                            <p className="text-gray-900 text-sm font-medium group-hover:text-pink-600 transition-colors">
                                {getDisplayName()}
                            </p>
                            <p className="text-gray-500 text-xs truncate max-w-[150px]">
                                {getEmail()}
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Version mobile compacte */}
                <div className="flex lg:hidden items-center gap-2">
                    {/* Bouton Notifications mobile */}
                    <Link to={`${routePrefix}/notifications`}>
                        <button 
                            className="w-10 h-10 rounded-lg bg-pink-50 hover:bg-pink-100 text-gray-700 hover:text-pink-600 flex items-center justify-center transition-all duration-300 relative"
                            onClick={closeMobileMenu}
                            aria-label="Notifications"
                        >
                            <Bell size={18} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
                        </button>
                    </Link>

                    <button 
                        ref={menuButtonRef}
                        className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-pink-50 transition-all duration-300"
                        onClick={toggleMobileMenu}
                        aria-label="Menu utilisateur"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center overflow-hidden border border-pink-200">
                            {renderAvatar()}
                        </div>
                    </button>
                </div>
            </nav>

            {/* Menu mobile overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-30 lg:hidden">
                    <div 
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
                        onClick={closeMobileMenu}
                        aria-label="Fermer le menu"
                    />
                    
                    <div 
                        ref={mobileMenuRef}
                        className="absolute top-16 right-4 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-pink-100 animate-in slide-in-from-top-2 duration-300 w-72"
                    >
                        <div className="p-4 space-y-3">
                            {/* Informations utilisateur */}
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-pink-50/50 border border-pink-100">
                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center overflow-hidden border border-pink-200">
                                    {renderAvatar()}
                                </div>
                                <div className="text-left flex-1 min-w-0">
                                    <p className="text-gray-900 text-sm font-medium truncate">
                                        {getDisplayName()}
                                    </p>
                                    <p className="text-gray-600 text-xs truncate">
                                        {getEmail()}
                                    </p>
                                    <p className="text-pink-500 text-xs mt-1 font-medium">
                                        {getRoleTitle()}
                                    </p>
                                </div>
                            </div>

                            {/* Lien Profil mobile */}
                            <Link to={`${routePrefix}/profil`} onClick={closeMobileMenu}>
                                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition-all duration-300 active:scale-95">
                                    <User size={18} />
                                    <span>Mon Profil</span>
                                </button>
                            </Link>

                            {/* Lien Paramètres mobile */}
                            <Link to={`${routePrefix}/parametres`} onClick={closeMobileMenu}>
                                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition-all duration-300 active:scale-95">
                                    <Settings size={18} />
                                    <span>Paramètres</span>
                                </button>
                            </Link>

                            {/* Lien Notifications mobile */}
                            <Link to={`${routePrefix}/notifications`} onClick={closeMobileMenu}>
                                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-pink-50 text-gray-700 hover:text-pink-600 transition-all duration-300 active:scale-95">
                                    <Bell size={18} />
                                    <span>Notifications</span>
                                    <span className="ml-auto w-2 h-2 bg-rose-500 rounded-full"></span>
                                </button>
                            </Link>

                            <div className="pt-3 border-t border-pink-100">
                                <button 
                                    className="w-full flex items-center gap-3 p-3 text-gray-700 hover:text-rose-600 hover:bg-rose-50 text-sm transition-all duration-300 rounded-lg active:scale-95"
                                    onClick={openLogoutModal}
                                >
                                    <LogOut size={18} />
                                    <span>Déconnexion</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de confirmation de déconnexion */}
            <ConfirmLogoutModal 
                isOpen={isLogoutModalOpen}
                onClose={closeLogoutModal}
                onConfirm={handleConfirmLogout}
            />
        </>
    );
};

export default UniversalNavbar;