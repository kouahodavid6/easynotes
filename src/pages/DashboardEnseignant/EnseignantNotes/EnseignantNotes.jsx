import { useState, useMemo } from 'react';
import { 
    Search, 
    Plus, 
    Star, 
    GraduationCap, 
    User, 
    BookOpen,
    Edit, 
    Trash2, 
    ChevronDown, 
    X,
    Clock,
    Hash,
    TrendingUp,
} from 'lucide-react';
import PageHeader from "../../../components/PageHeader";
import { useNotes } from '../../../hooks/useNotes';
import { useClasses } from '../../../hooks/useClasses';
import { useMatieres } from '../../../hooks/useMatieres';
import { useEtudiants } from '../../../hooks/useEtudiants';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import NoteModal from "./components/NoteModal";

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
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-300 rounded"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
            </div>
        </td>
        <td className="p-4">
            <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-300 rounded"></div>
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
        </td>
        <td className="p-4">
            <div className="space-y-2">
                <div className="h-4 w-40 bg-gray-300 rounded"></div>
                <div className="h-3 w-32 bg-gray-200 rounded"></div>
            </div>
        </td>
        <td className="p-4">
            <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
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

const EnseignantNotes = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('recent');
    const [filterClasse, setFilterClasse] = useState('all');
    const [filterMatiere, setFilterMatiere] = useState('all');
    const [filterEtudiant, setFilterEtudiant] = useState('all');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState(null);
    const [noteToEdit, setNoteToEdit] = useState(null);

    const { 
        notes, 
        isLoading, 
        createNoteAsync, 
        updateNoteAsync, 
        deleteNoteAsync,
        isCreating, 
        isUpdating, 
        isDeleting 
    } = useNotes();

    const { classes, isLoading: isLoadingClasses } = useClasses();
    const { matieres, isLoading: isLoadingMatieres } = useMatieres();
    const { etudiants, isLoading: isLoadingEtudiants } = useEtudiants();

    // Extraire les options uniques pour les filtres
    const classesUniques = useMemo(() => {
        if (!notes) return [];
        const uniqueClasses = [];
        const seen = new Set();
        
        notes.forEach(note => {
            if (note.classe && !seen.has(note.classe.id)) {
                seen.add(note.classe.id);
                uniqueClasses.push(note.classe);
            }
        });
        
        return uniqueClasses.sort((a, b) => a.libelleCl?.localeCompare(b.libelleCl));
    }, [notes]);

    const matieresUniques = useMemo(() => {
        if (!notes) return [];
        const uniqueMatieres = [];
        const seen = new Set();
        
        notes.forEach(note => {
            if (note.matiere && !seen.has(note.matiere.id)) {
                seen.add(note.matiere.id);
                uniqueMatieres.push(note.matiere);
            }
        });
        
        return uniqueMatieres.sort((a, b) => a.libelleMat?.localeCompare(b.libelleMat));
    }, [notes]);

    const etudiantsUniques = useMemo(() => {
        if (!notes) return [];
        const uniqueEtudiants = [];
        const seen = new Set();
        
        notes.forEach(note => {
            if (note.etudiant && !seen.has(note.etudiant.id)) {
                seen.add(note.etudiant.id);
                uniqueEtudiants.push(note.etudiant);
            }
        });
        
        return uniqueEtudiants.sort((a, b) => a.nomEtu?.localeCompare(b.nomEtu));
    }, [notes]);

    // Filtrer et trier les notes
    const filteredNotes = useMemo(() => {
        let filtered = [...(notes || [])];
        
        // Recherche
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(note => 
                note.etudiant?.nomEtu?.toLowerCase().includes(term) ||
                note.etudiant?.prenomEtu?.toLowerCase().includes(term) ||
                note.matiere?.libelleMat?.toLowerCase().includes(term) ||
                note.classe?.libelleCl?.toLowerCase().includes(term) ||
                note.note?.toString().includes(term)
            );
        }
        
        // Filtre par classe
        if (filterClasse !== 'all') {
            filtered = filtered.filter(note => 
                note.classe?.id?.toString() === filterClasse
            );
        }
        
        // Filtre par matière
        if (filterMatiere !== 'all') {
            filtered = filtered.filter(note => 
                note.matiere?.id?.toString() === filterMatiere
            );
        }
        
        // Filtre par étudiant
        if (filterEtudiant !== 'all') {
            filtered = filtered.filter(note => 
                note.etudiant?.id?.toString() === filterEtudiant
            );
        }
        
        // Tri
        switch(sortBy) {
            case 'note-asc':
                filtered.sort((a, b) => parseFloat(a.note) - parseFloat(b.note));
                break;
            case 'note-desc':
                filtered.sort((a, b) => parseFloat(b.note) - parseFloat(a.note));
                break;
            case 'etudiant-asc':
                filtered.sort((a, b) => a.etudiant?.nomEtu?.localeCompare(b.etudiant?.nomEtu));
                break;
            case 'etudiant-desc':
                filtered.sort((a, b) => b.etudiant?.nomEtu?.localeCompare(a.etudiant?.nomEtu));
                break;
            case 'matiere-asc':
                filtered.sort((a, b) => a.matiere?.libelleMat?.localeCompare(b.matiere?.libelleMat));
                break;
            case 'matiere-desc':
                filtered.sort((a, b) => b.matiere?.libelleMat?.localeCompare(a.matiere?.libelleMat));
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
    }, [notes, searchTerm, filterClasse, filterMatiere, filterEtudiant, sortBy]);

    // Gestion de l'ajout/modification
    const handleSubmitNote = async (formData, id = null) => {
        try {
            if (id) {
                // Modification
                await updateNoteAsync({ id, noteData: formData });
                setNoteToEdit(null);
            } else {
                // Ajout
                await createNoteAsync(formData);
            }
            setIsFormModalOpen(false);
        } catch (error) {
            console.error('Erreur:', error);
        }
    };

    // Gestion de la suppression
    const handleDeleteNote = async () => {
        if (noteToDelete) {
            await deleteNoteAsync(noteToDelete.id);
            setIsDeleteModalOpen(false);
            setNoteToDelete(null);
        }
    };

    const openDeleteModal = (note) => {
        setNoteToDelete(note);
        setIsDeleteModalOpen(true);
    };

    const openEditModal = (note) => {
        setNoteToEdit(note);
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

    // Obtenir la couleur en fonction de la note
    const getNoteColor = (note) => {
        const value = parseFloat(note);
        if (value >= 16) return 'bg-green-100 text-green-700';
        if (value >= 14) return 'bg-emerald-100 text-emerald-700';
        if (value >= 12) return 'bg-blue-100 text-blue-700';
        if (value >= 10) return 'bg-yellow-100 text-yellow-700';
        return 'bg-red-100 text-red-700';
    };

    // Obtenir le label du tri sélectionné
    const getSortLabel = (value) => {
        const sortLabels = {
            'recent': 'Plus récentes',
            'ancien': 'Plus anciennes',
            'note-asc': 'Note ↑',
            'note-desc': 'Note ↓',
            'etudiant-asc': 'Étudiant A → Z',
            'etudiant-desc': 'Étudiant Z → A',
            'matiere-asc': 'Matière A → Z',
            'matiere-desc': 'Matière Z → A',
            'classe-asc': 'Classe A → Z',
            'classe-desc': 'Classe Z → A'
        };
        return sortLabels[value] || 'Trier par';
    };

    // Réinitialiser les filtres
    const resetFilters = () => {
        setSearchTerm('');
        setFilterClasse('all');
        setFilterMatiere('all');
        setFilterEtudiant('all');
    };

    // Vérifier si des filtres sont actifs
    const hasActiveFilters = searchTerm || filterClasse !== 'all' || filterMatiere !== 'all' || filterEtudiant !== 'all';

    // Calculer les statistiques
    const stats = useMemo(() => {
        if (!notes || notes.length === 0) return { 
            total: 0, 
            moyenne: 0,
            maxNote: 0,
            minNote: 0,
            recentCount: 0
        };
        
        let total = 0;
        let maxNote = -Infinity;
        let minNote = Infinity;
        const now = new Date();
        const last30Days = new Date();
        last30Days.setDate(now.getDate() - 30);
        let recentCount = 0;
        
        notes.forEach(note => {
            const noteValue = parseFloat(note.note);
            total += noteValue;
            
            if (noteValue > maxNote) maxNote = noteValue;
            if (noteValue < minNote) minNote = noteValue;
            
            // Notes récentes (30 derniers jours)
            if (note.created_at) {
                const createdDate = new Date(note.created_at);
                if (createdDate >= last30Days) {
                    recentCount++;
                }
            }
        });
        
        return {
            total: notes.length,
            moyenne: total / notes.length,
            maxNote,
            minNote,
            recentCount
        };
    }, [notes]);

    const isLoadingAll = isLoading || isLoadingClasses || isLoadingMatieres || isLoadingEtudiants;

    return (
        <>
            <div className="space-y-6">
                <PageHeader 
                    title="Gestion des Notes"
                    subtitle="Gérez les notes des étudiants par matière et classe"
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
                                        placeholder="Rechercher par étudiant, matière, note..."
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
                                        setNoteToEdit(null);
                                        setIsFormModalOpen(true);
                                    }}
                                    disabled={classes?.length === 0 || matieres?.length === 0 || etudiants?.length === 0}
                                    className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-2.5 rounded-xl hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-pink-200/50 disabled:from-pink-300 disabled:to-rose-400 disabled:cursor-not-allowed"
                                    title={
                                        classes?.length === 0 ? "Créez d'abord une classe" :
                                        matieres?.length === 0 ? "Créez d'abord une matière" :
                                        etudiants?.length === 0 ? "Créez d'abord un étudiant" :
                                        "Ajouter une note"
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

                                {/* Filtre par matière */}
                                <div className="relative">
                                    <select
                                        value={filterMatiere}
                                        onChange={(e) => setFilterMatiere(e.target.value)}
                                        className="appearance-none pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors bg-white w-full"
                                    >
                                        <option value="all">Toutes les matières</option>
                                        {matieresUniques.map((matiere) => (
                                            <option key={matiere.id} value={matiere.id}>
                                                {matiere.libelleMat}
                                            </option>
                                        ))}
                                    </select>
                                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>

                                {/* Filtre par étudiant */}
                                <div className="relative">
                                    <select
                                        value={filterEtudiant}
                                        onChange={(e) => setFilterEtudiant(e.target.value)}
                                        className="appearance-none pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors bg-white w-full"
                                    >
                                        <option value="all">Tous les étudiants</option>
                                        {etudiantsUniques.map((etudiant) => (
                                            <option key={etudiant.id} value={etudiant.id}>
                                                {etudiant.prenomEtu} {etudiant.nomEtu}
                                            </option>
                                        ))}
                                    </select>
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Indicateurs de filtres actifs et compteur */}
                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                {/* Compteur de résultats */}
                                <div className="text-sm text-pink-600">
                                    {hasActiveFilters ? (
                                        <span>
                                            {filteredNotes.length} résultat{filteredNotes.length !== 1 ? 's' : ''} {' '}
                                            sur {notes?.length || 0} note{notes?.length !== 1 ? 's' : ''}
                                        </span>
                                    ) : (
                                        <span>
                                            {notes?.length || 0} note{notes?.length !== 1 ? 's' : ''}
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
                                    <option value="note-asc">Note ↑</option>
                                    <option value="note-desc">Note ↓</option>
                                    <option value="etudiant-asc">Étudiant A → Z</option>
                                    <option value="etudiant-desc">Étudiant Z → A</option>
                                    <option value="matiere-asc">Matière A → Z</option>
                                    <option value="matiere-desc">Matière Z → A</option>
                                    <option value="classe-asc">Classe A → Z</option>
                                    <option value="classe-desc">Classe Z → A</option>
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
                                        <p className="text-gray-500 text-sm">Total notes</p>
                                        <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-pink-100">
                                        <Star className="h-6 w-6 text-pink-500" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Moyenne</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.moyenne ? stats.moyenne.toFixed(2) : '0.00'}
                                        </p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-blue-100">
                                        <TrendingUp className="h-6 w-6 text-blue-500" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm">Meilleure note</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.maxNote !== -Infinity ? stats.maxNote.toFixed(2) : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="p-2 rounded-lg bg-green-100">
                                        <Hash className="h-6 w-6 text-green-500" />
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

                {/* Liste des notes avec skeletons */}
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
                    ) : filteredNotes.length === 0 ? (
                        <div className="p-8 text-center">
                            <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">
                                {hasActiveFilters 
                                    ? 'Aucune note ne correspond à votre recherche' 
                                    : 'Aucune note enregistrée'
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
                                    Ajouter la première note
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
                                            Liste des notes
                                        </span>
                                        <span className="ml-2 text-sm text-gray-500">
                                            ({filteredNotes.length} résultat{filteredNotes.length !== 1 ? 's' : ''})
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
                                            <th className="text-left p-4 font-medium text-gray-700">Matière</th>
                                            <th className="text-left p-4 font-medium text-gray-700">Classe</th>
                                            <th className="text-left p-4 font-medium text-gray-700">Note</th>
                                            <th className="text-left p-4 font-medium text-gray-700">Date</th>
                                            <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredNotes.map((note) => (
                                            <tr key={note.id} className="hover:bg-pink-50/50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center overflow-hidden">
                                                            {note.etudiant?.photo ? (
                                                                <img 
                                                                    src={note.etudiant.photo} 
                                                                    alt={note.etudiant.nomEtu}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <User className="h-5 w-5 text-white" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {note.etudiant?.prenomEtu} {note.etudiant?.nomEtu}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {note.etudiant?.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                                                            <BookOpen className="h-4 w-4 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-900">{note.matiere?.libelleMat}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {note.matiere?.creditMat} crédit{note.matiere?.creditMat !== 1 ? 's' : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {note.classe ? (
                                                        <div>
                                                            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                                                                {note.classe.libelleCl}
                                                            </span>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {note.classe.niveauCl}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">Non assignée</span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getNoteColor(note.note)}`}>
                                                        {parseFloat(note.note).toFixed(2)}/20
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="space-y-1">
                                                        <p className="text-sm text-gray-600">
                                                            {formatDate(note.created_at)}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {formatDateTime(note.created_at).split(' ')[1]}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => openEditModal(note)}
                                                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-600 transition-colors"
                                                            title="Modifier"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteModal(note)}
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
            <NoteModal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setNoteToEdit(null);
                }}
                onSubmit={handleSubmitNote}
                isSubmitting={isCreating || isUpdating}
                note={noteToEdit}
                classes={classes || []}
                matieres={matieres || []}
                etudiants={etudiants || []}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen}
                onConfirm={handleDeleteNote}
                onCancel={() => {
                    setIsDeleteModalOpen(false);
                    setNoteToDelete(null);
                }}
                entityName="la note"
                isDeleting={isDeleting}
            />
        </>
    );
};

export default EnseignantNotes;