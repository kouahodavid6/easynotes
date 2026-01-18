import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, School, Calculator, PenTool, Search, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white via-rose-50 to-pink-100 text-gray-900 px-4 py-2 relative overflow-hidden">
            {/* Effets de fond décoratifs */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-pink-200/30 rounded-full blur-xl"></div>
            <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-rose-200/20 rounded-full blur-xl"></div>
            <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-pink-300/10 rounded-full blur-lg"></div>
            
            <motion.div 
                className="max-w-md text-center relative z-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                {/* Icône éducative */}
                <motion.div 
                    className="flex justify-center mb-6"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                >
                    <img 
                        src="/logoEasyNote-removebg-preview.png" 
                        alt="Logo EasyNotes"
                        className="relative w-20 h-20 sm:w-40 sm:h-40 rounded-2xl object-contain transform group-hover:scale-105 transition-transform duration-500"
                    />
                </motion.div>

                {/* Code erreur */}
                <motion.h1 
                    className="text-8xl font-black mb-4 bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }}
                >
                    404
                </motion.h1>

                {/* Titre */}
                <motion.h2 
                    className="text-3xl font-bold mb-3 text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    Page non trouvée
                </motion.h2>

                {/* Message */}
                <motion.p 
                    className="mb-8 text-gray-600 text-lg leading-relaxed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    Oups ! Cette page semble avoir été archivée ou n'existe plus. 
                    Revenons à l'espace de gestion de notes EasyNotes.
                </motion.p>

                {/* Bouton de retour */}
                <Link
                    to="/"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-pink-300/50 transform hover:-translate-y-1"
                >
                    <BookOpen className="h-5 w-5" />
                    Retour à l'accueil
                </Link>

                {/* Message secondaire avec logo */}
                <motion.div 
                    className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">E</span>
                    </div>
                    <span>
                        Continuez votre expérience avec <span className="font-medium text-pink-500">EasyNotes</span>
                    </span>
                </motion.div>
            </motion.div>

            {/* Décorations bas de page éducatives */}
            <div className="absolute bottom-10 left-10 opacity-20">
                <Calculator className="h-8 w-8 text-pink-400" />
            </div>
            <div className="absolute bottom-20 right-10 opacity-20">
                <PenTool className="h-6 w-6 text-rose-400" />
            </div>

            {/* Éléments décoratifs supplémentaires éducatifs */}
            <div className="absolute top-10 right-16 opacity-15">
                <BookOpen className="h-10 w-10 text-pink-500" />
            </div>
            
            <div className="absolute top-20 left-16 opacity-15">
                <School className="h-8 w-8 text-rose-500" />
            </div>
            
            <div className="absolute bottom-32 left-20 opacity-15">
                <Search className="h-7 w-7 text-pink-400" />
            </div>
            
            <div className="absolute top-32 right-20 opacity-15">
                <GraduationCap className="h-9 w-9 text-rose-500" />
            </div>

            {/* Logo EasyNotes en décoratif */}
            <div className="absolute bottom-10 right-20 opacity-10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">E</span>
                </div>
            </div>

            {/* Formes géométriques décoratives */}
            <div className="absolute top-40 left-1/4 opacity-5">
                <div className="w-16 h-16 border-2 border-pink-300 rounded-2xl rotate-45"></div>
            </div>
            <div className="absolute bottom-40 right-1/4 opacity-5">
                <div className="w-12 h-12 border-2 border-rose-300 rounded-full"></div>
            </div>
        </div>
    );
};

export default NotFound;