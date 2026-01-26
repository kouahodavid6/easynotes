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
    Users,
    FileText,
    Download,
    Filter
} from 'lucide-react';
import PageHeader from '../../../components/PageHeader';
import { useEtudiants } from '../../../hooks/useEtudiants';
import { useClasses } from '../../../hooks/useClasses';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import EtudiantModal from "./components/EtudiantModal";
import { exportToPDF } from '../../../utils/pdfExport';
import { exportToExcel } from '../../../utils/excelExport';

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
    const [isExporting, setIsExporting] = useState(false);

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

    // Extraire les classes uniques pour le filtre avec format d'affichage amélioré
    const classesUniques = useMemo(() => {
        if (!etudiants) return [];
        const uniqueClasses = [];
        const seen = new Set();
        
        etudiants.forEach(etudiant => {
            if (etudiant.classe && !seen.has(etudiant.classe.id)) {
                seen.add(etudiant.classe.id);
                uniqueClasses.push({
                    ...etudiant.classe,
                    // Format d'affichage combiné pour le select
                    displayName: `${etudiant.classe.niveauCl} - ${etudiant.classe.libelleCl}`
                });
            }
        });
        
        // Trier d'abord par niveau, puis par libellé
        return uniqueClasses.sort((a, b) => {
            const niveauCompare = (a.niveauCl || '').localeCompare(b.niveauCl || '');
            if (niveauCompare !== 0) return niveauCompare;
            return (a.libelleCl || '').localeCompare(b.libelleCl || '');
        });
    }, [etudiants]);

    // Obtenir le nom complet de la classe sélectionnée
    const getSelectedClasseName = useMemo(() => {
        if (filterClasse === 'all') return 'Toutes les classes';
        const classe = classesUniques.find(c => c.id.toString() === filterClasse);
        return classe ? `${classe.niveauCl} ${classe.libelleCl}` : 'Classe inconnue';
    }, [filterClasse, classesUniques]);

    // Obtenir le nom d'affichage court pour le filtre
    const getSelectedClasseDisplay = useMemo(() => {
        if (filterClasse === 'all') return 'Toutes les classes';
        const classe = classesUniques.find(c => c.id.toString() === filterClasse);
        return classe ? classe.displayName : 'Classe inconnue';
    }, [filterClasse, classesUniques]);

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
                filtered.sort((a, b) => {
                    const classeA = a.classe?.displayName || `${a.classe?.niveauCl || ''} ${a.classe?.libelleCl || ''}`;
                    const classeB = b.classe?.displayName || `${b.classe?.niveauCl || ''} ${b.classe?.libelleCl || ''}`;
                    return classeA.localeCompare(classeB);
                });
                break;
            case 'classe-desc':
                filtered.sort((a, b) => {
                    const classeA = a.classe?.displayName || `${a.classe?.niveauCl || ''} ${a.classe?.libelleCl || ''}`;
                    const classeB = b.classe?.displayName || `${b.classe?.niveauCl || ''} ${b.classe?.libelleCl || ''}`;
                    return classeB.localeCompare(classeA);
                });
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

    // Fonction générique pour exporter
    const handleExport = async (format) => {
        if (!filteredEtudiants.length) return;
        
        setIsExporting(true);
        try {
            const data = filteredEtudiants.map(etudiant => ({
                'Nom': etudiant.nomEtu || '',
                'Prénom': etudiant.prenomEtu || '',
                'Matricule': etudiant.matricule || '',
                'Email': etudiant.email || '',
                'Téléphone': etudiant.telEtu || '',
                'Niveau': etudiant.classe?.niveauCl || 'N/A',
                'Classe': etudiant.classe?.libelleCl || 'Non assigné',
                'Date d\'inscription': formatDate(etudiant.created_at)
            }));

            const today = new Date();
            const dateStr = today.toISOString().split('T')[0];
            const filters = {
                classe: getSelectedClasseName,
                searchTerm: searchTerm || undefined
            };
            
            // Déterminer le titre en fonction du filtre
            let title = 'Liste des Étudiants';
            let subtitle = '';
            
            if (filterClasse !== 'all') {
                const classe = classesUniques.find(c => c.id.toString() === filterClasse);
                if (classe) {
                    title = `Étudiants - ${classe.niveauCl} ${classe.libelleCl}`;
                }
            } else if (searchTerm) {
                subtitle = `Recherche : "${searchTerm}"`;
            }

            if (format === 'pdf') {
                const fileName = filterClasse === 'all' 
                    ? `etudiants_${dateStr}.pdf`
                    : `etudiants_${getSelectedClasseName.replace(/\s+/g, '_')}_${dateStr}.pdf`;
                
                await exportToPDF({
                    title,
                    subtitle,
                    fileName,
                    data,
                    columns: [
                        { header: 'Nom', key: 'Nom', width: 80 },
                        { header: 'Prénom', key: 'Prénom', width: 80 },
                        { header: 'Matricule', key: 'Matricule', width: 90 },
                        { header: 'Email', key: 'Email', width: 120 },
                        { header: 'Téléphone', key: 'Téléphone', width: 90 },
                        { header: 'Niveau', key: 'Niveau', width: 60 },
                        { header: 'Classe', key: 'Classe', width: 80 },
                        { header: 'Date d\'inscription', key: 'Date d\'inscription', width: 100 }
                    ],
                    summary: {
                        total: filteredEtudiants.length,
                        classes: Object.keys(stats.parClasse).length,
                    },
                    filters: filters
                });
            } else if (format === 'excel') {
                const fileName = filterClasse === 'all'
                    ? `etudiants_${dateStr}.xlsx`
                    : `etudiants_${getSelectedClasseName.replace(/\s+/g, '_')}_${dateStr}.xlsx`;
                
                await exportToExcel({
                    fileName,
                    data,
                    sheetName: filterClasse === 'all' ? 'Étudiants' : getSelectedClasseName.substring(0, 31),
                    title,
                    date: today.toLocaleDateString('fr-FR'),
                    filters: filters
                });
            }
        } catch (error) {
            console.error(`Erreur lors de l'export ${format.toUpperCase()}:`, error);
            alert(`Erreur lors de l'export ${format.toUpperCase()}. Veuillez réessayer.`);
        } finally {
            setIsExporting(false);
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
        if (!etudiants) return { total: 0, parClasse: {}, parNiveau: {} };
        
        const parClasse = {};
        const parNiveau = {};
        
        etudiants.forEach(etudiant => {
            // Statistiques par classe complète
            if (etudiant.classe) {
                const classeKey = `${etudiant.classe.niveauCl} ${etudiant.classe.libelleCl}`;
                parClasse[classeKey] = (parClasse[classeKey] || 0) + 1;
                
                // Statistiques par niveau
                const niveauKey = etudiant.classe.niveauCl || 'Non spécifié';
                parNiveau[niveauKey] = (parNiveau[niveauKey] || 0) + 1;
            }
        });
        
        return {
            total: etudiants.length,
            parClasse,
            parNiveau
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
                                        placeholder="Rechercher par nom, prénom, matricule, classe, niveau..."
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
                                <div className="flex flex-wrap items-center gap-3">
                                    {/* Filtre par classe amélioré */}
                                    <div className="relative">
                                        <select
                                            value={filterClasse}
                                            onChange={(e) => setFilterClasse(e.target.value)}
                                            className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors bg-white min-w-[200px]"
                                        >
                                            <option value="all">Toutes les classes</option>
                                            {classesUniques.map((classe) => (
                                                <option key={classe.id} value={classe.id}>
                                                    {classe.displayName}
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
                                        <span className="font-medium hidden sm:inline">Nouveau</span>
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
                                
                                {/* Indicateur de filtre actif */}
                                {hasActiveFilters && (
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">
                                            {filterClasse !== 'all' && `Classe : ${getSelectedClasseName}`}
                                            {filterClasse !== 'all' && searchTerm && ' | '}
                                            {searchTerm && `Recherche : "${searchTerm}"`}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Barre d'exportation et indicateur de tri */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-2">
                            <div className="text-sm text-gray-600">
                                Tri: <span className="font-medium text-pink-600">{getSortLabel(sortBy)}</span>
                                {filterClasse !== 'all' && (
                                    <span className="ml-3 text-blue-600">
                                        • Filtre: {getSelectedClasseDisplay}
                                    </span>
                                )}
                            </div>
                            
                            {/* Boutons d'exportation */}
                            {filteredEtudiants.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <div className="text-xs text-gray-500 mr-2 hidden sm:block">
                                        Exporter {filterClasse === 'all' ? 'tous les étudiants' : getSelectedClasseDisplay}:
                                    </div>
                                    <button
                                        onClick={() => handleExport('pdf')}
                                        disabled={isExporting || filteredEtudiants.length === 0}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 hover:border-pink-300 hover:bg-pink-50 text-gray-700 hover:text-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title={filterClasse === 'all' ? "Exporter tous les étudiants en PDF" : `Exporter ${getSelectedClasseDisplay} en PDF`}
                                    >
                                        {isExporting ? (
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-pink-500 border-t-transparent"></div>
                                        ) : (
                                            <FileText className="h-4 w-4" />
                                        )}
                                        <span className="text-sm font-medium hidden sm:inline">PDF</span>
                                    </button>
                                    <button
                                        onClick={() => handleExport('excel')}
                                        disabled={isExporting || filteredEtudiants.length === 0}
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-300 hover:border-green-300 hover:bg-green-50 text-gray-700 hover:text-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title={filterClasse === 'all' ? "Exporter tous les étudiants en Excel" : `Exporter ${getSelectedClasseDisplay} en Excel`}
                                    >
                                        {isExporting ? (
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-500 border-t-transparent"></div>
                                        ) : (
                                            <Download className="h-4 w-4" />
                                        )}
                                        <span className="text-sm font-medium hidden sm:inline">Excel</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Statistiques avec skeletons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                        <p className="text-gray-500 text-sm">Classes différentes</p>
                                        <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.parClasse).length}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {Object.keys(stats.parNiveau).length} niveau{Object.keys(stats.parNiveau).length !== 1 ? 'x' : ''}
                                        </p>
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
                                <div className="grid grid-cols-6 gap-4">
                                    {[1, 2, 3, 4, 5, 6].map((item) => (
                                        <div key={item} className="h-4 bg-gray-300 rounded animate-pulse"></div>
                                    ))}
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
                            <div className="px-4 sm:px-6 py-4 bg-pink-50 border-b border-pink-100">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <div>
                                        <span className="font-medium text-gray-700">
                                            Liste des étudiants
                                            {filterClasse !== 'all' && (
                                                <span className="ml-2 text-blue-600">
                                                    ({getSelectedClasseDisplay})
                                                </span>
                                            )}
                                        </span>
                                        <span className="ml-2 text-sm text-gray-500">
                                            ({filteredEtudiants.length} résultat{filteredEtudiants.length !== 1 ? 's' : ''})
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <span className="hidden sm:inline">Tri: </span>
                                        <span className="font-medium">{getSortLabel(sortBy)}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Tableau */}
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead className="bg-pink-50">
                                        <tr>
                                            <th className="text-left p-4 font-medium text-gray-700 whitespace-nowrap">Étudiant</th>
                                            <th className="text-left p-4 font-medium text-gray-700 whitespace-nowrap">Contact</th>
                                            <th className="text-left p-4 font-medium text-gray-700 whitespace-nowrap">Matricule</th>
                                            <th className="text-left p-4 font-medium text-gray-700 whitespace-nowrap">Classe</th>
                                            <th className="text-left p-4 font-medium text-gray-700 whitespace-nowrap">Date</th>
                                            <th className="text-left p-4 font-medium text-gray-700 whitespace-nowrap">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredEtudiants.map((etudiant) => (
                                            <tr key={etudiant.id} className="hover:bg-pink-50/50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center overflow-hidden flex-shrink-0">
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
                                                        <div className="min-w-0">
                                                            <p className="font-medium text-gray-900 truncate">
                                                                {etudiant.prenomEtu} {etudiant.nomEtu}
                                                            </p>
                                                            <p className="text-sm text-gray-500 truncate">Étudiant</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                                            <span className="text-sm text-gray-600 truncate">{etudiant.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="h-3 w-3 text-gray-400 flex-shrink-0" />
                                                            <span className="text-sm text-gray-600 truncate">{etudiant.telEtu}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="inline-block px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-sm font-medium truncate max-w-[120px]">
                                                        {etudiant.matricule}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    {etudiant.classe ? (
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="inline-block px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                                                    {etudiant.classe.niveauCl}
                                                                </span>
                                                                <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium truncate max-w-[120px]">
                                                                    {etudiant.classe.libelleCl}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1 truncate">
                                                                {etudiant.classe.niveauCl} - {etudiant.classe.libelleCl}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-500">Non assigné</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                                                    {formatDate(etudiant.created_at)}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => openEditModal(etudiant)}
                                                            className="p-2 rounded-lg hover:bg-blue-50 text-blue-500 hover:text-blue-600 transition-colors flex-shrink-0"
                                                            title="Modifier"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteModal(etudiant)}
                                                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors flex-shrink-0"
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