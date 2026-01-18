import { LogIn, ChevronsDown } from "lucide-react";
import { Link } from 'react-router-dom';

const Hero = () => {

    return (
        <header 
            id="accueil"
            className="mt-10 relative bg-gradient-to-br from-white via-rose-50 to-pink-100 min-h-screen flex items-center overflow-hidden"
        >
            {/* Arrière-plan avec éléments décoratifs */}
            <div className="absolute inset-0">
                {/* Cercles décoratifs */}
                <div className="absolute top-10 left-10 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl"></div>
                {/* Motif SVG en arrière-plan */}
                <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#f472b6" strokeWidth="1"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>
            </div>

            <div className="container mx-auto px-4 py-20 relative z-10 w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Partie texte - centrée sur mobile */}
                    <div className="space-y-8 text-center lg:text-left lg:ml-20">
                        <h1 className="text-3xl md:text-5xl font-black leading-tight text-gray-900">
                            Simplifiez la{' '}
                            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                                gestion des notes
                            </span>
                            <br />dans votre établissement
                        </h1>

                        <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            EasyNotes - La plateforme tout-en-un pour les enseignants qui veulent évaluer, suivre et optimiser les performances de leurs étudiants efficacement
                        </p>

                        {/* Boutons de connexion et inscription */}
                        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link
                                to="/login"
                                className="group px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-lg 
                                           hover:from-pink-600 hover:to-rose-600 transition-all duration-300 
                                           shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span>Se connecter</span>
                            </Link>
                            
                            <a
                                href="#about"
                                className="group px-6 py-3 bg-white text-pink-500 border border-pink-200 font-semibold rounded-lg 
                                           hover:bg-pink-50 transition-all duration-300 
                                           shadow hover:shadow-md flex items-center justify-center gap-2"
                            >
                                <span>Découvrir</span>
                                <ChevronsDown className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            </a>
                        </div>
                    </div>

                    {/* Partie téléphone - centrée sur mobile */}
                    <div className="relative w-72 sm:w-80 h-[500px] sm:h-[550px] bg-gradient-to-br from-white to-rose-50 rounded-[3rem] p-3 shadow-2xl shadow-rose-200/50 transform hover:scale-105 transition-transform duration-500 mx-auto border border-rose-100">
                        <div className="bg-gradient-to-b from-white to-rose-50 h-full rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden border border-rose-100">
                            {/* Encoche du téléphone */}
                            <div className="absolute top-0 left-0 right-0 h-8 bg-white flex items-center justify-center rounded-t-[2.5rem] border-b border-rose-100">
                                <div className="w-24 h-5 bg-rose-100 rounded-full"></div>
                            </div>

                            {/* Contenu du téléphone */}
                            <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 space-y-6 sm:space-y-8 w-full mb-5">
                                {/* Logo/Image principale */}
                                <div className="relative group w-full flex justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-rose-200 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500 opacity-50 w-48 h-48 mx-auto"></div>
                                    <img 
                                        src="/bonhommes.png" 
                                        alt="Interface EasyNotes"
                                        className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl object-contain transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>

                                {/* Texte descriptif */}
                                <div className="text-center w-full">
                                    <div className="flex items-center justify-center">
                                        <img 
                                            src="/logoEasyNote-removebg-preview.png" 
                                            alt="Logo EasyNotes"
                                            className="relative w-20 h-20 sm:w-30 sm:h-30 rounded-2xl object-contain transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                            EasyNotes
                                        </h3>
                                    </div>
                                    
                                    <p className="text-gray-600 text-base px-4">
                                        Gérez les notes de vos étudiants en toute simplicité
                                    </p>
                                </div>
                            </div>

                            {/* Barre de navigation basse */}
                            <div className="absolute bottom-4 left-4 right-4 bg-white/90 rounded-full p-3 backdrop-blur-sm border border-rose-100 shadow-sm">
                                <div className="flex justify-around items-center">
                                    <div className="w-3 h-3 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full"></div>
                                    <div className="w-10 h-1 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full"></div>
                                    <div className="w-3 h-3 bg-gradient-to-r from-pink-200 to-rose-200 rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Hero;