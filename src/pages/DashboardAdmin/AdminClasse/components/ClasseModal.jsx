import { useState, useEffect } from 'react';
import { X, BookOpen, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

const ClasseModal = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    isSubmitting = false,
    classe = null // Pour l'édition
}) => {
    const [formData, setFormData] = useState({
        libelleCl: '',
        niveauCl: ''
    });

    const niveauxOptions = [
        'Licence 1', 'Licence 2', 'Licence 3',
        'Master 1', 'Master 2',
        'Doctorat 1', 'Doctorat 2', 'Doctorat 3',
        'BTS 1', 'BTS 2',
        'Prépa 1', 'Prépa 2',
        'Terminale', 'Première', 'Seconde'
    ];

    // Initialiser les données si on est en mode édition
    useEffect(() => {
        if (classe) {
            setFormData({
                libelleCl: classe.libelleCl || '',
                niveauCl: classe.niveauCl || ''
            });
        } else {
            setFormData({
                libelleCl: '',
                niveauCl: ''
            });
        }
    }, [classe, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation des champs requis
        if (!formData.libelleCl.trim() || !formData.niveauCl.trim()) {
            toast.error('Veuillez remplir tous les champs obligatoires');
            return;
        }

        onSubmit(formData, classe?.id);
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
                        className="relative z-[10000] bg-white rounded-2xl w-full max-w-md mx-auto shadow-2xl border border-pink-100"
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
                                            {classe ? 'Modifier la classe' : 'Nouvelle classe'}
                                        </h2>
                                        <p className="text-gray-600 text-sm">
                                            {classe ? 'Mettez à jour les informations' : 'Ajoutez une nouvelle classe'}
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
                            {/* Libellé de la classe */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Libellé de la classe *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <BookOpen className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="libelleCl"
                                        value={formData.libelleCl}
                                        onChange={handleChange}
                                        required
                                        disabled={isSubmitting}
                                        className="pl-10 w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                                        placeholder="Ex: Génie Informatique, MIAGE, Mathématiques..."
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Nom complet de la filière ou spécialité
                                </p>
                            </div>

                            {/* Niveau */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Niveau *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <GraduationCap className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <select
                                        name="niveauCl"
                                        value={formData.niveauCl}
                                        onChange={handleChange}
                                        required
                                        disabled={isSubmitting}
                                        className="pl-10 w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed appearance-none"
                                    >
                                        <option value="">Sélectionnez un niveau</option>
                                        {niveauxOptions.map((niveau) => (
                                            <option key={niveau} value={niveau}>
                                                {niveau}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <div className="h-4 w-4 text-gray-400 transform rotate-90">›</div>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 pt-4 border-t border-pink-100">
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
                                            {classe ? 'Modification...' : 'Création...'}
                                        </>
                                    ) : (
                                        <>
                                            {classe ? 'Modifier' : 'Créer'}
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

export default ClasseModal;