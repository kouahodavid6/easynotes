import { Mail, MapPin, Facebook, Instagram, Twitter, GraduationCap, BookOpen } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-white to-rose-50 text-gray-900 py-16 border-t border-rose-100">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-12 mb-12">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
                                <GraduationCap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className='text-xl font-bold text-gray-900'>
                                    Easy<span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Notes</span>
                                </h1>
                                <p className="text-xs text-gray-500">Gestion de notes estudiantine</p>
                            </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            La plateforme tout-en-un pour les enseignants qui veulent évaluer, suivre et optimiser les performances de leurs étudiants efficacement.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="bg-pink-100 p-3 rounded-full hover:bg-pink-200 transition-colors duration-300 group">
                                <Facebook className="w-5 h-5 text-pink-600 group-hover:text-pink-700" />
                            </a>
                            <a href="#" className="bg-rose-100 p-3 rounded-full hover:bg-rose-200 transition-colors duration-300 group">
                                <Instagram className="w-5 h-5 text-rose-600 group-hover:text-rose-700" />
                            </a>
                            <a href="#" className="bg-pink-50 p-3 rounded-full hover:bg-pink-100 transition-colors duration-300 group">
                                <Twitter className="w-5 h-5 text-pink-500 group-hover:text-pink-600" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-pink-500" />
                            Navigation
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <a href="#accueil" className="text-gray-600 hover:text-pink-500 transition-colors duration-300 flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-pink-300"></div>
                                    Accueil
                                </a>
                            </li>
                            <li>
                                <a href="#about" className="text-gray-600 hover:text-pink-500 transition-colors duration-300 flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-pink-300"></div>
                                    À propos
                                </a>
                            </li>
                            <li>
                                <a href="#process" className="text-gray-600 hover:text-pink-500 transition-colors duration-300 flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-pink-300"></div>
                                    Processus
                                </a>
                            </li>
                            <li>
                                <a href="#faq" className="text-gray-600 hover:text-pink-500 transition-colors duration-300 flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-pink-300"></div>
                                    Faq
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-pink-500" />
                            Contact
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-4 h-4 text-pink-500" />
                                </div>
                                <div>
                                    <p className="text-gray-600 font-medium">Email</p>
                                    <a href="mailto:easynotes@gmail.com" className="text-gray-500 hover:text-pink-500 transition-colors">
                                        easynotes@gmail.com
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-4 h-4 text-rose-500" />
                                </div>
                                <div>
                                    <p className="text-gray-600 font-medium">Adresse</p>
                                    <p className="text-gray-500">Abidjan, Côte d'Ivoire</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-rose-200 pt-8">
                        <div className="text-center md:text-left">
                            <p className='text-gray-600 mb-2'>
                                Développé par :{' '}
                                <span 
                                    className='font-medium text-pink-600'
                                >
                                    David Kouaho
                                </span>
                            </p>
                            <p className="text-gray-500">
                                © {new Date().getFullYear()} EasyNotes. Tous droits réservés.
                            </p>
                        </div>

                    {/* Section éducative */}
                    <div className="mt-8 pt-6 border-t border-rose-100">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-gray-500 text-sm text-center md:text-left">
                                🎓 Partenaire officiel de plus de 10 Universités à travers Abidjan
                            </p>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-pink-400 to-rose-400 flex items-center justify-center">
                                    <GraduationCap className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-sm font-medium text-gray-700">Certifié éducation nationale</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;