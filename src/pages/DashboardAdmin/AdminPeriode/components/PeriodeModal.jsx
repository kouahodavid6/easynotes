import { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PeriodeModal = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    isSubmitting = false,
    periode = null
}) => {
    const [formData, setFormData] = useState({
        libellePrd: '',
        debutPrd: '',
        finPrd: ''
    });

    const [errors, setErrors] = useState({});

    // Initialiser les données si on est en mode édition
    useEffect(() => {
        if (periode) {
            // Format des dates pour l'input date (YYYY-MM-DD)
            const formatDateForInput = (dateString) => {
                if (!dateString) return '';
                const date = new Date(dateString);
                return date.toISOString().split('T')[0];
            };

            setFormData({
                libellePrd: periode.libellePrd || '',
                debutPrd: formatDateForInput(periode.debutPrd),
                finPrd: formatDateForInput(periode.finPrd)
            });
        } else {
            // Réinitialiser pour une nouvelle période
            setFormData({
                libellePrd: '',
                debutPrd: '',
                finPrd: ''
            });
        }
        setErrors({});
    }, [periode, isOpen]);

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
        
        if (!formData.libellePrd.trim()) {
            newErrors.libellePrd = 'Le libellé est requis';
        }
        
        if (!formData.debutPrd) {
            newErrors.debutPrd = 'La date de début est requise';
        }
        
        if (!formData.finPrd) {
            newErrors.finPrd = 'La date de fin est requise';
        }
        
        if (formData.debutPrd && formData.finPrd) {
            const debut = new Date(formData.debutPrd);
            const fin = new Date(formData.finPrd);
            
            if (debut >= fin) {
                newErrors.finPrd = 'La date de fin doit être postérieure à la date de début';
            }
            
            // Validation : la période ne doit pas dépasser 1 an
            const diffTime = Math.abs(fin - debut);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 365) {
                newErrors.finPrd = 'La période ne peut pas dépasser 1 an';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        onSubmit(formData, periode?.id);
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
                        className="relative z-[10000] bg-white rounded-2xl w-full max-w-lg mx-auto shadow-2xl border border-pink-100"
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
                                        <Calendar className="h-5 w-5 text-pink-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                                            {periode ? 'Modifier période' : 'Nouvelle période'}
                                        </h2>
                                        <p className="text-gray-600 text-sm">
                                            {periode ? 'Mettez à jour la période' : 'Ajoutez une nouvelle période'}
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
                                        Libellé *
                                    </label>
                                    <input
                                        type="text"
                                        name="libellePrd"
                                        value={formData.libellePrd}
                                        onChange={handleChange}
                                        required
                                        disabled={isSubmitting}
                                        className={`w-full px-4 py-2.5 rounded-xl border ${errors.libellePrd ? 'border-red-300' : 'border-gray-300'} focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed`}
                                        placeholder="Ex: Semestre 1, Trimestre 1..."
                                    />
                                    {errors.libellePrd && (
                                        <p className="mt-1 text-sm text-red-600">{errors.libellePrd}</p>
                                    )}
                                </div>

                                {/* Dates */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Date de début */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date de début *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="date"
                                                name="debutPrd"
                                                value={formData.debutPrd}
                                                onChange={handleChange}
                                                required
                                                disabled={isSubmitting}
                                                className={`pl-10 w-full px-4 py-2.5 rounded-xl border ${errors.debutPrd ? 'border-red-300' : 'border-gray-300'} focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed`}
                                            />
                                        </div>
                                        {errors.debutPrd && (
                                            <p className="mt-1 text-sm text-red-600">{errors.debutPrd}</p>
                                        )}
                                    </div>

                                    {/* Date de fin */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Date de fin *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="date"
                                                name="finPrd"
                                                value={formData.finPrd}
                                                onChange={handleChange}
                                                required
                                                disabled={isSubmitting}
                                                className={`pl-10 w-full px-4 py-2.5 rounded-xl border ${errors.finPrd ? 'border-red-300' : 'border-gray-300'} focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed`}
                                            />
                                        </div>
                                        {errors.finPrd && (
                                            <p className="mt-1 text-sm text-red-600">{errors.finPrd}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Calcul de la durée */}
                                {formData.debutPrd && formData.finPrd && !errors.finPrd && (
                                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                        <p className="text-sm text-blue-700">
                                            <span className="font-medium">Durée : </span>
                                            {(() => {
                                                const debut = new Date(formData.debutPrd);
                                                const fin = new Date(formData.finPrd);
                                                const diffTime = Math.abs(fin - debut);
                                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                const diffMonths = Math.floor(diffDays / 30);
                                                
                                                if (diffDays === 1) return '1 jour';
                                                if (diffDays < 30) return `${diffDays} jours`;
                                                if (diffMonths === 1) return '1 mois';
                                                if (diffMonths < 12) return `${diffMonths} mois`;
                                                
                                                const diffYears = Math.floor(diffMonths / 12);
                                                return diffYears === 1 ? '1 an' : `${diffYears} ans`;
                                            })()}
                                        </p>
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
                                    disabled={isSubmitting}
                                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 disabled:from-pink-300 disabled:to-rose-400 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-pink-200/50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            {periode ? 'Modification...' : 'Création...'}
                                        </>
                                    ) : (
                                        <>
                                            {periode ? 'Modifier' : 'Créer'}
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

export default PeriodeModal;