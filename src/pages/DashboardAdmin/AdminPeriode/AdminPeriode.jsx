import { useState, useMemo } from 'react';
import { 
    Search, 
    Plus, 
    Calendar, 
    Clock, 
    CalendarDays,
    Edit, 
    Trash2, 
    ChevronDown, 
    X,
    Filter
} from 'lucide-react';
import PageHeader from "../../../components/PageHeader";
import { usePeriodes } from '../../../hooks/usePeriodes';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import PeriodeModal from './components/PeriodeModal';

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
                </div>
            </div>
        </td>
        <td className="p-4">
            <div className="space-y-2">
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                <div className="h-3 w-20 bg-gray-200 rounded"></div>
            </div>
        </td>
        <td className="p-4">
            <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
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

const AdminPeriode = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('recent');
    const [filterStatus, setFilterStatus] = useState('all'); // all, active, upcoming, past
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [periodeToDelete, setPeriodeToDelete] = useState(null);
    const [periodeToEdit, setPeriodeToEdit] = useState(null);

    const { 
        periodes, 
        isLoading, 
        createPeriodeAsync, 
        updatePeriodeAsync, 
        deletePeriodeAsync,
        isCreating, 
        isUpdating, 
        isDeleting 
    } = usePeriodes();

    // Filtrer et trier les périodes
    const filteredPeriodes = useMemo(() => {
        let filtered = [...(periodes || [])];
        
        // Recherche
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(periode => 
                periode.libellePrd?.toLowerCase().includes(term)
            );
        }
        
        // Filtre par statut
        const now = new Date();
        if (filterStatus !== 'all') {
            filtered = filtered.filter(periode => {
                const debut = new Date(periode.debutPrd);
                const fin = new Date(periode.finPrd);
                
                switch(filterStatus) {
                    case 'active':
                        return debut <= now && fin >= now;
                    case 'upcoming':
                        return debut > now;
                    case 'past':
                        return fin < now;
                    default:
                        return true;
                }
            });
        }
        
        // Tri
        switch(sortBy) {
            case 'libelle-asc':
                filtered.sort((a, b) => a.libellePrd?.localeCompare(b.libellePrd));
                break;
            case 'libelle-desc':
                filtered.sort((a, b) => b.libellePrd?.localeCompare(a.libellePrd));
                break;
            case 'debut-asc':
                filtered.sort((a, b) => new Date(a.debutPrd) - new Date(b.debutPrd));
                break;
            case 'debut-desc':
                filtered.sort((a, b) => new Date(b.debutPrd) - new Date(a.debutPrd));
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
    }, [periodes, searchTerm, filterStatus, sortBy]);

    // Gestion de l'ajout/modification
    const handleSubmitPeriode = async (formData, id = null) => {
        try {
            if (id) {
                // Modification
                await updatePeriodeAsync({ id, periodeData: formData });
                setPeriodeToEdit(null);
            } else {
                // Ajout
                await createPeriodeAsync(formData);
            }
            setIsFormModalOpen(false);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    // Gestion de la suppression
    const handleDeletePeriode = async () => {
        if (periodeToDelete) {
            await deletePeriodeAsync(periodeToDelete.id);
            setIsDeleteModalOpen(false);
            setPeriodeToDelete(null);
        }
    };

    const openDeleteModal = (periode) => {
        setPeriodeToDelete(periode);
        setIsDeleteModalOpen(true);
    };

    const openEditModal = (periode) => {
        setPeriodeToEdit(periode);
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

    // Obtenir le statut d'une période
    const getPeriodeStatus = (debutPrd, finPrd) => {
        const now = new Date();
        const debut = new Date(debutPrd);
        const fin = new Date(finPrd);
        
        if (debut > now) {
            return { label: 'À venir', color: 'bg-blue-100 text-blue-700' };
        } else if (debut <= now && fin >= now) {
            return { label: 'En cours', color: 'bg-green-100 text-green-700' };
        } else {
            return { label: 'Terminée', color: 'bg-gray-100 text-gray-700' };
        }
    };

    // Calculer la durée en jours
    const calculateDuration = (debutPrd, finPrd) => {
        const debut = new Date(debutPrd);
        const fin = new Date(finPrd);
        const diffTime = Math.abs(fin - debut);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Obtenir le label du tri sélectionné
    const getSortLabel = (value) => {
        const sortLabels = {
            'recent': 'Plus récentes',
            'ancien': 'Plus anciennes',
            'libelle-asc': 'A → Z',
            'libelle-desc': 'Z → A',
            'debut-asc': 'Début ↑',
            'debut-desc': 'Début ↓'
        };
        return sortLabels[value] || 'Trier par';
    };

    // Réinitialiser les filtres
    const resetFilters = () => {
        setSearchTerm('');
        setFilterStatus('all');
    };

    // Vérifier si des filtres sont actifs
    const hasActiveFilters = searchTerm || filterStatus !== 'all';

    // Calculer les statistiques
    const stats = useMemo(() => {
        if (!periodes) return { 
            total: 0, 
            active: 0, 
            upcoming: 0, 
            past: 0 
        };
        
        const now = new Date();
        let active = 0;
        let upcoming = 0;
        let past = 0;
        
        periodes.forEach(periode => {
            const debut = new Date(periode.debutPrd);
            const fin = new Date(periode.finPrd);
            
            if (debut > now) {
                upcoming++;
            } else if (debut <= now && fin >= now) {
                active++;
            } else {
                past++;
            }
        });
        
        return {
            total: periodes.length,
            active,
            upcoming,
            past
        };
    }, [periodes]);

    return (
        <>
            <div className="space-y-6">
                <PageHeader 
                    title="Périodes"
                    subtitle="Gérer les périodes académiques de votre établissement"
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
                                        placeholder="Rechercher par libellé..."
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
                                    {/* Filtre par statut */}
                                    <div className="relative">
                                        <select
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                            className="appearance-none pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors bg-white min-w-[160px]"
                                        >
                                            <option value="all">Tous les statuts</option>
                                            <option value="active">En cours</option>
                                            <option value="upcoming">À venir</option>
                                            <option value="past">Terminées</option>
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
                                            <option value="debut-asc">Début ↑</option>
                                            <option value="debut-desc">Début ↓</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>

                                    {/* Bouton ajouter */}
                                    <button
                                        onClick={() => {
                                            setPeriodeToEdit(null);
                                            setIsFormModalOpen(true);
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
                                            {filteredPeriodes.length} résultat{filteredPeriodes.length !== 1 ? 's' : ''} {' '}
                                            sur {periodes?.length || 0} période{periodes?.length !== 1 ? 's' : ''}
                                        </span>
                                    ) : (
                                        <span>
                                            {periodes?.length || 0} période{periodes?.length !== 1 ? 's' : ''}
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
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {isLoading ? (
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
                                        <p className="text-gray-500 text-sm">Total périodes</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-pink-100">
                                        <Calendar className="h-6 w-6 text-pink-500" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">En cours</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-green-100">
                                        <Clock className="h-6 w-6 text-green-500" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">À venir</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.upcoming}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-blue-100">
                                        <CalendarDays className="h-6 w-6 text-blue-500" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-4 border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Terminées</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.past}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-gray-100">
                                        <Clock className="h-6 w-6 text-gray-500" />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Liste des périodes avec skeletons */}
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
                    ) : filteredPeriodes.length === 0 ? (
                        <div className="p-8 text-center">
                            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">
                                {hasActiveFilters 
                                    ? 'Aucune période ne correspond à votre recherche' 
                                    : 'Aucune période enregistrée'
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
                                    Ajouter la première période
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
                                            Liste des périodes
                                        </span>
                                        <span className="ml-2 text-sm text-gray-500">
                                            ({filteredPeriodes.length} résultat{filteredPeriodes.length !== 1 ? 's' : ''})
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
                                            <th className="text-left p-4 font-medium text-gray-700">Période</th>
                                            <th className="text-left p-4 font-medium text-gray-700">Dates</th>
                                            <th className="text-left p-4 font-medium text-gray-700">Statut</th>
                                            <th className="text-left p-4 font-medium text-gray-700">Créée le</th>
                                            <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredPeriodes.map((periode) => {
                                            const status = getPeriodeStatus(periode.debutPrd, periode.finPrd);
                                            const duration = calculateDuration(periode.debutPrd, periode.finPrd);
                                            
                                            return (
                                                <tr key={periode.id} className="hover:bg-pink-50/50 transition-colors">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                                                                <Calendar className="h-5 w-5 text-white" />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">{periode.libellePrd}</p>
                                                                <p className="text-sm text-gray-500">{duration} jour{duration !== 1 ? 's' : ''}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-3 w-3 text-gray-400" />
                                                                <span className="text-sm text-gray-600">
                                                                    Début: {formatDate(periode.debutPrd)}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-3 w-3 text-gray-400" />
                                                                <span className="text-sm text-gray-600">
                                                                    Fin: {formatDate(periode.finPrd)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                                                            {status.label}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-sm text-gray-600">
                                                        {formatDate(periode.created_at)}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => openEditModal(periode)}
                                                                className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-600 transition-colors"
                                                                title="Modifier"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => openDeleteModal(periode)}
                                                                className="p-2 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors"
                                                                title="Supprimer"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Modals */}
            <PeriodeModal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setPeriodeToEdit(null);
                }}
                onSubmit={handleSubmitPeriode}
                isSubmitting={isCreating || isUpdating}
                periode={periodeToEdit}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onConfirm={handleDeletePeriode}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setPeriodeToDelete(null);
                }}
                entityName="la période"
                isDeleting={isDeleting}
            />
        </>
    );
};

export default AdminPeriode;