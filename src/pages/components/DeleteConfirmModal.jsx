import { Trash2, X, AlertTriangle, Shield, Loader } from "lucide-react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DeleteConfirmModal = ({ 
    isOpen, 
    onConfirm, 
    onCancel, 
    entityName = "cet élément",
    isDeleting = false 
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                type: "spring",
                damping: 25,
                stiffness: 300
            }
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            transition: { duration: 0.2 }
        }
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const buttonVariants = {
        hover: { 
            scale: 1.05,
            transition: { duration: 0.2 }
        },
        tap: { 
            scale: 0.95,
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    {/* Overlay */}
                    <motion.div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={!isDeleting ? onCancel : undefined}
                        aria-hidden="true"
                        variants={overlayVariants}
                    />
                    
                    {/* Modal */}
                    <motion.div 
                        className="relative z-[10000] bg-white rounded-2xl w-full max-w-[95vw] sm:max-w-md mx-auto shadow-2xl border border-pink-100"
                        variants={modalVariants}
                    >
                        {/* En-tête */}
                        <div className="flex justify-between items-start p-4 sm:p-6 border-b border-pink-100">
                            <div className="flex items-start gap-3">
                                <motion.div
                                    className="p-2 rounded-xl bg-pink-50 mt-1 flex-shrink-0"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring" }}
                                >
                                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500" />
                                </motion.div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                                        Confirmer la suppression
                                    </h3>
                                    <p className="text-gray-600 text-xs sm:text-sm mt-1">
                                        {isDeleting ? 'Suppression en cours...' : 'Action irréversible'}
                                    </p>
                                </div>
                            </div>
                            {!isDeleting && (
                                <motion.button
                                    onClick={onCancel}
                                    className="p-1 sm:p-2 rounded-lg hover:bg-pink-50 text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0 ml-2"
                                    aria-label="Fermer"
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                                </motion.button>
                            )}
                        </div>

                        {/* Contenu */}
                        <div className="p-4 sm:p-6">
                            <div className="text-center mb-4 sm:mb-6">
                                <motion.div
                                    className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.3, type: "spring" }}
                                >
                                    {isDeleting ? (
                                        <Loader className="h-6 w-6 sm:h-8 sm:w-8 text-pink-500 animate-spin" />
                                    ) : (
                                        <Trash2 className="h-6 w-6 sm:h-8 sm:w-8 text-pink-500" />
                                    )}
                                </motion.div>
                                <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 px-2">
                                    {isDeleting ? 'Suppression en cours' : `Supprimer ${entityName} ?`}
                                </h4>
                                <p className="text-gray-600 text-xs sm:text-sm px-1">
                                    {isDeleting 
                                        ? 'Veuillez patienter pendant la suppression...'
                                        : 'Cette action supprimera définitivement l\'élément et toutes ses données associées. Vous ne pourrez pas annuler cette opération.'
                                    }
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                {!isDeleting && (
                                    <motion.button
                                        onClick={onCancel}
                                        className="flex-1 py-2 sm:py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        Annuler
                                    </motion.button>
                                )}
                                <motion.button
                                    onClick={onConfirm}
                                    disabled={isDeleting}
                                    className="flex-1 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 disabled:from-pink-300 disabled:to-rose-400 disabled:cursor-not-allowed transition-all font-medium text-sm sm:text-base shadow-lg hover:shadow-pink-200/50 flex items-center justify-center gap-2"
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                            Suppression...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                            Supprimer
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>

                        {/* Pied de page - caché pendant la suppression */}
                        {!isDeleting && (
                            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-pink-100 bg-pink-50/50 rounded-b-2xl">
                                <div className="flex items-center justify-center gap-2">
                                    <Shield className="h-3 w-3 text-pink-500 flex-shrink-0" />
                                    <p className="text-xs text-pink-600/70 text-center">
                                        Sécurité • Protection des données
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DeleteConfirmModal;