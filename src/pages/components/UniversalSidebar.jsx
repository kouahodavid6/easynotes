import { useState } from 'react';
import { getMenuItems } from '../../data/menuData';

const UniversalSidebar = ({ activeItem, onItemClick, isMobileOpen, onCloseMobile, user }) => {
    const [hoveredItem, setHoveredItem] = useState(null);
    
    // Obtenir les items de menu selon le rôle
    const menuItems = getMenuItems(user.role);

    // Obtenir le titre du rôle
    const getRoleTitle = () => {
        switch(user.role) {
            case 1: return "Enseignant";
            case 2: return "Étudiant";
            case 3: return "Administrateur";
            default: return "Utilisateur";
        }
    };

    return (
        <>
            {/* Overlay mobile */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
                    onClick={onCloseMobile}
                />
            )}

            {/* Sidebar */}
            <aside 
                className={`
                    fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white/95 backdrop-blur-xl border-r border-pink-100 z-40 
                    flex flex-col py-6 transition-all duration-300 overflow-hidden shadow-sm
                    ${isMobileOpen ? 'translate-x-0 w-56' : '-translate-x-full'}
                    lg:translate-x-0 lg:w-56
                `}
            >
                <nav className="flex-1 flex flex-col gap-1 w-full px-3 overflow-y-auto scrollbar-hide">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeItem === item.id;
                        const isHovered = hoveredItem === item.id;

                        return (
                            <div key={item.id} className="relative">
                                <button
                                    onClick={() => {
                                        onItemClick(item.id);
                                        if (isMobileOpen) onCloseMobile();
                                    }}
                                    onMouseEnter={() => setHoveredItem(item.id)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    className={`
                                        w-full h-14 rounded-xl flex items-center px-4 justify-start gap-3
                                        transition-all duration-300
                                        ${isActive
                                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30'
                                            : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
                                        }
                                    `}
                                >
                                    <Icon
                                        size={22}
                                        className={`transition-transform duration-300 ${isHovered && !isActive ? 'scale-110' : ''}`}
                                    />
                                    
                                    <span className="text-sm font-medium whitespace-nowrap opacity-100">
                                        {item.label}
                                    </span>
                                </button>
                            </div>
                        );
                    })}
                </nav>

                {/* Footer de la sidebar */}
                <div className="px-3 pt-6 border-t border-pink-100">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-pink-50/50 justify-start">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-pink-200">
                            <img 
                                src="/logoEasyNote.png" 
                                alt="EasyNotes" 
                                className="w-full h-full object-contain p-1"
                            />
                        </div>
                        <div className="text-left">
                            <p className="text-gray-900 text-xs font-bold">
                                Easy<span className="text-pink-500">Notes</span>
                            </p>
                            <p className="text-gray-500 text-xs">{getRoleTitle()} v1.0</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default UniversalSidebar;