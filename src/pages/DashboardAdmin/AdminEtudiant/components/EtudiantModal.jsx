import { useState, useEffect } from 'react';
import { X, Upload, User, Mail, Phone, Camera, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { urlToFile } from '../../../../utils/fileUtils';

const EtudiantModal = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    isSubmitting = false,
    etudiant = null,
    classes = [] // Liste des classes pour le select
}) => {
    const [formData, setFormData] = useState({
        nomEtu: '',
        prenomEtu: '',
        telEtu: '',
        email: '',
        photo: null,
        classe_id: ''
    });
    const [previewUrl, setPreviewUrl] = useState('');
    const [isLoadingExistingPhoto, setIsLoadingExistingPhoto] = useState(false);

    // Initialiser les données si on est en mode édition
    useEffect(() => {
        const initializeFormData = async () => {
            if (etudiant) {
                // Initialiser les champs texte
                setFormData({
                    nomEtu: etudiant.nomEtu || '',
                    prenomEtu: etudiant.prenomEtu || '',
                    telEtu: etudiant.telEtu || '',
                    email: etudiant.email || '',
                    photo: null,
                    classe_id: etudiant.classe?.id || etudiant.classe_id || ''
                });

                // Charger la photo existante si elle existe
                if (etudiant.photo) {
                    setIsLoadingExistingPhoto(true);
                    try {
                        // Convertir l'URL en File
                        const photoFile = await urlToFile(
                            etudiant.photo,
                            `photo_${etudiant.id}.jpg`,
                            'image/jpeg'
                        );
                        
                        setFormData(prev => ({
                            ...prev,
                            photo: photoFile
                        }));
                        setPreviewUrl(etudiant.photo);
                    } catch (error) {
                        console.error('Erreur chargement photo:', error);
                        // Si erreur, afficher quand même l'URL pour la preview
                        setPreviewUrl(etudiant.photo);
                    } finally {
                        setIsLoadingExistingPhoto(false);
                    }
                } else {
                    setPreviewUrl('');
                }
            } else {
                // Réinitialiser pour un nouvel étudiant
                setFormData({
                    nomEtu: '',
                    prenomEtu: '',
                    telEtu: '',
                    email: '',
                    photo: null,
                    classe_id: ''
                });
                setPreviewUrl('');
            }
        };

        if (isOpen) {
            initializeFormData();
        }
    }, [etudiant, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Valider la taille du fichier (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Le fichier est trop volumineux (max 5MB)');
                return;
            }

            // Valider le type de fichier
            if (!file.type.startsWith('image/')) {
                alert('Veuillez sélectionner une image valide');
                return;
            }

            setFormData(prev => ({
                ...prev,
                photo: file
            }));
            
            // Créer une preview locale
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation des champs requis
        if (!formData.nomEtu.trim() || !formData.prenomEtu.trim() || 
            !formData.telEtu.trim() || !formData.email.trim() || 
            !formData.classe_id) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Veuillez entrer une adresse email valide');
            return;
        }

        // Validation téléphone (10 chiffres)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.telEtu.replace(/\s/g, ''))) {
            alert('Veuillez entrer un numéro de téléphone valide (10 chiffres)');
            return;
        }
        
        // Créer FormData pour l'upload
        const formDataToSend = new FormData();
        formDataToSend.append('nomEtu', formData.nomEtu.trim());
        formDataToSend.append('prenomEtu', formData.prenomEtu.trim());
        formDataToSend.append('telEtu', formData.telEtu.trim());
        formDataToSend.append('email', formData.email.trim());
        formDataToSend.append('classe_id', formData.classe_id);
        
        // Ajouter la photo seulement si elle a été modifiée ou si c'est un nouvel étudiant
        if (formData.photo) {
            formDataToSend.append('photo', formData.photo);
        }

        onSubmit(formDataToSend, etudiant?.id);
    };

    const handleRemovePhoto = () => {
        setFormData(prev => ({
            ...prev,
            photo: null
        }));
        setPreviewUrl('');
        // Réinitialiser l'input file
        const fileInput = document.getElementById('photo-upload');
        if (fileInput) {
            fileInput.value = '';
        }
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
                                        <User className="h-5 w-5 text-pink-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                                            {etudiant ? 'Modifier étudiant' : 'Nouvel étudiant'}
                                        </h2>
                                        <p className="text-gray-600 text-sm">
                                            {etudiant ? 'Mettez à jour les informations' : 'Ajoutez un nouvel étudiant'}
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
                            {/* Photo upload */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Photo de profil
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-xl bg-pink-50 border-2 border-dashed border-pink-200 flex items-center justify-center overflow-hidden">
                                            {isLoadingExistingPhoto ? (
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
                                            ) : previewUrl ? (
                                                <img 
                                                    src={previewUrl} 
                                                    alt="Preview" 
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Camera className="h-8 w-8 text-pink-300" />
                                            )}
                                        </div>
                                        
                                        {previewUrl && (
                                            <button
                                                type="button"
                                                onClick={handleRemovePhoto}
                                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 transition-colors"
                                                title="Supprimer la photo"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        )}
                                        
                                        <label 
                                            htmlFor="photo-upload"
                                            className="absolute bottom-0 right-0 bg-white border border-pink-200 rounded-full p-1.5 shadow-sm cursor-pointer hover:bg-pink-50 transition-colors"
                                            title={previewUrl ? "Changer la photo" : "Ajouter une photo"}
                                        >
                                            <Upload className="h-3 w-3 text-pink-500" />
                                        </label>
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            id="photo-upload"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            disabled={isSubmitting || isLoadingExistingPhoto}
                                        />
                                        <div>
                                            <p className="text-sm text-gray-600 mb-1">
                                                {etudiant?.photo ? 'Photo actuelle' : 'Ajouter une photo'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, JPEG (max 5MB)
                                            </p>
                                            {previewUrl && (
                                                <button
                                                    type="button"
                                                    onClick={handleRemovePhoto}
                                                    className="mt-2 text-xs text-red-500 hover:text-red-600"
                                                >
                                                    Supprimer la photo
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Grid de champs */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                {/* Nom */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nom *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="nomEtu"
                                            value={formData.nomEtu}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting}
                                            className="pl-10 w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                                            placeholder="Dupont"
                                        />
                                    </div>
                                </div>

                                {/* Prénom */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Prénom *
                                    </label>
                                    <input
                                        type="text"
                                        name="prenomEtu"
                                        value={formData.prenomEtu}
                                        onChange={handleChange}
                                        required
                                        disabled={isSubmitting}
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                                        placeholder="Jean"
                                    />
                                </div>

                                {/* Téléphone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Téléphone *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            name="telEtu"
                                            value={formData.telEtu}
                                            onChange={handleChange}
                                            required
                                            pattern="[0-9]{10}"
                                            disabled={isSubmitting}
                                            className="pl-10 w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                                            placeholder="0102030405"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">10 chiffres sans espaces</p>
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting}
                                            className="pl-10 w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
                                            placeholder="exemple@email.com"
                                        />
                                    </div>
                                </div>

                                {/* Classe */}
                                <div className="sm:col-span-2">
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
                                            className="pl-10 w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed appearance-none"
                                        >
                                            <option value="">Sélectionnez une classe</option>
                                            {classes.map((classe) => (
                                                <option key={classe.id} value={classe.id}>
                                                    {classe.libelleCl} - {classe.niveauCl}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {classes.length === 0 && (
                                        <p className="text-xs text-yellow-600 mt-1">
                                            Aucune classe disponible. Veuillez d'abord créer une classe.
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Informations générées automatiquement */}
                            {etudiant && (
                                <div className="mb-6 p-3 bg-pink-50 rounded-lg border border-pink-100">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Matricule :</span> {etudiant.matricule}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Généré automatiquement et ne peut pas être modifié
                                    </p>
                                </div>
                            )}

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
                                    disabled={isSubmitting || (classes.length === 0 && !etudiant)}
                                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 disabled:from-pink-300 disabled:to-rose-400 disabled:cursor-not-allowed transition-all font-medium shadow-lg hover:shadow-pink-200/50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            {etudiant ? 'Modification...' : 'Création...'}
                                        </>
                                    ) : (
                                        <>
                                            {etudiant ? 'Modifier' : 'Créer'}
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

export default EtudiantModal;