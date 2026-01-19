import { useState, useMemo } from 'react';
import { 
    Search, Plus, BookOpen, GraduationCap, Calendar, 
    Edit, Trash2, ChevronDown, Filter, X
} from 'lucide-react';
import PageHeader from '../../../components/PageHeader';
import { useClasses } from '../../../hooks/useClasses';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import ClasseModal from "./components/ClasseModal";

// Composants Skeletons
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
            <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
        </td>
        <td className="p-4">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
        </td>
        <td className="p-4">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </td>
        <td className="p-4">
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
            </div>
        </td>
    </tr>
);

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

const AdminClasse = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('recent');
    const [filterNiveau, setFilterNiveau] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [classeToDelete, setClasseToDelete] = useState(null);
    const [classeToEdit, setClasseToEdit] = useState(null);

    const { 
        classes, 
        isLoading, 
        createClasseAsync, 
        updateClasseAsync, 
        deleteClasseAsync,
        isCreating, 
        isUpdating, 
        isDeleting 
    } = useClasses();

    // Extraire les niveaux uniques pour le filtre
    const niveauxUniques = useMemo(() => {
        if (!classes) return [];
        const niveaux = [...new Set(classes.map(c => c.niveauCl).filter(Boolean))];
        return niveaux.sort();
    }, [classes]);

    // Filtrer, trier et rechercher les classes
    const filteredClasses = useMemo(() => {
        let filtered = [...(classes || [])];
        
        // Recherche
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(classe => 
                classe.libelleCl?.toLowerCase().includes(term) ||
                classe.niveauCl?.toLowerCase().includes(term)
            );
        }
        
        // Filtre par niveau
        if (filterNiveau !== 'all') {
            filtered = filtered.filter(classe => classe.niveauCl === filterNiveau);
        }
        
        // Tri
        switch(sortBy) {
            case 'libelle-asc':
                filtered.sort((a, b) => a.libelleCl?.localeCompare(b.libelleCl));
                break;
            case 'libelle-desc':
                filtered.sort((a, b) => b.libelleCl?.localeCompare(a.libelleCl));
                break;
            case 'niveau-asc':
                filtered.sort((a, b) => a.niveauCl?.localeCompare(b.niveauCl));
                break;
            case 'niveau-desc':
                filtered.sort((a, b) => b.niveauCl?.localeCompare(a.niveauCl));
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
    }, [classes, searchTerm, filterNiveau, sortBy]);

    // Gestion de l'ajout/modification
    const handleSubmitClasse = async (formData, id = null) => {
        try {
            if (id) {
                // Modification
                await updateClasseAsync({ id, classeData: formData });
                setClasseToEdit(null);
            } else {
                // Ajout
                await createClasseAsync(formData);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    // Gestion de la suppression
    const handleDeleteClasse = async () => {
        if (classeToDelete) {
            await deleteClasseAsync(classeToDelete.id);
            setIsDeleteModalOpen(false);
            setClasseToDelete(null);
        }
    };

    const openDeleteModal = (classe) => {
        setClasseToDelete(classe);
        setIsDeleteModalOpen(true);
    };

    const openEditModal = (classe) => {
        setClasseToEdit(classe);
        setIsModalOpen(true);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Calculer les statistiques
    const stats = useMemo(() => {
        if (!classes) return { total: 0, parNiveau: {} };
        
        const parNiveau = {};
        classes.forEach(classe => {
            if (classe.niveauCl) {
                parNiveau[classe.niveauCl] = (parNiveau[classe.niveauCl] || 0) + 1;
            }
        });
        
        return {
            total: classes.length,
            parNiveau
        };
    }, [classes]);

    // Obtenir le label du tri sélectionné
    const getSortLabel = (value) => {
        const sortLabels = {
            'recent': 'Plus récentes',
            'ancien': 'Plus anciennes',
            'libelle-asc': 'A → Z',
            'libelle-desc': 'Z → A',
            'niveau-asc': 'Niveau ↑',
            'niveau-desc': 'Niveau ↓'
        };
        return sortLabels[value] || 'Trier par';
    };

    // Réinitialiser les filtres
    const resetFilters = () => {
        setSearchTerm('');
        setFilterNiveau('all');
    };

    // Vérifier si des filtres sont actifs
    const hasActiveFilters = searchTerm || filterNiveau !== 'all';

    return (
        <>
            <div className="space-y-6">
                <PageHeader 
                    title="Classes"
                    subtitle="Gérer les classes de votre établissement"
                />

                {/* Barre de contrôle avec skeleton */}
                {isLoading ? (
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
                                        placeholder="Rechercher par libellé, niveau..."
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
                                    {/* Filtre par niveau */}
                                    <div className="relative">
                                        <select
                                            value={filterNiveau}
                                            onChange={(e) => setFilterNiveau(e.target.value)}
                                            className="appearance-none pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors bg-white"
                                        >
                                            <option value="all">Tous les niveaux</option>
                                            {niveauxUniques.map((niveau) => (
                                                <option key={niveau} value={niveau}>{niveau}</option>
                                            ))}
                                        </select>
                                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>

                                    {/* Tri */}
                                    <div className="relative">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors bg-white"
                                        >
                                            <option value="recent">Plus récentes</option>
                                            <option value="ancien">Plus anciennes</option>
                                            <option value="libelle-asc">A → Z</option>
                                            <option value="libelle-desc">Z → A</option>
                                            <option value="niveau-asc">Niveau ↑</option>
                                            <option value="niveau-desc">Niveau ↓</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>

                                    {/* Bouton ajouter */}
                                    <button
                                        onClick={() => {
                                            setClasseToEdit(null);
                                            setIsModalOpen(true);
                                        }}
                                        className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2.5 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-pink-200/50"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span className="font-medium">Nouvelle</span>
                                    </button>
                                </div>
                            </div>

                            {/* Indicateurs de filtres actifs et compteur */}
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                {/* Compteur de résultats */}
                                <div className="text-sm text-pink-600">
                                    {hasActiveFilters ? (
                                        <span>
                                            {filteredClasses.length} résultat{filteredClasses.length !== 1 ? 's' : ''} {' '}
                                            sur {classes?.length || 0} classe{classes?.length !== 1 ? 's' : ''}
                                        </span>
                                    ) : (
                                        <span>
                                            {classes?.length || 0} classe{classes?.length !== 1 ? 's' : ''}
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
                                        <p className="text-gray-500 text-sm">Total classes</p>
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
                                        <p className="text-gray-500 text-sm">Niveaux</p>
                                        <p className="text-2xl font-bold text-gray-900">{niveauxUniques.length}</p>
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
                                            {classes?.filter(c => {
                                                const date = new Date(c.created_at);
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

                {/* Liste des classes avec skeletons */}
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
                    ) : filteredClasses.length === 0 ? (
                        <div className="p-8 text-center">
                            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">
                                {hasActiveFilters 
                                    ? 'Aucune classe ne correspond à votre recherche' 
                                    : 'Aucune classe enregistrée'
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
                                    onClick={() => setIsModalOpen(true)}
                                    className="mt-3 text-pink-500 hover:text-pink-600 font-medium"
                                >
                                    Ajouter la première classe
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
                                            Liste des classes
                                        </span>
                                        <span className="ml-2 text-sm text-gray-500">
                                            ({filteredClasses.length} résultat{filteredClasses.length !== 1 ? 's' : ''})
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
                                            <th className="text-left p-4 font-medium text-gray-700">Classe</th>
                                            <th className="text-left p-4 font-medium text-gray-700">Niveau</th>
                                            <th className="text-left p-4 font-medium text-gray-700">Date création</th>
                                            <th className="text-left p-4 font-medium text-gray-700">Dernière mise à jour</th>
                                            <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredClasses.map((classe) => (
                                            <tr key={classe.id} className="hover:bg-pink-50/50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                                                            <BookOpen className="h-5 w-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">{classe.libelleCl}</p>
                                                            <p className="text-sm text-gray-500">Classe</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                                                        {classe.niveauCl}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-gray-600">
                                                    {formatDate(classe.created_at)}
                                                </td>
                                                <td className="p-4 text-sm text-gray-600">
                                                    {formatDate(classe.updated_at)}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => openEditModal(classe)}
                                                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-600 transition-colors"
                                                            title="Modifier"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteModal(classe)}
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
            <ClasseModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setClasseToEdit(null);
                }}
                onSubmit={handleSubmitClasse}
                isSubmitting={isCreating || isUpdating}
                classe={classeToEdit}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onConfirm={handleDeleteClasse}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setClasseToDelete(null);
                }}
                entityName="la classe"
                isDeleting={isDeleting}
            />
        </>
    );
};

export default AdminClasse;