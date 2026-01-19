import { useState, useMemo } from 'react';
import { 
    Search, 
    Plus, 
    BookOpen, 
    GraduationCap, 
    User, 
    Calendar,
    Edit, 
    Trash2, 
    ChevronDown, 
    X,
    Hash,
    Clock
} from 'lucide-react';
import PageHeader from "../../../components/PageHeader";
import { useMatieres } from '../../../hooks/useMatieres';
import { useClasses } from '../../../hooks/useClasses';
import { useEnseignants } from '../../../hooks/useEnseignants';
import { usePeriodes } from '../../../hooks/usePeriodes';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import MatiereModal from "./components/MatiereModal";

// Composant Skeleton pour les cartes de statistiques
const StatCardSkeleton = () => (
    <div className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm animate-pulse">
        <div className="flex items-center justify-between">
            <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="h-8 w-16 bg-gray-300 rounded"></div>
            </div>
            <div className="p-2 rounded-lg bg-gray-100">
                <div className="h-6 w-6 bg-gray-300 rounded"></div>
            </div>
        </div>
    </div>
);

// Composant Skeleton pour les lignes du tableau
const TableRowSkeleton = () => (
    <tr className="animate-pulse">
        <td className="p-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-300 rounded"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
            </div>
        </td>
        <td className="p-4">
            <div className="space-y-2">
                <div className="h-3 w-40 bg-gray-200 rounded"></div>
                <div className="h-3 w-32 bg-gray-200 rounded"></div>
            </div>
        </td>
        <td className="p-4">
            <div className="space-y-2">
                <div className="h-3 w-32 bg-gray-200 rounded"></div>
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
        </td>
        <td className="p-4">
            <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
        </td>
        <td className="p-4">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </td>
        <td className="p-4">
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
            </div>
        </td>
    </tr>
);

// Composant Skeleton pour la barre de recherche
const SearchBarSkeleton = () => (
    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-pink-100 shadow-sm animate-pulse">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-lg">
                <div className="h-10 w-full bg-gray-200 rounded-xl"></div>
            </div>
            <div className="flex items-center gap-3">
                <div className="h-10 w-32 bg-gray-200 rounded-xl"></div>
                <div className="h-10 w-32 bg-gray-300 rounded-xl"></div>
            </div>
        </div>
    </div>
);

const AdminMatiere = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('recent');
    const [filterClasse, setFilterClasse] = useState('all');
    const [filterEnseignant, setFilterEnseignant] = useState('all');
    const [filterPeriode, setFilterPeriode] = useState('all');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [matiereToDelete, setMatiereToDelete] = useState(null);
    const [matiereToEdit, setMatiereToEdit] = useState(null);

    const { 
        matieres, 
        isLoading, 
        createMatiereAsync, 
        updateMatiereAsync, 
        deleteMatiereAsync,
        isCreating, 
        isUpdating, 
        isDeleting 
    } = useMatieres();

    const { classes, isLoading: isLoadingClasses } = useClasses();
    const { enseignants, isLoading: isLoadingEnseignants } = useEnseignants();
    const { periodes, isLoading: isLoadingPeriodes } = usePeriodes();

    // Extraire les options uniques pour les filtres
    const classesUniques = useMemo(() => {
        if (!matieres) return [];
        const uniqueClasses = [];
        const seen = new Set();
        
        matieres.forEach(matiere => {
            if (matiere.classe && !seen.has(matiere.classe.id)) {
                seen.add(matiere.classe.id);
                uniqueClasses.push(matiere.classe);
            }
        });
        
        return uniqueClasses.sort((a, b) => a.libelleCl?.localeCompare(b.libelleCl));
    }, [matieres]);

    const enseignantsUniques = useMemo(() => {
        if (!matieres) return [];
        const uniqueEnseignants = [];
        const seen = new Set();
        
        matieres.forEach(matiere => {
            if (matiere.enseignant && !seen.has(matiere.enseignant.id)) {
                seen.add(matiere.enseignant.id);
                uniqueEnseignants.push(matiere.enseignant);
            }
        });
        
        return uniqueEnseignants.sort((a, b) => a.nomEns?.localeCompare(b.nomEns));
    }, [matieres]);

    const periodesUniques = useMemo(() => {
        if (!matieres) return [];
        const uniquePeriodes = [];
        const seen = new Set();
        
        matieres.forEach(matiere => {
            if (matiere.periode && !seen.has(matiere.periode.id)) {
                seen.add(matiere.periode.id);
                uniquePeriodes.push(matiere.periode);
            }
        });
        
        return uniquePeriodes.sort((a, b) => new Date(b.debutPrd) - new Date(a.debutPrd));
    }, [matieres]);

    // Filtrer et trier les matières
    const filteredMatieres = useMemo(() => {
        let filtered = [...(matieres || [])];
        
        // Recherche
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(matiere => 
                matiere.libelleMat?.toLowerCase().includes(term) ||
                matiere.classe?.libelleCl?.toLowerCase().includes(term) ||
                matiere.enseignant?.nomEns?.toLowerCase().includes(term) ||
                matiere.enseignant?.prenomEns?.toLowerCase().includes(term) ||
                matiere.periode?.libellePrd?.toLowerCase().includes(term)
            );
        }
        
        // Filtre par classe
        if (filterClasse !== 'all') {
            filtered = filtered.filter(matiere => 
                matiere.classe?.id?.toString() === filterClasse
            );
        }
        
        // Filtre par enseignant
        if (filterEnseignant !== 'all') {
            filtered = filtered.filter(matiere => 
                matiere.enseignant?.id?.toString() === filterEnseignant
            );
        }
        
        // Filtre par période
        if (filterPeriode !== 'all') {
            filtered = filtered.filter(matiere => 
                matiere.periode?.id?.toString() === filterPeriode
            );
        }
        
        // Tri
        switch(sortBy) {
            case 'libelle-asc':
                filtered.sort((a, b) => a.libelleMat?.localeCompare(b.libelleMat));
                break;
            case 'libelle-desc':
                filtered.sort((a, b) => b.libelleMat?.localeCompare(a.libelleMat));
                break;
            case 'classe-asc':
                filtered.sort((a, b) => a.classe?.libelleCl?.localeCompare(b.classe?.libelleCl));
                break;
            case 'classe-desc':
                filtered.sort((a, b) => b.classe?.libelleCl?.localeCompare(a.classe?.libelleCl));
                break;
            case 'credit-asc':
                filtered.sort((a, b) => a.creditMat - b.creditMat);
                break;
            case 'credit-desc':
                filtered.sort((a, b) => b.creditMat - a.creditMat);
                break;
            case 'recent':
                filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                break;
            case 'ancien':
                filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
                break;
            default:
                break;
        }
        
        return filtered;
    }, [matieres, searchTerm, filterClasse, filterEnseignant, filterPeriode, sortBy]);

    // Gestion de l'ajout/modification
    const handleSubmitMatiere = async (formData, id = null) => {
        try {
            if (id) {
                // Modification
                await updateMatiereAsync({ id, matiereData: formData });
                setMatiereToEdit(null);
            } else {
                // Ajout
                await createMatiereAsync(formData);
            }
            setIsFormModalOpen(false);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    // Gestion de la suppression
    const handleDeleteMatiere = async () => {
        if (matiereToDelete) {
            await deleteMatiereAsync(matiereToDelete.id);
            setIsDeleteModalOpen(false);
            setMatiereToDelete(null);
        }
    };

    const openDeleteModal = (matiere) => {
        setMatiereToDelete(matiere);
        setIsDeleteModalOpen(true);
    };

    const openEditModal = (matiere) => {
        setMatiereToEdit(matiere);
        setIsFormModalOpen(true);
    };

    // Fonction pour formater les dates
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Formater la date avec heure
    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Obtenir le label du tri sélectionné
    const getSortLabel = (value) => {
        const sortLabels = {
            'recent': 'Plus récentes',
            'ancien': 'Plus anciennes',
            'libelle-asc': 'A → Z',
            'libelle-desc': 'Z → A',
            'classe-asc': 'Classe A → Z',
            'classe-desc': 'Classe Z → A',
            'credit-asc': 'Crédits ↑',
            'credit-desc': 'Crédits ↓'
        };
        return sortLabels[value] || 'Trier par';
    };

    // Réinitialiser les filtres
    const resetFilters = () => {
        setSearchTerm('');
        setFilterClasse('all');
        setFilterEnseignant('all');
        setFilterPeriode('all');
    };

    // Vérifier si des filtres sont actifs
    const hasActiveFilters = searchTerm || filterClasse !== 'all' || filterEnseignant !== 'all' || filterPeriode !== 'all';

    // Calculer les statistiques
    const stats = useMemo(() => {
        if (!matieres) return { 
            total: 0, 
            totalCredits: 0,
            classesCount: 0,
            enseignantsCount: 0,
            recentCount: 0
        };
        
        const parClasse = new Set();
        const parEnseignant = new Set();
        let totalCredits = 0;
        const now = new Date();
        const last30Days = new Date();
        last30Days.setDate(now.getDate() - 30);
        let recentCount = 0;
        
        matieres.forEach(matiere => {
            // Total crédits
            totalCredits += parseInt(matiere.creditMat) || 0;
            
            // Statistiques par classe
            if (matiere.classe) {
                parClasse.add(matiere.classe.id);
            }
            
            // Statistiques par enseignant
            if (matiere.enseignant) {
                parEnseignant.add(matiere.enseignant.id);
            }
            
            // Matières récentes (30 derniers jours)
            if (matiere.created_at) {
                const createdDate = new Date(matiere.created_at);
                if (createdDate >= last30Days) {
                    recentCount++;
                }
            }
        });
        
        return {
            total: matieres.length,
            totalCredits: totalCredits,
            classesCount: parClasse.size,
            enseignantsCount: parEnseignant.size,
            recentCount
        };
    }, [matieres]);

    const isLoadingAll = isLoading || isLoadingClasses || isLoadingEnseignants || isLoadingPeriodes;

    return (
        <>
            <div className="space-y-6">
                <PageHeader 
                    title="Matières"
                    subtitle="Gérer les matières enseignées dans votre établissement"
                />

                {/* Barre de contrôle avec skeleton */}
                {isLoadingAll ? (
                    <SearchBarSkeleton />
                ) : (
                    <div className="space-y-4">
                        {/* Barre de recherche et filtres */}
                        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-pink-100 shadow-sm">
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                {/* Recherche avec compteur */}
                                <div className="relative flex-1 max-w-lg">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher par libellé, classe, enseignant..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors"
                                    />
                                    {searchTerm && (
                                        <button
                                            onClick={() => setSearchTerm('')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Bouton ajouter */}
                                <button
                                    onClick={() => {
                                        setMatiereToEdit(null);
                                        setIsFormModalOpen(true);
                                    }}
                                    disabled={classes?.length === 0 || enseignants?.length === 0 || periodes?.length === 0}
                                    className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2.5 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-pink-200/50 disabled:from-pink-300 disabled:to-rose-400 disabled:cursor-not-allowed"
                                    title={
                                        classes?.length === 0 ? "Créez d'abord une classe" :
                                        enseignants?.length === 0 ? "Créez d'abord un enseignant" :
                                        periodes?.length === 0 ? "Créez d'abord une période" :
                                        "Ajouter une matière"
                                    }
                                >
                                    <Plus className="h-4 w-4" />
                                    <span className="font-medium">Nouvelle</span>
                                </button>
                            </div>

                            {/* Filtres supplémentaires */}
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {/* Filtre par classe */}
                                <div className="relative">
                                    <select
                                        value={filterClasse}
                                        onChange={(e) => setFilterClasse(e.target.value)}
                                        className="appearance-none pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors bg-white w-full"
                                    >
                                        <option value="all">Toutes les classes</option>
                                        {classesUniques.map((classe) => (
                                            <option key={classe.id} value={classe.id}>
                                                {classe.libelleCl}
                                            </option>
                                        ))}
                                    </select>
                                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>

                                {/* Filtre par enseignant */}
                                <div className="relative">
                                    <select
                                        value={filterEnseignant}
                                        onChange={(e) => setFilterEnseignant(e.target.value)}
                                        className="appearance-none pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors bg-white w-full"
                                    >
                                        <option value="all">Tous les enseignants</option>
                                        {enseignantsUniques.map((enseignant) => (
                                            <option key={enseignant.id} value={enseignant.id}>
                                                {enseignant.prenomEns} {enseignant.nomEns}
                                            </option>
                                        ))}
                                    </select>
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>

                                {/* Filtre par période */}
                                <div className="relative">
                                    <select
                                        value={filterPeriode}
                                        onChange={(e) => setFilterPeriode(e.target.value)}
                                        className="appearance-none pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors bg-white w-full"
                                    >
                                        <option value="all">Toutes les périodes</option>
                                        {periodesUniques.map((periode) => (
                                            <option key={periode.id} value={periode.id}>
                                                {periode.libellePrd}
                                            </option>
                                        ))}
                                    </select>
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Indicateurs de filtres actifs et compteur */}
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                {/* Compteur de résultats */}
                                <div className="text-sm text-pink-600">
                                    {hasActiveFilters ? (
                                        <span>
                                            {filteredMatieres.length} résultat{filteredMatieres.length !== 1 ? 's' : ''} {' '}
                                            sur {matieres?.length || 0} matière{matieres?.length !== 1 ? 's' : ''}
                                        </span>
                                    ) : (
                                        <span>
                                            {matieres?.length || 0} matière{matieres?.length !== 1 ? 's' : ''}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Indicateur de tri */}
                        <div className="flex items-center justify-between px-2">
                            <div className="text-sm text-gray-600">
                                Tri: <span className="font-medium text-pink-600">{getSortLabel(sortBy)}</span>
                            </div>
                            {/* Tri */}
                            <div className="relative">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none pl-4 pr-10 py-2 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors bg-white text-sm"
                                >
                                    <option value="recent">Plus récentes</option>
                                    <option value="ancien">Plus anciennes</option>
                                    <option value="libelle-asc">A → Z</option>
                                    <option value="libelle-desc">Z → A</option>
                                    <option value="classe-asc">Classe A → Z</option>
                                    <option value="classe-desc">Classe Z → A</option>
                                    <option value="credit-asc">Crédits ↑</option>
                                    <option value="credit-desc">Crédits ↓</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Statistiques avec skeletons */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {isLoadingAll ? (
                        <>
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                        </>
                    ) : (
                        <>
                            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-4 border border-pink-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Total matières</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-pink-100">
                                        <BookOpen className="h-6 w-6 text-pink-500" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Crédits totaux</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.totalCredits}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-blue-100">
                                        <Hash className="h-6 w-6 text-blue-500" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Classes</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.classesCount}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-green-100">
                                        <GraduationCap className="h-6 w-6 text-green-500" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Ce mois</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.recentCount}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-purple-100">
                                        <Clock className="h-6 w-6 text-purple-500" />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Liste des matières avec skeletons */}
                <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
                    {isLoadingAll ? (
                        <>
                            {/* En-tête du tableau pendant le chargement */}
                            <div className="bg-pink-50 p-4">
                                <div className="flex space-x-4">
                                    <div className="h-4 w-1/6 bg-gray-300 rounded animate-pulse"></div>
                                    <div className="h-4 w-1/6 bg-gray-300 rounded animate-pulse"></div>
                                    <div className="h-4 w-1/6 bg-gray-300 rounded animate-pulse"></div>
                                    <div className="h-4 w-1/6 bg-gray-300 rounded animate-pulse"></div>
                                    <div className="h-4 w-1/6 bg-gray-300 rounded animate-pulse"></div>
                                    <div className="h-4 w-1/6 bg-gray-300 rounded animate-pulse"></div>
                                </div>
                            </div>
                            
                            {/* Lignes skeletons */}
                            <table className="w-full">
                                <tbody className="divide-y divide-gray-100">
                                    {[1, 2, 3, 4, 5].map((item) => (
                                        <TableRowSkeleton key={item} />
                                    ))}
                                </tbody>
                            </table>
                        </>
                    ) : filteredMatieres.length === 0 ? (
                        <div className="p-8 text-center">
                            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">
                                {hasActiveFilters 
                                    ? 'Aucune matière ne correspond à votre recherche' 
                                    : 'Aucune matière enregistrée'
                                }
                            </p>
                            {hasActiveFilters ? (
                                <button
                                    onClick={resetFilters}
                                    className="mt-3 text-pink-500 hover:text-pink-600 font-medium"
                                >
                                    Réinitialiser les filtres
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsFormModalOpen(true)}
                                    className="mt-3 text-pink-500 hover:text-pink-600 font-medium"
                                >
                                    Ajouter la première matière
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* En-tête avec compteur */}
                            <div className="px-6 py-4 bg-pink-50 border-b border-pink-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="font-medium text-gray-700">
                                            Liste des matières
                                        </span>
                                        <span className="ml-2 text-sm text-gray-500">
                                            ({filteredMatieres.length} résultat{filteredMatieres.length !== 1 ? 's' : ''})
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Tri: <span className="font-medium">{getSortLabel(sortBy)}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Tableau */}
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-pink-50">
                                        <tr>
                                            <th className="text-left p-4 font-medium text-gray-700">Matière</th>
                                            <th className="text-left p-4 font-medium text-gray-700">Classe</th>
                                            <th className="text-left p-4 font-medium text-gray-700">Enseignant</th>
                                            <th className="text-left p-4 font-medium text-gray-700">Crédits</th>
                                            <th className="text-left p-4 font-medium text-gray-700">Créée le</th>
                                            <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredMatieres.map((matiere) => (
                                            <tr key={matiere.id} className="hover:bg-pink-50/50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                                                            <BookOpen className="h-5 w-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{matiere.libelleMat}</p>
                                                            <p className="text-sm text-gray-500">
                                                                {matiere.periode?.libellePrd}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {matiere.classe ? (
                                                        <div>
                                                            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                                                                {matiere.classe.libelleCl}
                                                            </span>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {matiere.classe.niveauCl}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">Non assignée</span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    {matiere.enseignant ? (
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center overflow-hidden">
                                                                {matiere.enseignant.photo ? (
                                                                    <img 
                                                                        src={matiere.enseignant.photo} 
                                                                        alt={matiere.enseignant.nomEns}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <User className="h-4 w-4 text-white" />
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-gray-900">
                                                                    {matiere.enseignant.prenomEns} {matiere.enseignant.nomEns}
                                                                </p>
                                                                <p className="text-xs text-gray-500">{matiere.enseignant.email}</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">Non assigné</span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <span className="inline-block px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-sm font-medium">
                                                        {matiere.creditMat} crédit{matiere.creditMat !== 1 ? 's' : ''}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="space-y-1">
                                                        <p className="text-sm text-gray-600">
                                                            {formatDate(matiere.created_at)}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {formatDateTime(matiere.created_at).split(' ')[1]}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => openEditModal(matiere)}
                                                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-600 transition-colors"
                                                            title="Modifier"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteModal(matiere)}
                                                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modals */}
            <MatiereModal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setMatiereToEdit(null);
                }}
                onSubmit={handleSubmitMatiere}
                isSubmitting={isCreating || isUpdating}
                matiere={matiereToEdit}
                classes={classes || []}
                enseignants={enseignants || []}
                periodes={periodes || []}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onConfirm={handleDeleteMatiere}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setMatiereToDelete(null);
                }}
                entityName="la matière"
                isDeleting={isDeleting}
            />
        </>
    );
};

export default AdminMatiere;