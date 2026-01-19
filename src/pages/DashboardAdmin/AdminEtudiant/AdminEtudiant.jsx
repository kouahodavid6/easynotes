import { useState, useMemo } from 'react';
import { 
    Search, 
    Plus, 
    User, 
    Mail, 
    Phone, 
    Calendar, 
    Edit, 
    Trash2, 
    ChevronDown, 
    GraduationCap,
    X,
    Users
} from 'lucide-react';
import PageHeader from '../../../components/PageHeader';
import { useEtudiants } from '../../../hooks/useEtudiants';
import { useClasses } from '../../../hooks/useClasses';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import EtudiantModal from "./components/EtudiantModal";

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
            <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
        </td>
        <td className="p-4">
            <div className="h-6 w-32 bg-gray-200 rounded-full"></div>
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

const AdminEtudiant = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('recent');
    const [filterClasse, setFilterClasse] = useState('all');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [etudiantToDelete, setEtudiantToDelete] = useState(null);
    const [etudiantToEdit, setEtudiantToEdit] = useState(null);

    const { 
        etudiants, 
        isLoading, 
        createEtudiantAsync, 
        updateEtudiantAsync, 
        deleteEtudiantAsync,
        isCreating, 
        isUpdating, 
        isDeleting 
    } = useEtudiants();

    const { classes, isLoading: isLoadingClasses } = useClasses();

    // Extraire les classes uniques pour le filtre
    const classesUniques = useMemo(() => {
        if (!etudiants) return [];
        const uniqueClasses = [];
        const seen = new Set();
        
        etudiants.forEach(etudiant => {
            if (etudiant.classe && !seen.has(etudiant.classe.id)) {
                seen.add(etudiant.classe.id);
                uniqueClasses.push(etudiant.classe);
            }
        });
        
        return uniqueClasses.sort((a, b) => a.libelleCl?.localeCompare(b.libelleCl));
    }, [etudiants]);

    // Filtrer et trier les étudiants
    const filteredEtudiants = useMemo(() => {
        let filtered = [...(etudiants || [])];
        
        // Recherche
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(etudiant => 
                etudiant.nomEtu?.toLowerCase().includes(term) ||
                etudiant.prenomEtu?.toLowerCase().includes(term) ||
                etudiant.matricule?.toLowerCase().includes(term) ||
                etudiant.email?.toLowerCase().includes(term) ||
                etudiant.classe?.libelleCl?.toLowerCase().includes(term) ||
                etudiant.classe?.niveauCl?.toLowerCase().includes(term)
            );
        }
        
        // Filtre par classe
        if (filterClasse !== 'all') {
            filtered = filtered.filter(etudiant => 
                etudiant.classe?.id?.toString() === filterClasse
            );
        }
        
        // Tri
        switch(sortBy) {
            case 'nom-asc':
                filtered.sort((a, b) => a.nomEtu?.localeCompare(b.nomEtu));
                break;
            case 'nom-desc':
                filtered.sort((a, b) => b.nomEtu?.localeCompare(a.nomEtu));
                break;
            case 'classe-asc':
                filtered.sort((a, b) => a.classe?.libelleCl?.localeCompare(b.classe?.libelleCl));
                break;
            case 'classe-desc':
                filtered.sort((a, b) => b.classe?.libelleCl?.localeCompare(a.classe?.libelleCl));
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
    }, [etudiants, searchTerm, filterClasse, sortBy]);

    // Gestion de l'ajout/modification
    const handleSubmitEtudiant = async (formData, id = null) => {
        try {
            if (id) {
                // Modification
                await updateEtudiantAsync({ id, etudiantData: formData });
                setEtudiantToEdit(null);
            } else {
                // Ajout
                await createEtudiantAsync(formData);
            }
            setIsFormModalOpen(false);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    // Gestion de la suppression
    const handleDeleteEtudiant = async () => {
        if (etudiantToDelete) {
            await deleteEtudiantAsync(etudiantToDelete.id);
            setIsDeleteModalOpen(false);
            setEtudiantToDelete(null);
        }
    };

    const openDeleteModal = (etudiant) => {
        setEtudiantToDelete(etudiant);
        setIsDeleteModalOpen(true);
    };

    const openEditModal = (etudiant) => {
        setEtudiantToEdit(etudiant);
        setIsFormModalOpen(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Obtenir le label du tri sélectionné
    const getSortLabel = (value) => {
        const sortLabels = {
            'recent': 'Plus récents',
            'ancien': 'Plus anciens',
            'nom-asc': 'A → Z',
            'nom-desc': 'Z → A',
            'classe-asc': 'Classe A → Z',
            'classe-desc': 'Classe Z → A'
        };
        return sortLabels[value] || 'Trier par';
    };

    // Réinitialiser les filtres
    const resetFilters = () => {
        setSearchTerm('');
        setFilterClasse('all');
    };

    // Vérifier si des filtres sont actifs
    const hasActiveFilters = searchTerm || filterClasse !== 'all';

    // Calculer les statistiques
    const stats = useMemo(() => {
        if (!etudiants) return { total: 0, parClasse: {}, parGenre: {} };
        
        const parClasse = {};
        const parGenre = {};
        
        etudiants.forEach(etudiant => {
            // Statistiques par classe
            if (etudiant.classe) {
                const classeKey = `${etudiant.classe.libelleCl}`;
                parClasse[classeKey] = (parClasse[classeKey] || 0) + 1;
            }
            
            // Statistiques par genre (vous pouvez adapter selon votre modèle)
            // Pour l'instant, on suppose que tous sont sans genre spécifié
            parGenre['total'] = (parGenre['total'] || 0) + 1;
        });
        
        return {
            total: etudiants.length,
            parClasse,
            parGenre
        };
    }, [etudiants]);

    return (
        <>
            <div className="space-y-6">
                <PageHeader 
                    title="Étudiants"
                    subtitle="Gérer les étudiants de votre établissement"
                />

                {/* Barre de contrôle avec skeleton */}
                {isLoading || isLoadingClasses ? (
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
                                        placeholder="Rechercher par nom, prénom, matricule, classe..."
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

                                {/* Filtres et actions */}
                                <div className="flex items-center gap-3">
                                    {/* Filtre par classe */}
                                    <div className="relative">
                                        <select
                                            value={filterClasse}
                                            onChange={(e) => setFilterClasse(e.target.value)}
                                            className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors bg-white min-w-[180px]"
                                        >
                                            <option value="all">Toutes les classes</option>
                                            {classesUniques.map((classe) => (
                                                <option key={classe.id} value={classe.id}>
                                                    {classe.libelleCl}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>

                                    {/* Tri */}
                                    <div className="relative">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors bg-white"
                                        >
                                            <option value="recent">Plus récents</option>
                                            <option value="ancien">Plus anciens</option>
                                            <option value="nom-asc">A → Z</option>
                                            <option value="nom-desc">Z → A</option>
                                            <option value="classe-asc">Classe A → Z</option>
                                            <option value="classe-desc">Classe Z → A</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>

                                    {/* Bouton ajouter */}
                                    <button
                                        onClick={() => {
                                            setEtudiantToEdit(null);
                                            setIsFormModalOpen(true);
                                        }}
                                        disabled={classes?.length === 0}
                                        className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2.5 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-pink-200/50 disabled:from-pink-300 disabled:to-rose-400 disabled:cursor-not-allowed"
                                        title={classes?.length === 0 ? "Créez d'abord une classe" : "Ajouter un étudiant"}
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span className="font-medium">Nouveau</span>
                                    </button>
                                </div>
                            </div>

                            {/* Indicateurs de filtres actifs et compteur */}
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                {/* Compteur de résultats */}
                                <div className="text-sm text-pink-600">
                                    {hasActiveFilters ? (
                                        <span>
                                            {filteredEtudiants.length} résultat{filteredEtudiants.length !== 1 ? 's' : ''} {' '}
                                            sur {etudiants?.length || 0} étudiant{etudiants?.length !== 1 ? 's' : ''}
                                        </span>
                                    ) : (
                                        <span>
                                            {etudiants?.length || 0} étudiant{etudiants?.length !== 1 ? 's' : ''}
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
                        </div>
                    </div>
                )}

                {/* Statistiques avec skeletons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {isLoading ? (
                        <>
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                            <StatCardSkeleton />
                        </>
                    ) : (
                        <>
                            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-4 border border-pink-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Total étudiants</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-pink-100">
                                        <Users className="h-6 w-6 text-pink-500" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Classes</p>
                                        <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.parClasse).length}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-blue-100">
                                        <GraduationCap className="h-6 w-6 text-blue-500" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Ce mois</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {etudiants?.filter(e => {
                                                const date = new Date(e.created_at);
                                                const now = new Date();
                                                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                                            }).length || 0}
                                        </p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-emerald-100">
                                        <Calendar className="h-6 w-6 text-emerald-500" />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Liste des étudiants avec skeletons */}
                <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
                    {isLoading ? (
                        <>
                            {/* En-tête du tableau pendant le chargement */}
                            <div className="bg-pink-50 p-4">
                                <div className="flex space-x-4">
                                    <div className="h-4 w-1/5 bg-gray-300 rounded animate-pulse"></div>
                                    <div className="h-4 w-1/5 bg-gray-300 rounded animate-pulse"></div>
                                    <div className="h-4 w-1/5 bg-gray-300 rounded animate-pulse"></div>
                                    <div className="h-4 w-1/5 bg-gray-300 rounded animate-pulse"></div>
                                    <div className="h-4 w-1/5 bg-gray-300 rounded animate-pulse"></div>
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
                    ) : filteredEtudiants.length === 0 ? (
                        <div className="p-8 text-center">
                            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">
                                {hasActiveFilters 
                                    ? 'Aucun étudiant ne correspond à votre recherche' 
                                    : 'Aucun étudiant enregistré'
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
                                    Ajouter le premier étudiant
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
                                            Liste des étudiants
                                        </span>
                                        <span className="ml-2 text-sm text-gray-500">
                                            ({filteredEtudiants.length} résultat{filteredEtudiants.length !== 1 ? 's' : ''})
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
                                            <th className="text-left p-4 font-medium text-gray-700">Étudiant</th>
                                            <th className="text-left p-4 font-medium text-gray-700">Contact</th>
                                            <th className="text-left p-4 font-medium text-gray-700">Matricule</th>
                                            <th className="text-left p-4 font-medium text-gray-700">Classe</th>
                                            <th className="text-left p-4 font-medium text-gray-700">Date</th>
                                            <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredEtudiants.map((etudiant) => (
                                            <tr key={etudiant.id} className="hover:bg-pink-50/50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center overflow-hidden">
                                                            {etudiant.photo ? (
                                                                <img 
                                                                    src={etudiant.photo} 
                                                                    alt={etudiant.nomEtu}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <User className="h-5 w-5 text-white" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {etudiant.prenomEtu} {etudiant.nomEtu}
                                                            </p>
                                                            <p className="text-sm text-gray-500">Étudiant</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="h-3 w-3 text-gray-400" />
                                                            <span className="text-sm text-gray-600">{etudiant.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="h-3 w-3 text-gray-400" />
                                                            <span className="text-sm text-gray-600">{etudiant.telEtu}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="inline-block px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-sm font-medium">
                                                        {etudiant.matricule}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    {etudiant.classe ? (
                                                        <div>
                                                            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                                                                {etudiant.classe.libelleCl}
                                                            </span>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {etudiant.classe.niveauCl}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">Non assigné</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-sm text-gray-600">
                                                    {formatDate(etudiant.created_at)}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => openEditModal(etudiant)}
                                                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-600 transition-colors"
                                                            title="Modifier"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteModal(etudiant)}
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
            <EtudiantModal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setEtudiantToEdit(null);
                }}
                onSubmit={handleSubmitEtudiant}
                isSubmitting={isCreating || isUpdating}
                etudiant={etudiantToEdit}
                classes={classes || []}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onConfirm={handleDeleteEtudiant}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setEtudiantToDelete(null);
                }}
                entityName="l'étudiant"
                isDeleting={isDeleting}
            />
        </>
    );
};

export default AdminEtudiant;