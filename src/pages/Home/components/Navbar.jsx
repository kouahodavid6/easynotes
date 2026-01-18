import { navItems } from '../../../data/data';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, LogIn } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('accueil');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Référence pour détecter les clics en dehors
    const mobileMenuRef = useRef(null);
    const menuButtonRef = useRef(null);

    // Vérifier si on est sur la page d'accueil
    const isHomePage = location.pathname === '/';

    // Gérer les clics en dehors du menu mobile
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Si le menu mobile est ouvert ET que le clic est en dehors du menu ET en dehors du bouton menu
            if (isMobileMenuOpen && 
                mobileMenuRef.current && 
                !mobileMenuRef.current.contains(event.target) &&
                menuButtonRef.current && 
                !menuButtonRef.current.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };

        // Ajouter l'écouteur d'événement
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside); // Pour mobile

        // Nettoyer
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isMobileMenuOpen]);

    // Fermer le menu mobile quand on change de page
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        // Si on n'est pas sur la page d'accueil, ne pas gérer le défilement
        if (!isHomePage) {
            setActiveSection('');
            return;
        }

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
            
            // Détecter la section active basée sur la position de défilement
            const sections = navItems.map(item => item.id);
            let currentSection = '';
            
            for (const sectionId of sections) {
                const element = document.getElementById(sectionId);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const sectionTop = rect.top + window.pageYOffset;
                    const sectionHeight = rect.height;
                    
                    // Vérifier si on est dans la section
                    if (window.scrollY >= sectionTop - 100 && 
                        window.scrollY < sectionTop + sectionHeight - 100) {
                        currentSection = sectionId;
                        break;
                    }
                }
            }
            
            // Si on est en haut de la page, activer "accueil"
            if (window.scrollY < 100) {
                currentSection = 'accueil';
            }
            
            setActiveSection(currentSection);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        // Vérifier aussi au chargement initial
        handleScroll();
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHomePage]);

    const handleNavigation = (sectionId) => {
        if (sectionId === 'login') return;
        
        // Si on est déjà sur la page d'accueil, faire défiler
        if (isHomePage) {
            const element = document.getElementById(sectionId);
            if (element) {
                const navbar = document.querySelector('nav');
                const navbarHeight = navbar ? navbar.offsetHeight : 80;
                
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - navbarHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        } else {
            // Si on n'est pas sur la page d'accueil, naviguer vers l'accueil avec hash
            navigate(`/#${sectionId}`);
        }
        
        setIsMobileMenuOpen(false);
    };

    const handleLogoClick = () => {
        if (isHomePage) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setActiveSection('accueil');
        } else {
            navigate('/');
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className={`
            fixed top-0 left-0 w-full py-2 z-50 transition-all duration-300
            ${isScrolled 
                ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-rose-100' 
                : 'bg-white/90 backdrop-blur-lg border-b border-rose-50'
            }
        `}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <button 
                        onClick={handleLogoClick}
                        className="flex items-center focus:outline-none"
                    >
                        <img 
                            src="/logoEasyNote.png" 
                            alt="Logo EasyNotes"
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-contain"
                        />
                        <h1 className='text-gray-900 font-bold text-xl hidden sm:block ml-2'>
                            Easy<span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Notes</span>
                        </h1>
                    </button>

                    {/* Navigation desktop */}
                    <div className="hidden md:block">
                        <div className="ml-8 flex items-center space-x-1 lg:space-x-6">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigation(item.id)}
                                    className={`
                                        relative text-gray-700 font-medium px-3 py-2 transition-all duration-300
                                        hover:text-pink-500 group text-sm lg:text-base
                                        ${activeSection === item.id ? 'text-pink-500 font-semibold' : ''}
                                        ${!isHomePage ? 'cursor-pointer' : ''}
                                    `}
                                >
                                    {item.label}
                                    <span className={`
                                        absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-300
                                        transform -translate-x-1/2 rounded-full
                                        ${activeSection === item.id 
                                            ? 'w-full opacity-100' 
                                            : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                                        }
                                    `} />
                                </button>
                            ))}
                            
                            {/* Bouton Connexion avec Link */}
                            <Link
                                to="/login"
                                className="ml-4 px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-full 
                                           hover:from-pink-600 hover:to-rose-600 transition-all duration-300 
                                           shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Se connecter
                            </Link>
                        </div>
                    </div>

                    {/* Navigation tablette */}
                    <div className="hidden sm:block md:hidden">
                        <div className="flex items-center space-x-2">
                            {navItems.slice(0, 3).map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigation(item.id)}
                                    className={`
                                        relative text-gray-700 font-medium px-2 py-2 transition-all duration-300
                                        hover:text-pink-500 group text-xs
                                        ${activeSection === item.id ? 'text-pink-500 font-semibold' : ''}
                                        ${!isHomePage ? 'cursor-pointer' : ''}
                                    `}
                                >
                                    {item.label.split(' ')[0]}
                                    <span className={`
                                        absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-300
                                        transform -translate-x-1/2
                                        ${activeSection === item.id 
                                            ? 'w-full opacity-100' 
                                            : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-100'
                                        }
                                    `} />
                                </button>
                            ))}
                            
                            {/* Menu déroulant pour les items restants */}
                            <div className="relative group">
                                <button className="text-gray-700 font-medium px-2 py-2 hover:text-pink-500 transition-colors duration-300 text-xs">
                                    Plus <span className="text-xs">▾</span>
                                </button>
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-lg rounded-lg shadow-xl opacity-0 invisible 
                                                group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border border-rose-100">
                                    {navItems.slice(3).map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleNavigation(item.id)}
                                            className={`
                                                w-full text-left text-gray-700 font-medium px-4 py-3 transition-all duration-300
                                                hover:text-pink-500 hover:bg-rose-50 text-sm
                                                ${activeSection === item.id ? 'text-pink-500 bg-rose-50' : ''}
                                                first:rounded-t-lg last:rounded-b-lg
                                            `}
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Bouton Connexion tablette */}
                            <Link
                                to="/login"
                                className="ml-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-medium rounded-full 
                                           hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Connexion
                            </Link>
                        </div>
                    </div>

                    {/* Bouton menu mobile */}
                    <div className="sm:hidden flex items-center">
                        <Link
                            to="/login"
                            className="mr-3 px-4 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-medium rounded-full 
                                       hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Connexion
                        </Link>
                        
                        <button 
                            ref={menuButtonRef}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-700 p-2 hover:text-pink-500 transition-colors duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Menu mobile - avec ref pour détecter les clics en dehors */}
                {isMobileMenuOpen && (
                    <div 
                        ref={mobileMenuRef}
                        className="sm:hidden mt-2 pb-4 border-t border-rose-100 pt-4 animate-fadeIn"
                    >
                        <div className="flex flex-col space-y-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleNavigation(item.id)}
                                    className={`
                                        w-full text-gray-700 font-medium px-4 py-3 text-left transition-all duration-300
                                        hover:text-pink-500 hover:bg-rose-50 rounded-lg
                                        ${activeSection === item.id ? 'text-pink-500 bg-rose-50' : ''}
                                        flex items-center justify-between
                                    `}
                                >
                                    <span>{item.label}</span>
                                    {activeSection === item.id && (
                                        <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;