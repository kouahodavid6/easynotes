import { 
    Home, 
    Users, 
    School2Icon, 
    GraduationCap,
    ChartColumnStacked,
    CalendarRange
} from 'lucide-react';

// Items pour la sidebar du dashboard admin
export const adminMenuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home },
    { id: 'enseignant', label: 'Enseignants', icon: Users },
    { id: 'classe', label: 'Classes', icon: School2Icon },
    { id: 'etudiant', label: 'Étudiants', icon: GraduationCap },
    { id: 'matiere', label: 'Matières', icon: ChartColumnStacked },
    { id: 'periode', label: 'Périodes', icon: CalendarRange },
];