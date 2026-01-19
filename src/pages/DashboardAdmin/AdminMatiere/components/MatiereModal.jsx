import { useState, useEffect } from 'react';
import { X, BookOpen, User, GraduationCap, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MatiereModal = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    isSubmitting = false,
    matiere = null,
    classes = [],
    enseignants = [],
    periodes = []
}) => {
    const [formData, setFormData] = useState({
        libelleMat: '',
        creditMat: '',
        enseignant_id: '',
        classe_id: '',
        periode_id: ''
    });

    const [errors, setErrors] = useState({});

    // Initialiser les données si on est en mode édition
    useEffect(() => {
        if (matiere) {
            setFormData({
                libelleMat: matiere.libelleMat || '',
                creditMat: matiere.creditMat?.toString() || '',
                enseignant_id: matiere.enseignant?.id || matiere.enseignant_id || '',
                classe_id: matiere.classe?.id || matiere.classe_id || '',
                periode_id: matiere.periode?.id || matiere.periode_id || ''
            });
        } else {
            // Réinitialiser pour une nouvelle matière
            setFormData({
                libelleMat: '',
                creditMat: '',
                enseignant_id: '',
                classe_id: '',
                periode_id: ''
            });
        }
        setErrors({});
    }, [matiere, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Effacer l'erreur quand l'utilisateur commence à taper
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.libelleMat.trim()) {
            newErrors.libelleMat = 'Le libellé est requis';
        }
        
        if (!formData.creditMat) {
            newErrors.creditMat = 'Le nombre de crédits est requis';
        } else if (isNaN(formData.creditMat) || parseFloat(formData.creditMat) <= 0) {
            newErrors.creditMat = 'Le nombre de crédits doit être un nombre positif';
        } else if (parseFloat(formData.creditMat) > 10) {
            newErrors.creditMat = 'Le nombre de crédits ne peut pas dépasser 10';
        }
        
        if (!formData.enseignant_id) {
            newErrors.enseignant_id = 'La sélection d\'un enseignant est requise';
        }
        
        if (!formData.classe_id) {
            newErrors.classe_id = 'La sélection d\'une classe est requise';
        }
        
        if (!formData.periode_id) {
            newErrors.periode_id = 'La sélection d\'une période est requise';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Convertir creditMat en nombre
        const dataToSend = {
            ...formData,
            creditMat: parseFloat(formData.creditMat)
        };
        
        onSubmit(dataToSend, matiere?.id);
    };

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
                                        <BookOpen className="h-5 w-5 text-pink-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                                            {matiere ? 'Modifier matière' : 'Nouvelle matière'}
                                        </h2>
                                        <p className="text-gray-600 text-sm">
                                            {matiere ? 'Mettez à jour la matière' : 'Ajoutez une nouvelle matière'}
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
                            <div className="space-y-4">
                                {/* Libellé */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Libellé de la matière *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <BookOpen className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="libelleMat"
                                            value={formData.libelleMat}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting}
                                            className={`pl-10 w-full px-4 py-2.5 rounded-xl border ${errors.libelleMat ? 'border-red-300' : 'border-gray-300'} focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed`}
                                            placeholder="Ex: Mathématiques, Physique..."
                                        />
                                    </div>
                                    {errors.libelleMat && (
                                        <p className="mt-1 text-sm text-red-600">{errors.libelleMat}</p>
                                    )}
                                </div>

                                {/* Crédits */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nombre de crédits *
                                    </label>
                                    <input
                                        type="number"
                                        name="creditMat"
                                        value={formData.creditMat}
                                        onChange={handleChange}
                                        min="1"
                                        max="10"
                                        step="0.5"
                                        required
                                        disabled={isSubmitting}
                                        className={`w-full px-4 py-2.5 rounded-xl border ${errors.creditMat ? 'border-red-300' : 'border-gray-300'} focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed`}
                                        placeholder="Ex: 2, 3, 4..."
                                    />
                                    {errors.creditMat && (
                                        <p className="mt-1 text-sm text-red-600">{errors.creditMat}</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">
                                        Valeur entre 1 et 10 crédits (0.5 crédit possible)
                                    </p>
                                </div>

                                {/* Sélections */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Classe */}
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
                                        {classes.length === 0 && (
                                            <p className="text-xs text-yellow-600 mt-1">
                                                Aucune classe disponible
                                            </p>
                                        )}
                                    </div>

                                    {/* Enseignant */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Enseignant *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <select
                                                name="enseignant_id"
                                                value={formData.enseignant_id}
                                                onChange={handleChange}
                                                required
                                                disabled={isSubmitting || enseignants.length === 0}
                                                className={`pl-10 w-full px-4 py-2.5 rounded-xl border ${errors.enseignant_id ? 'border-red-300' : 'border-gray-300'} focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed appearance-none`}
                                            >
                                                <option value="">Sélectionnez un enseignant</option>
                                                {enseignants.map((enseignant) => (
                                                    <option key={enseignant.id} value={enseignant.id}>
                                                        {enseignant.prenomEns} {enseignant.nomEns}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {errors.enseignant_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.enseignant_id}</p>
                                        )}
                                        {enseignants.length === 0 && (
                                            <p className="text-xs text-yellow-600 mt-1">
                                                Aucun enseignant disponible
                                            </p>
                                        )}
                                    </div>

                                    {/* Période */}
                                    <div className="sm:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Période académique *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <select
                                                name="periode_id"
                                                value={formData.periode_id}
                                                onChange={handleChange}
                                                required
                                                disabled={isSubmitting || periodes.length === 0}
                                                className={`pl-10 w-full px-4 py-2.5 rounded-xl border ${errors.periode_id ? 'border-red-300' : 'border-gray-300'} focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed appearance-none`}
                                            >
                                                <option value="">Sélectionnez une période</option>
                                                {periodes.map((periode) => (
                                                    <option key={periode.id} value={periode.id}>
                                                        {periode.libellePrd} ({new Date(periode.debutPrd).toLocaleDateString('fr-FR')} - {new Date(periode.finPrd).toLocaleDateString('fr-FR')})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {errors.periode_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.periode_id}</p>
                                        )}
                                        {periodes.length === 0 && (
                                            <p className="text-xs text-yellow-600 mt-1">
                                                Aucune période disponible
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Aperçu des sélections */}
                                {(formData.classe_id || formData.enseignant_id || formData.periode_id) && (
                                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                        <p className="text-sm font-medium text-blue-700 mb-2">Aperçu de la configuration :</p>
                                        <div className="space-y-1 text-sm text-blue-600">
                                            {formData.classe_id && (
                                                <p>
                                                    <span className="font-medium">Classe :</span>{' '}
                                                    {classes.find(c => c.id.toString() === formData.classe_id)?.libelleCl}
                                                </p>
                                            )}
                                            {formData.enseignant_id && (
                                                <p>
                                                    <span className="font-medium">Enseignant :</span>{' '}
                                                    {enseignants.find(e => e.id.toString() === formData.enseignant_id)?.prenomEns}{' '}
                                                    {enseignants.find(e => e.id.toString() === formData.enseignant_id)?.nomEns}
                                                </p>
                                            )}
                                            {formData.periode_id && (
                                                <p>
                                                    <span className="font-medium">Période :</span>{' '}
                                                    {periodes.find(p => p.id.toString() === formData.periode_id)?.libellePrd}
                                                </p>
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
                                    disabled={isSubmitting || classes.length === 0 || enseignants.length === 0 || periodes.length === 0}
                                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 disabled:from-pink-300 disabled:to-rose-400 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-pink-200/50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            {matiere ? 'Modification...' : 'Création...'}
                                        </>
                                    ) : (
                                        <>
                                            {matiere ? 'Modifier' : 'Créer'}
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

export default MatiereModal;