import { useState, useEffect, useRef, useCallback } from 'react';
import { X, BookOpen, User, GraduationCap, Star, Percent, Search, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NoteModal = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    isSubmitting = false,
    note = null,
    classes = [],
    matieres = [],
    etudiants = []
}) => {
    const [formData, setFormData] = useState({
        note: '',
        classe_id: '',
        matiere_id: '',
        etudiant_id: ''
    });

    const [errors, setErrors] = useState({});
    const [filteredMatieres, setFilteredMatieres] = useState([]);
    const [matriculeSearch, setMatriculeSearch] = useState('');
    const [foundEtudiant, setFoundEtudiant] = useState(null);
    const [matriculeError, setMatriculeError] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const matriculeInputRef = useRef(null);

    // Fonction pour obtenir l'ID de classe d'une matière
    const getClasseIdFromMatiere = useCallback((matiere) => {
        // Vérifier si matiere existe et a une classe
        if (!matiere) return null;
        
        // Si la matière a un objet classe avec id
        if (matiere.classe && matiere.classe.id) {
            return matiere.classe.id.toString();
        }
        
        // Sinon, vérifier le champ direct classe_id
        if (matiere.classe_id) {
            return matiere.classe_id.toString();
        }
        
        return null;
    }, []);

    // Fonction pour obtenir l'ID de classe d'un étudiant
    const getClasseIdFromEtudiant = useCallback((etudiant) => {
        if (!etudiant) return null;
        
        // Vérifier d'abord le champ direct classe_id
        if (etudiant.classe_id) {
            return etudiant.classe_id.toString();
        }
        
        // Sinon, vérifier l'objet classe
        if (etudiant.classe && etudiant.classe.id) {
            return etudiant.classe.id.toString();
        }
        
        return null;
    }, []);

    // Filtrer les matières en fonction de la classe sélectionnée
    useEffect(() => {
        if (formData.classe_id && matieres.length > 0) {
            const filtered = matieres.filter(matiere => {
                const matiereClasseId = getClasseIdFromMatiere(matiere);
                return matiereClasseId === formData.classe_id.toString();
            });
            
            setFilteredMatieres(filtered);
            
            // Réinitialiser matiere_id si la matière n'est plus disponible
            if (formData.matiere_id && !filtered.some(m => m.id.toString() === formData.matiere_id.toString())) {
                setFormData(prev => ({ ...prev, matiere_id: '' }));
            }
        } else {
            setFilteredMatieres([]);
            if (formData.matiere_id) {
                setFormData(prev => ({ ...prev, matiere_id: '' }));
            }
        }
    }, [formData.classe_id, formData.matiere_id, matieres, getClasseIdFromMatiere]);

    // Rechercher l'étudiant par matricule
    const handleSearchEtudiant = useCallback(() => {
        setMatriculeError('');
        setFoundEtudiant(null);
        setFormData(prev => ({ ...prev, etudiant_id: '' }));
        
        if (!matriculeSearch.trim()) {
            setMatriculeError('Veuillez saisir un matricule');
            return;
        }

        if (!formData.classe_id) {
            setMatriculeError('Veuillez d\'abord sélectionner une classe');
            return;
        }

        setIsSearching(true);
        
        setTimeout(() => {
            // Recherche exacte du matricule dans la classe sélectionnée
            const etudiant = etudiants.find(etudiant => {
                const etudiantClasseId = getClasseIdFromEtudiant(etudiant);
                const etudiantMatricule = etudiant.matricule?.toString().toLowerCase();
                const searchMatricule = matriculeSearch.toLowerCase().trim();
                
                return etudiantClasseId === formData.classe_id.toString() && 
                       etudiantMatricule === searchMatricule;
            });

            if (etudiant) {
                setFoundEtudiant(etudiant);
                setFormData(prev => ({ ...prev, etudiant_id: etudiant.id }));
            } else {
                setMatriculeError('Aucun étudiant trouvé avec ce matricule dans cette classe');
            }
            
            setIsSearching(false);
        }, 300);
    }, [matriculeSearch, formData.classe_id, etudiants, getClasseIdFromEtudiant]);

    // Initialiser les données si on est en mode édition
    useEffect(() => {
        if (note && isOpen) {
            // Trouver l'étudiant correspondant à la note
            const etudiant = etudiants.find(e => {
                const eId = e.id?.toString();
                const noteEtudiantId = note.etudiant?.id?.toString() || note.etudiant_id?.toString();
                return eId === noteEtudiantId;
            });
            
            // Déterminer la classe_id - vérifier dans l'ordre : note.classe.id, note.classe_id
            let classeId = '';
            if (note.classe?.id) {
                classeId = note.classe.id.toString();
            } else if (note.classe_id) {
                classeId = note.classe_id.toString();
            }
            
            // Déterminer la matiere_id
            let matiereId = '';
            if (note.matiere?.id) {
                matiereId = note.matiere.id.toString();
            } else if (note.matiere_id) {
                matiereId = note.matiere_id.toString();
            }
            
            // Déterminer l'etudiant_id
            let etudiantId = '';
            if (note.etudiant?.id) {
                etudiantId = note.etudiant.id.toString();
            } else if (note.etudiant_id) {
                etudiantId = note.etudiant_id.toString();
            }
            
            setFormData({
                note: note.note?.toString() || '',
                classe_id: classeId,
                matiere_id: matiereId,
                etudiant_id: etudiantId
            });
            
            if (etudiant) {
                setFoundEtudiant(etudiant);
                setMatriculeSearch(etudiant.matricule || '');
            }
            
            // Filtrer les matières pour la classe
            if (classeId && matieres.length > 0) {
                const filtered = matieres.filter(matiere => {
                    const matiereClasseId = getClasseIdFromMatiere(matiere);
                    return matiereClasseId === classeId;
                });
                setFilteredMatieres(filtered);
            }
        } else {
            // Mode création
            setFormData({
                note: '',
                classe_id: '',
                matiere_id: '',
                etudiant_id: ''
            });
            setFoundEtudiant(null);
            setMatriculeSearch('');
            setFilteredMatieres([]);
        }
        
        setErrors({});
        setMatriculeError('');
        setIsSearching(false);
    }, [note, isOpen, etudiants, matieres, getClasseIdFromMatiere]);

    // Rechercher l'étudiant quand on appuie sur Entrée
    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearchEtudiant();
        }
    }, [handleSearchEtudiant]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Effacer l'erreur correspondante si elle existe
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }

        // Si on change de classe, réinitialiser les dépendances
        if (name === 'classe_id') {
            setMatriculeSearch('');
            setFoundEtudiant(null);
            setMatriculeError('');
            setFormData(prev => ({ 
                ...prev, 
                etudiant_id: '', 
                matiere_id: '' 
            }));
            setFilteredMatieres([]);
        }
    }, [errors]);

    const validateForm = useCallback(() => {
        const newErrors = {};
        
        if (!formData.note || formData.note.trim() === '') {
            newErrors.note = 'La note est requise';
        } else {
            const noteValue = parseFloat(formData.note);
            if (isNaN(noteValue)) {
                newErrors.note = 'La note doit être un nombre';
            } else if (noteValue < 0 || noteValue > 20) {
                newErrors.note = 'La note doit être entre 0 et 20';
            }
        }
        
        if (!formData.classe_id) {
            newErrors.classe_id = 'La sélection d\'une classe est requise';
        }
        
        if (!formData.matiere_id) {
            newErrors.matiere_id = 'La sélection d\'une matière est requise';
        }
        
        if (!formData.etudiant_id) {
            newErrors.etudiant_id = 'La sélection d\'un étudiant est requise';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData.note, formData.classe_id, formData.matiere_id, formData.etudiant_id]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const dataToSend = {
            note: parseFloat(formData.note),
            classe_id: parseInt(formData.classe_id),
            matiere_id: parseInt(formData.matiere_id),
            etudiant_id: parseInt(formData.etudiant_id)
        };
        
        onSubmit(dataToSend, note?.id);
    }, [formData, validateForm, onSubmit, note?.id]);

    // Focus sur l'input de matricule quand le modal s'ouvre
    useEffect(() => {
        if (isOpen && matriculeInputRef.current && !note) {
            setTimeout(() => {
                matriculeInputRef.current?.focus();
            }, 100);
        }
    }, [isOpen, note]);

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { type: "spring", damping: 25, stiffness: 300 }
        },
        exit: { opacity: 0, scale: 0.9 }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    
                    <motion.div 
                        className="relative z-[10000] bg-white rounded-2xl w-full max-w-lg mx-auto shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* En-tête */}
                        <div className="sticky top-0 bg-white border-b border-pink-100 p-4 sm:p-6 rounded-t-2xl z-10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-pink-50">
                                        <Star className="h-5 w-5 text-pink-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                                            {note ? 'Modifier note' : 'Nouvelle note'}
                                        </h2>
                                        <p className="text-gray-600 text-sm">
                                            {note ? 'Mettez à jour la note' : 'Ajoutez une nouvelle note'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-pink-50 text-gray-500 hover:text-gray-700 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        {/* Formulaire */}
                        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                            <div className="space-y-6">
                                {/* 1. Sélection de la classe */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Classe *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <GraduationCap className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <select
                                            name="classe_id"
                                            value={formData.classe_id}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting || classes.length === 0}
                                            className={`pl-10 w-full px-4 py-2.5 rounded-xl border ${errors.classe_id ? 'border-red-300' : 'border-gray-300'} focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed appearance-none`}
                                        >
                                            <option value="">Sélectionnez une classe</option>
                                            {classes.map((classe) => (
                                                <option key={classe.id} value={classe.id}>
                                                    {classe.libelleCl} - {classe.niveauCl}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.classe_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.classe_id}</p>
                                    )}
                                </div>

                                {/* 2. Sélection de la matière */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Matière *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <BookOpen className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <select
                                            name="matiere_id"
                                            value={formData.matiere_id}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting || !formData.classe_id || filteredMatieres.length === 0}
                                            className={`pl-10 w-full px-4 py-2.5 rounded-xl border ${errors.matiere_id ? 'border-red-300' : 'border-gray-300'} focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed appearance-none`}
                                        >
                                            <option value="">
                                                {!formData.classe_id 
                                                    ? 'Sélectionnez d\'abord une classe' 
                                                    : filteredMatieres.length === 0 
                                                        ? 'Aucune matière disponible pour cette classe' 
                                                        : 'Sélectionnez une matière'
                                                }
                                            </option>
                                            {filteredMatieres.map((matiere) => (
                                                <option key={matiere.id} value={matiere.id}>
                                                    {matiere.libelleMat} ({matiere.creditMat} crédits)
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.matiere_id && (
                                        <p className="mt-1 text-sm text-red-600">{errors.matiere_id}</p>
                                    )}
                                    {formData.classe_id && filteredMatieres.length === 0 && (
                                        <p className="text-xs text-yellow-600 mt-1">
                                            Aucune matière n'est associée à cette classe
                                        </p>
                                    )}
                                </div>

                                {/* 3. Recherche d'étudiant par matricule */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Recherche par matricule *
                                    </label>
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <Hash className="h-4 w-4 text-gray-400" />
                                                </div>
                                                <input
                                                    ref={matriculeInputRef}
                                                    type="text"
                                                    value={matriculeSearch}
                                                    onChange={(e) => {
                                                        setMatriculeSearch(e.target.value);
                                                        setMatriculeError('');
                                                        setFoundEtudiant(null);
                                                        setFormData(prev => ({ ...prev, etudiant_id: '' }));
                                                    }}
                                                    onKeyPress={handleKeyPress}
                                                    disabled={isSubmitting || !formData.classe_id}
                                                    className={`pl-10 w-full px-4 py-2.5 rounded-xl border ${matriculeError ? 'border-red-300' : 'border-gray-300'} focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed`}
                                                    placeholder="Entrez le matricule de l'étudiant"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                                    {isSearching && (
                                                        <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleSearchEtudiant}
                                                disabled={isSubmitting || !formData.classe_id || !matriculeSearch.trim() || isSearching}
                                                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 disabled:from-blue-300 disabled:to-cyan-400 disabled:cursor-not-allowed transition-all flex items-center gap-2 min-w-[100px] justify-center"
                                                title="Rechercher l'étudiant"
                                            >
                                                {isSearching ? (
                                                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                ) : (
                                                    <>
                                                        <Search className="h-4 w-4" />
                                                        <span className="hidden sm:inline">Rechercher</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        
                                        {matriculeError && (
                                            <p className="text-sm text-red-600">{matriculeError}</p>
                                        )}
                                        
                                        {/* Affichage de l'étudiant trouvé */}
                                        {foundEtudiant && (
                                            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 animate-fadeIn">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center overflow-hidden">
                                                        {foundEtudiant.photo ? (
                                                            <img 
                                                                src={foundEtudiant.photo} 
                                                                alt={foundEtudiant.nomEtu}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <User className="h-5 w-5 text-white" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-emerald-700">
                                                            {foundEtudiant.prenomEtu} {foundEtudiant.nomEtu}
                                                        </p>
                                                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 text-xs text-emerald-600">
                                                            <span>Matricule: {foundEtudiant.matricule}</span>
                                                            <span className="hidden sm:inline">•</span>
                                                            <span>Email: {foundEtudiant.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {errors.etudiant_id && !foundEtudiant && (
                                            <p className="text-sm text-red-600">{errors.etudiant_id}</p>
                                        )}
                                    </div>
                                </div>

                                {/* 4. Champ note */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Note (sur 20) *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Percent className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            name="note"
                                            value={formData.note}
                                            onChange={handleChange}
                                            min="0"
                                            max="20"
                                            step="0.01"
                                            required
                                            disabled={isSubmitting}
                                            className={`pl-10 w-full px-4 py-2.5 rounded-xl border ${errors.note ? 'border-red-300' : 'border-gray-300'} focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed`}
                                            placeholder="Ex: 15.5, 18.75..."
                                        />
                                    </div>
                                    {errors.note && (
                                        <p className="mt-1 text-sm text-red-600">{errors.note}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">
                                        Valeur entre 0 et 20 (décimales autorisées)
                                    </p>
                                </div>

                                {/* Aperçu des sélections */}
                                {(formData.classe_id || formData.matiere_id || foundEtudiant || formData.note) && (
                                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                        <p className="text-sm font-medium text-blue-700 mb-2">Résumé de la note :</p>
                                        <div className="space-y-2 text-sm text-blue-600">
                                            {formData.classe_id && (
                                                <div className="flex items-center gap-2">
                                                    <GraduationCap className="h-3 w-3 flex-shrink-0" />
                                                    <span className="font-medium">Classe :</span>
                                                    <span>{classes.find(c => c.id.toString() === formData.classe_id)?.libelleCl}</span>
                                                </div>
                                            )}
                                            {formData.matiere_id && (
                                                <div className="flex items-center gap-2">
                                                    <BookOpen className="h-3 w-3 flex-shrink-0" />
                                                    <span className="font-medium">Matière :</span>
                                                    <span>{matieres.find(m => m.id.toString() === formData.matiere_id)?.libelleMat}</span>
                                                </div>
                                            )}
                                            {foundEtudiant && (
                                                <div className="flex items-center gap-2">
                                                    <User className="h-3 w-3 flex-shrink-0" />
                                                    <span className="font-medium">Étudiant :</span>
                                                    <span>{foundEtudiant.prenomEtu} {foundEtudiant.nomEtu} ({foundEtudiant.matricule})</span>
                                                </div>
                                            )}
                                            {formData.note && (
                                                <div className="flex items-center gap-2">
                                                    <Percent className="h-3 w-3 flex-shrink-0" />
                                                    <span className="font-medium">Note :</span>
                                                    <span>{parseFloat(formData.note).toFixed(2)}/20</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-6 border-t border-pink-100">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 px-4 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || 
                                        !formData.classe_id || 
                                        !formData.matiere_id || 
                                        !foundEtudiant || 
                                        !formData.note ||
                                        errors.note ||
                                        errors.classe_id ||
                                        errors.matiere_id ||
                                        errors.etudiant_id
                                    }
                                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 disabled:from-pink-300 disabled:to-rose-400 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-pink-200/50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            {note ? 'Modification...' : 'Création...'}
                                        </>
                                    ) : (
                                        <>
                                            {note ? 'Modifier' : 'Valider'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default NoteModal;