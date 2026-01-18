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
    UserCheck
} from 'lucide-react';
import PageHeader from '../../../components/PageHeader';
import { useEnseignants } from '../../../hooks/useEnseignants'
import DeleteConfirmModal from '../../components/DeleteConfirmModal'
import EnseignantModal from "./components/EnseignantModal";

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

const AdminEnseignant = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('recent');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [enseignantToDelete, setEnseignantToDelete] = useState(null);
    const [enseignantToEdit, setEnseignantToEdit] = useState(null);

    const { 
        enseignants, 
        isLoading, 
        createEnseignantAsync, 
        updateEnseignantAsync, 
        deleteEnseignantAsync,
        isCreating, 
        isUpdating, 
        isDeleting 
    } = useEnseignants();

    // Filtrer et trier les enseignants
    const filteredEnseignants = useMemo(() => {
        let filtered = [...(enseignants || [])];
        
        // Recherche
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(enseignant => 
                enseignant.nomEns?.toLowerCase().includes(term) ||
                enseignant.prenomEns?.toLowerCase().includes(term) ||
                enseignant.matricule?.toLowerCase().includes(term) ||
                enseignant.email?.toLowerCase().includes(term)
            );
        }
        
        // Tri
        switch(sortBy) {
            case 'nom-asc':
                filtered.sort((a, b) => a.nomEns?.localeCompare(b.nomEns));
                break;
            case 'nom-desc':
                filtered.sort((a, b) => b.nomEns?.localeCompare(a.nomEns));
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
    }, [enseignants, searchTerm, sortBy]);

    // Gestion de l'ajout/modification
    const handleSubmitEnseignant = async (formData, id = null) => {
        try {
            if (id) {
                // Modification
                await updateEnseignantAsync({ id, enseignantData: formData });
                setEnseignantToEdit(null);
            } else {
                // Ajout
                await createEnseignantAsync(formData);
            }
            setIsFormModalOpen(false);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    // Gestion de la suppression
    const handleDeleteEnseignant = async () => {
        if (enseignantToDelete) {
            await deleteEnseignantAsync(enseignantToDelete.id);
            setIsDeleteModalOpen(false);
            setEnseignantToDelete(null);
        }
    };

    const openDeleteModal = (enseignant) => {
        setEnseignantToDelete(enseignant);
        setIsDeleteModalOpen(true);
    };

    const openEditModal = (enseignant) => {
        setEnseignantToEdit(enseignant);
        setIsFormModalOpen(true);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    return (
        <>
            <div className="space-y-6">
                <PageHeader 
                    title="Enseignants"
                    subtitle="Gérer les enseignants intervenants dans votre établissement"
                />

                {/* Barre de contrôle avec skeleton */}
                {isLoading ? (
                    <SearchBarSkeleton />
                ) : (
                    <div className="bg-white rounded-2xl p-4 sm:p-6 border border-pink-100 shadow-sm">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            {/* Recherche */}
                            <div className="relative flex-1 max-w-lg">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom, prénom, matricule..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors"
                                />
                            </div>

                            {/* Filtres et actions */}
                            <div className="flex items-center gap-3">
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
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>

                                {/* Bouton ajouter */}
                                <button
                                    onClick={() => {
                                        setEnseignantToEdit(null);
                                        setIsFormModalOpen(true);
                                    }}
                                    className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2.5 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-pink-200/50"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span className="font-medium">Nouveau</span>
                                </button>
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
                                        <p className="text-gray-500 text-sm">Total enseignants</p>
                                        <p className="text-2xl font-bold text-gray-900">{enseignants?.length || 0}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-pink-100">
                                        <User className="h-6 w-6 text-pink-500" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Ce mois</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {enseignants?.filter(e => {
                                                const date = new Date(e.created_at);
                                                const now = new Date();
                                                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                                            }).length || 0}
                                        </p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-blue-100">
                                        <Calendar className="h-6 w-6 text-blue-500" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Actifs</p>
                                        <p className="text-2xl font-bold text-gray-900">{enseignants?.length || 0}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-emerald-100">
                                        <UserCheck className="h-6 w-6 text-emerald-500" />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Liste des enseignants avec skeletons */}
                <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
                    {isLoading ? (
                        <>
                            {/* En-tête du tableau pendant le chargement */}
                            <div className="bg-pink-50 p-4">
                                <div className="flex space-x-4">
                                    <div className="h-4 w-1/4 bg-gray-300 rounded animate-pulse"></div>
                                    <div className="h-4 w-1/4 bg-gray-300 rounded animate-pulse"></div>
                                    <div className="h-4 w-1/4 bg-gray-300 rounded animate-pulse"></div>
                                    <div className="h-4 w-1/4 bg-gray-300 rounded animate-pulse"></div>
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
                    ) : filteredEnseignants.length === 0 ? (
                        <div className="p-8 text-center">
                            <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">
                                {searchTerm ? 'Aucun enseignant trouvé' : 'Aucun enseignant enregistré'}
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={() => setIsFormModalOpen(true)}
                                    className="mt-3 text-pink-500 hover:text-pink-600 font-medium"
                                >
                                    Ajouter le premier enseignant
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-pink-50">
                                    <tr>
                                        <th className="text-left p-4 font-medium text-gray-700">Enseignant</th>
                                        <th className="text-left p-4 font-medium text-gray-700">Contact</th>
                                        <th className="text-left p-4 font-medium text-gray-700">Matricule</th>
                                        <th className="text-left p-4 font-medium text-gray-700">Date</th>
                                        <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredEnseignants.map((enseignant) => (
                                        <tr key={enseignant.id} className="hover:bg-pink-50/50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center overflow-hidden">
                                                        {enseignant.photo ? (
                                                            <img 
                                                                src={enseignant.photo} 
                                                                alt={enseignant.nomEns}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <User className="h-5 w-5 text-white" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {enseignant.prenomEns} {enseignant.nomEns}
                                                        </p>
                                                        <p className="text-sm text-gray-500">Enseignant</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="h-3 w-3 text-gray-400" />
                                                        <span className="text-sm text-gray-600">{enseignant.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-3 w-3 text-gray-400" />
                                                        <span className="text-sm text-gray-600">{enseignant.telEns}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-block px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-sm font-medium">
                                                    {enseignant.matricule}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">
                                                {formatDate(enseignant.created_at)}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(enseignant)}
                                                        className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-600 transition-colors"
                                                        title="Modifier"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(enseignant)}
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
                    )}
                </div>
            </div>

            {/* Modals */}
            <EnseignantModal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setEnseignantToEdit(null);
                }}
                onSubmit={handleSubmitEnseignant}
                isSubmitting={isCreating || isUpdating}
                enseignant={enseignantToEdit}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onConfirm={handleDeleteEnseignant}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setEnseignantToDelete(null);
                }}
                entityName="l'enseignant"
                isDeleting={isDeleting}
            />
        </>
    );
};

export default AdminEnseignant;