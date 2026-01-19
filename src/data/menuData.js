import { 
    Home, 
    Users, 
    School2Icon, 
    GraduationCap,
    ChartColumnStacked,
    CalendarRange,
    BookOpen,
    ClipboardList,
    FileText,
    BarChart3,
    MessageSquare,
    Clock,
    Settings
} from 'lucide-react';

// Items pour la sidebar du dashboard admin
export const adminMenuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'enseignant', label: 'Enseignants', icon: Users },
    { id: 'classe', label: 'Classes', icon: School2Icon },
    { id: 'etudiant', label: 'Étudiants', icon: GraduationCap },
    { id: 'periode', label: 'Périodes', icon: CalendarRange },
    { id: 'matiere', label: 'Matières', icon: ChartColumnStacked },
];

// Items pour la sidebar du dashboard enseignant
export const teacherMenuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'cours', label: 'Mes Cours', icon: BookOpen },
    { id: 'notes', label: 'Gestion des Notes', icon: ClipboardList },
    { id: 'devoirs', label: 'Devoirs', icon: FileText },
    { id: 'statistiques', label: 'Statistiques', icon: BarChart3 },
    { id: 'messagerie', label: 'Messagerie', icon: MessageSquare },
    { id: 'emploi_temps', label: 'Emploi du Temps', icon: Clock },
    { id: 'parametres', label: 'Paramètres', icon: Settings },
];

// Items pour la sidebar du dashboard étudiant
export const studentMenuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'notes', label: 'Mes Notes', icon: FileText },
    { id: 'cours', label: 'Mes Cours', icon: BookOpen },
    { id: 'devoirs', label: 'Mes Devoirs', icon: ClipboardList },
    { id: 'emploi_temps', label: 'Emploi du Temps', icon: Clock },
    { id: 'messagerie', label: 'Messagerie', icon: MessageSquare },
    { id: 'statistiques', label: 'Mes Statistiques', icon: BarChart3 },
    { id: 'parametres', label: 'Paramètres', icon: Settings },
];

// Fonction pour obtenir les items de menu selon le rôle
export const getMenuItems = (role) => {
    switch(role) {
        case 1: // Enseignant
            return teacherMenuItems;
        case 2: // Étudiant
            return studentMenuItems;
        case 3: // Admin
            return adminMenuItems;
        default:
            return [];
    }
};

// Fonction pour obtenir le préfixe de route selon le rôle
export const getRoutePrefix = (role) => {
    switch(role) {
        case 1: // Enseignant
            return '/enseignant';
        case 2: // Étudiant
            return '/etudiant';
        case 3: // Admin
            return '/admin';
        default:
            return '/';
    }
};

// Mappage des routes pour chaque rôle
export const getRouteMap = (role) => {
    const prefix = getRoutePrefix(role);
    
    switch(role) {
        case 1: // Enseignant
            return {
                dashboard: `${prefix}/dashboard`,
                cours: `${prefix}/cours`,
                notes: `${prefix}/notes`,
                devoirs: `${prefix}/devoirs`,
                statistiques: `${prefix}/statistiques`,
                messagerie: `${prefix}/messagerie`,
                emploi_temps: `${prefix}/emploi-du-temps`,
                parametres: `${prefix}/parametres`
            };
        case 2: // Étudiant
            return {
                dashboard: `${prefix}/dashboard`,
                notes: `${prefix}/notes`,
                cours: `${prefix}/cours`,
                devoirs: `${prefix}/devoirs`,
                emploi_temps: `${prefix}/emploi-du-temps`,
                messagerie: `${prefix}/messagerie`,
                statistiques: `${prefix}/statistiques`,
                parametres: `${prefix}/parametres`
            };
        case 3: // Admin
            return {
                dashboard: `${prefix}/dashboard`,
                enseignant: `${prefix}/enseignant`,
                classe: `${prefix}/classe`,
                etudiant: `${prefix}/etudiant`,
                periode: `${prefix}/periode`,
                matiere: `${prefix}/matiere`
            };
        default:
            return { dashboard: '/' };
    }
};