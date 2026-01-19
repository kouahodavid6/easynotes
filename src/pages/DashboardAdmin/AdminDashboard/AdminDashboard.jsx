import { useState, useEffect, useCallback } from 'react';
import { 
    Users, 
    GraduationCap, 
    BookOpen, 
    TrendingUp, 
    Calendar, 
    Clock,
    PlusCircle,
    School,
    Activity,
    ArrowUpRight
} from 'lucide-react';
import PageHeader from '../../../components/PageHeader';
import StatCard from './components/StatCard';
import { useEnseignants } from '../../../hooks/useEnseignants';
import { useEtudiants } from '../../../hooks/useEtudiants';
import { useClasses } from '../../../hooks/useClasses';
import { useMatieres } from '../../../hooks/useMatieres';
import { usePeriodes } from '../../../hooks/usePeriodes';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    // Utilisation des hooks pour récupérer les données réelles
    const { enseignants, isLoading: isLoadingEnseignants } = useEnseignants();
    const { etudiants, isLoading: isLoadingEtudiants } = useEtudiants();
    const { classes, isLoading: isLoadingClasses } = useClasses();
    const { matieres, isLoading: isLoadingMatieres } = useMatieres();
    const { periodes, isLoading: isLoadingPeriodes } = usePeriodes();

    // Calculer les statistiques
    const [stats, setStats] = useState({
        enseignants: 0,
        etudiants: 0,
        classes: 0,
        matieres: 0,
        periodes: 0,
        etudiantsCeMois: 0,
        enseignantsCeMois: 0,
        matieresCeMois: 0
    });

    const [recentActivity, setRecentActivity] = useState([]);
    const [topClasses, setTopClasses] = useState([]);
    const [isLoadingStats, setIsLoadingStats] = useState(true);

    // Formater le temps écoulé
    const formatTimeAgo = useCallback((dateString) => {
        if (!dateString) return 'Date inconnue';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) {
            return `Il y a ${diffMins} min`;
        } else if (diffHours < 24) {
            return `Il y a ${diffHours} h`;
        } else if (diffDays === 1) {
            return 'Hier';
        } else {
            return `Il y a ${diffDays} jours`;
        }
    }, []);

    // Générer l'activité récente
    const generateRecentActivity = useCallback((etudiantsList, enseignantsList, matieresList) => {
        const activities = [];
        
        // Prendre les 4 derniers étudiants ajoutés
        const recentEtudiants = [...etudiantsList]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 2);
        
        // Prendre les 2 derniers enseignants ajoutés
        const recentEnseignants = [...enseignantsList]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 1);
        
        // Prendre la dernière matière ajoutée
        const recentMatiere = [...matieresList]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 1);

        // Formater les activités
        recentEtudiants.forEach(etudiant => {
            activities.push({
                action: 'Nouvel étudiant inscrit',
                user: `${etudiant.prenomEtu} ${etudiant.nomEtu}`,
                time: formatTimeAgo(etudiant.created_at),
                type: 'etudiant',
                date: new Date(etudiant.created_at)
            });
        });

        recentEnseignants.forEach(enseignant => {
            activities.push({
                action: 'Nouvel enseignant ajouté',
                user: `${enseignant.prenomEns} ${enseignant.nomEns}`,
                time: formatTimeAgo(enseignant.created_at),
                type: 'enseignant',
                date: new Date(enseignant.created_at)
            });
        });

        recentMatiere.forEach(matiere => {
            activities.push({
                action: 'Nouvelle matière créée',
                user: matiere.libelleMat,
                time: formatTimeAgo(matiere.created_at),
                type: 'matiere',
                date: new Date(matiere.created_at)
            });
        });

        // Trier par date et prendre les 4 plus récents
        const sortedActivities = activities
            .sort((a, b) => b.date - a.date)
            .slice(0, 4);

        setRecentActivity(sortedActivities);
    }, [formatTimeAgo]);

    // Générer les top classes
    const generateTopClasses = useCallback((etudiantsList, classesList) => {
        // Compter les étudiants par classe
        const studentsPerClass = {};
        
        etudiantsList.forEach(etudiant => {
            if (etudiant.classe) {
                const classeId = etudiant.classe.id;
                studentsPerClass[classeId] = (studentsPerClass[classeId] || 0) + 1;
            }
        });

        // Créer la liste des top classes
        const topClassesList = Object.entries(studentsPerClass)
            .map(([classeId, studentCount]) => {
                const classe = classesList.find(c => c.id.toString() === classeId);
                return {
                    id: classeId,
                    name: classe ? classe.libelleCl : 'Classe inconnue',
                    students: studentCount,
                    niveau: classe ? classe.niveauCl : 'N/A'
                };
            })
            .sort((a, b) => b.students - a.students)
            .slice(0, 4);

        setTopClasses(topClassesList);
    }, []);

    // Calculer les statistiques quand les données sont chargées
    useEffect(() => {
        if (enseignants && etudiants && classes && matieres && periodes) {
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            // Calcul des statistiques de base
            const newStats = {
                enseignants: enseignants.length || 0,
                etudiants: etudiants.length || 0,
                classes: classes.length || 0,
                matieres: matieres.length || 0,
                periodes: periodes.length || 0,
                etudiantsCeMois: 0,
                enseignantsCeMois: 0,
                matieresCeMois: 0
            };

            // Calcul des ajouts ce mois-ci
            etudiants.forEach(etudiant => {
                if (etudiant.created_at) {
                    const date = new Date(etudiant.created_at);
                    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                        newStats.etudiantsCeMois++;
                    }
                }
            });

            enseignants.forEach(enseignant => {
                if (enseignant.created_at) {
                    const date = new Date(enseignant.created_at);
                    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                        newStats.enseignantsCeMois++;
                    }
                }
            });

            matieres.forEach(matiere => {
                if (matiere.created_at) {
                    const date = new Date(matiere.created_at);
                    if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                        newStats.matieresCeMois++;
                    }
                }
            });

            setStats(newStats);
            setIsLoadingStats(false);

            // Générer l'activité récente
            generateRecentActivity(etudiants, enseignants, matieres);
            
            // Générer les top classes
            generateTopClasses(etudiants, classes);
        }
    }, [enseignants, etudiants, classes, matieres, periodes, generateRecentActivity, generateTopClasses]);

    const isLoadingAll = isLoadingEnseignants || isLoadingEtudiants || isLoadingClasses || isLoadingMatieres || isLoadingPeriodes || isLoadingStats;

    // Obtenir l'icône et la couleur selon le type d'activité
    const getActivityIcon = (type) => {
        switch(type) {
            case 'etudiant':
                return { Icon: GraduationCap, color: 'text-orange-500 bg-orange-100' };
            case 'enseignant':
                return { Icon: Users, color: 'text-pink-500 bg-pink-100' };
            case 'matiere':
                return { Icon: BookOpen, color: 'text-emerald-500 bg-emerald-100' };
            case 'classe':
                return { Icon: School, color: 'text-blue-500 bg-blue-100' };
            default:
                return { Icon: Activity, color: 'text-gray-500 bg-gray-100' };
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Tableau de bord"
                subtitle="Vue d'ensemble de votre établissement"
            />

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Enseignants"
                    value={isLoadingAll ? '...' : stats.enseignants}
                    icon={Users}
                    iconBgColor="from-pink-500 to-rose-500"
                    subtitle={`${stats.enseignantsCeMois} ce mois`}
                    isLoading={isLoadingAll}
                    trend={stats.enseignantsCeMois > 0 ? 'up' : 'neutral'}
                    trendValue={stats.enseignantsCeMois}
                />
                
                <StatCard
                    title="Étudiants"
                    value={isLoadingAll ? '...' : stats.etudiants}
                    icon={GraduationCap}
                    iconBgColor="from-orange-500 to-amber-500"
                    subtitle={`${stats.etudiantsCeMois} ce mois`}
                    isLoading={isLoadingAll}
                    trend={stats.etudiantsCeMois > 0 ? 'up' : 'neutral'}
                    trendValue={stats.etudiantsCeMois}
                />
                
                <StatCard
                    title="Classes"
                    value={isLoadingAll ? '...' : stats.classes}
                    icon={School}
                    iconBgColor="from-emerald-500 to-teal-500"
                    subtitle="Classes actives"
                    isLoading={isLoadingAll}
                />
                
                <StatCard
                    title="Matières"
                    value={isLoadingAll ? '...' : stats.matieres}
                    icon={BookOpen}
                    iconBgColor="from-blue-500 to-cyan-500"
                    subtitle={`${stats.matieresCeMois} ce mois`}
                    isLoading={isLoadingAll}
                    trend={stats.matieresCeMois > 0 ? 'up' : 'neutral'}
                    trendValue={stats.matieresCeMois}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activité récente */}
                <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-gray-900 text-xl font-bold">Activité récente</h2>
                            <p className="text-gray-500 text-sm mt-1">Les dernières actions dans votre établissement</p>
                        </div>
                        <Activity className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        {isLoadingAll ? (
                            // Skeleton pour l'activité récente
                            Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="flex items-start gap-4 p-3 rounded-lg">
                                    <div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse mt-1"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                    <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
                                </div>
                            ))
                        ) : recentActivity.length === 0 ? (
                            <div className="text-center py-8">
                                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">Aucune activité récente</p>
                            </div>
                        ) : (
                            recentActivity.map((item, index) => {
                                const { Icon, color } = getActivityIcon(item.type);
                                
                                return (
                                    <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-pink-50 transition-colors">
                                        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center flex-shrink-0 mt-1`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-gray-900 font-medium truncate">{item.action}</p>
                                            <p className="text-gray-500 text-sm truncate">{item.user}</p>
                                        </div>
                                        <span className="text-gray-400 text-xs whitespace-nowrap flex-shrink-0">{item.time}</span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Top classes par nombre d'étudiants */}
                <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-gray-900 text-xl font-bold">Classes populaires</h2>
                            <p className="text-gray-500 text-sm mt-1">Classes avec le plus d'étudiants</p>
                        </div>
                        <TrendingUp className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        {isLoadingAll ? (
                            // Skeleton pour les top classes
                            Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 rounded-lg">
                                    <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                    <div className="text-right space-y-2">
                                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            ))
                        ) : topClasses.length === 0 ? (
                            <div className="text-center py-8">
                                <School className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500">Aucune donnée de classe disponible</p>
                            </div>
                        ) : (
                            topClasses.map((classe, index) => (
                                <div key={classe.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-pink-50 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-gray-900 font-medium truncate">{classe.name}</p>
                                        <p className="text-gray-500 text-sm truncate">{classe.niveau}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-gray-900 font-bold">{classe.students}</p>
                                        <p className="text-gray-400 text-xs">Étudiants</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-gray-900 text-xl font-bold">Actions rapides</h2>
                        <p className="text-gray-500 text-sm mt-1">Gérez rapidement votre établissement</p>
                    </div>
                    <PlusCircle className="w-5 h-5 text-pink-500" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link 
                        to="/admin/enseignant" 
                        className="bg-white p-4 rounded-xl border border-pink-100 hover:shadow-md transition-all duration-300 text-left hover:scale-[1.02] hover:border-pink-200"
                    >
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-3">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <p className="font-medium text-gray-900">Ajouter un enseignant</p>
                        <p className="text-gray-500 text-sm mt-1">Créer un nouveau compte enseignant</p>
                        <div className="mt-3 flex items-center text-pink-600 text-sm font-medium">
                            <span>Voir la liste</span>
                            <ArrowUpRight className="w-4 h-4 ml-1" />
                        </div>
                    </Link>
                    
                    <Link 
                        to="/admin/etudiant" 
                        className="bg-white p-4 rounded-xl border border-pink-100 hover:shadow-md transition-all duration-300 text-left hover:scale-[1.02] hover:border-orange-200"
                    >
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-3">
                            <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <p className="font-medium text-gray-900">Inscrire un étudiant</p>
                        <p className="text-gray-500 text-sm mt-1">Ajouter un nouvel étudiant</p>
                        <div className="mt-3 flex items-center text-orange-600 text-sm font-medium">
                            <span>Voir la liste</span>
                            <ArrowUpRight className="w-4 h-4 ml-1" />
                        </div>
                    </Link>
                    
                    <Link 
                        to="/admin/matiere" 
                        className="bg-white p-4 rounded-xl border border-pink-100 hover:shadow-md transition-all duration-300 text-left hover:scale-[1.02] hover:border-emerald-200"
                    >
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-3">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <p className="font-medium text-gray-900">Créer une matière</p>
                        <p className="text-gray-500 text-sm mt-1">Ajouter une nouvelle matière</p>
                        <div className="mt-3 flex items-center text-emerald-600 text-sm font-medium">
                            <span>Voir la liste</span>
                            <ArrowUpRight className="w-4 h-4 ml-1" />
                        </div>
                    </Link>
                    
                    <Link 
                        to="/admin/periode" 
                        className="bg-white p-4 rounded-xl border border-pink-100 hover:shadow-md transition-all duration-300 text-left hover:scale-[1.02] hover:border-blue-200"
                    >
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-3">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <p className="font-medium text-gray-900">Planifier période</p>
                        <p className="text-gray-500 text-sm mt-1">Définir une période scolaire</p>
                        <div className="mt-3 flex items-center text-blue-600 text-sm font-medium">
                            <span>Voir la liste</span>
                            <ArrowUpRight className="w-4 h-4 ml-1" />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Résumé des périodes */}
            {!isLoadingAll && periodes.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-gray-900 text-xl font-bold">Périodes académiques</h2>
                            <p className="text-gray-500 text-sm mt-1">Statut des périodes en cours et à venir</p>
                        </div>
                        <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {periodes.slice(0, 3).map((periode) => {
                            const debut = new Date(periode.debutPrd);
                            const fin = new Date(periode.finPrd);
                            const now = new Date();
                            let status = 'À venir';
                            let statusColor = 'bg-blue-100 text-blue-700';
                            
                            if (debut <= now && fin >= now) {
                                status = 'En cours';
                                statusColor = 'bg-green-100 text-green-700';
                            } else if (fin < now) {
                                status = 'Terminée';
                                statusColor = 'bg-gray-100 text-gray-700';
                            }
                            
                            return (
                                <div key={periode.id} className="p-4 rounded-xl border border-gray-100 hover:border-pink-200 transition-colors">
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="font-medium text-gray-900">{periode.libellePrd}</h3>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                                            {status}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            <span>Du {debut.toLocaleDateString('fr-FR')} au {fin.toLocaleDateString('fr-FR')}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Clock className="w-4 h-4 mr-2" />
                                            <span>
                                                {Math.ceil((fin - debut) / (1000 * 60 * 60 * 24))} jours
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;