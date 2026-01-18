// /pages/Auth/Login.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useLogin } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [matricule, setMatricule] = useState('');
    const [showMatricule, setShowMatricule] = useState(false);
    const { login, isLoggingIn, loginError } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !matricule) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }
        
        login({ email, matricule });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-white flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-full max-w-md"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-rose-100 overflow-hidden"
                >
                  {/* En-tête colorée - Variante épurée */}
                  <div className="w-full bg-gradient-to-r from-pink-500 to-rose-500 p-8 rounded-b-lg shadow-xl relative overflow-hidden">
                    {/* Effet de dégradé supplémentaire */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

                    <div className="relative flex items-center justify-between">
                      {/* Section gauche : Bouton retour */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Link
                          to="/"
                          className="inline-flex items-center gap-2 bg-white hover:bg-pink-50 
                                    px-4 py-2.5 rounded-xl text-pink-600 font-medium
                                    hover:shadow-lg transition-all duration-300 group"
                        >
                          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        </Link>
                      </motion.div>

                      {/* Section centre : Titre principal */}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-center"
                      >
                        <h2 className="text-xl md:text-2xl font-bold text-white">
                          Connexion EasyNotes
                        </h2>
                        <p className="text-sm text-pink-100 mt-1">
                          Accédez à votre espace
                        </p>
                      </motion.div>

                      {/* Section droite : Logo + Nom */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-3"
                      >
                        <img
                          src="/logoEasyNote.png"
                          alt="EasyNotes Logo"
                          className="w-12 h-12 rounded-xl object-contain shadow-lg border-2 border-white/40 bg-white/20 p-1.5"
                        />
                      </motion.div>
                    </div>

                    {/* Ligne décorative en bas */}
                    <div className="mt-6 flex justify-center">
                      <div className="w-24 h-1 bg-white/40 rounded-full" />
                    </div>
                  </div>

                    {/* Formulaire */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Champ Email */}
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700">
                              Adresse Email Institutionnelle
                          </label>
                          <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full px-4 py-3 rounded-lg border border-rose-200 
                                      focus:border-pink-400 focus:ring-2 focus:ring-pink-100 
                                      outline-none transition-all duration-300
                                      placeholder:text-gray-400"
                              placeholder="exemple@universite.ci"
                              disabled={isLoggingIn}
                              required
                          />
                        </div>

                        {/* Champ Matricule */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Matricule
                            </label>
                            <div className="relative">
                              <input
                                  type={showMatricule ? "text" : "password"}
                                  value={matricule}
                                  onChange={(e) => setMatricule(e.target.value)}
                                  className="w-full px-4 py-3 rounded-lg border border-rose-200 
                                          focus:border-pink-400 focus:ring-2 focus:ring-pink-100 
                                          outline-none transition-all duration-300
                                          placeholder:text-gray-400"
                                  placeholder="Votre numéro de matricule"
                                  disabled={isLoggingIn}
                                  required
                              />
                              <button
                                  type="button"
                                  onClick={() => setShowMatricule(!showMatricule)}
                                  className="absolute right-4 top-1/2 transform -translate-y-1/2 
                                          text-gray-400 hover:text-pink-600 transition-colors"
                              >
                                  {showMatricule ? (
                                      <EyeOff className="w-5 h-5" />
                                  ) : (
                                      <Eye className="w-5 h-5" />
                                  )}
                              </button>
                            </div>
                        </div>

                        {/* Message d'erreur */}
                        <AnimatePresence>
                            {loginError && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700"
                                >
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        <span>{loginError.message || 'Erreur de connexion'}</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Bouton de connexion */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={isLoggingIn || !email || !matricule}
                            className={`w-full py-3.5 rounded-lg font-semibold transition-all duration-300 
                                    flex items-center justify-center gap-3 shadow-lg
                                    ${isLoggingIn || !email || !matricule
                                        ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                        : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white hover:shadow-xl'
                                    }`}
                        >
                            {isLoggingIn ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Connexion en cours...
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    Se connecter
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Informations utiles */}
                    <div className="px-8 pb-6 pt-4 border-t border-rose-100">
                        <div className="text-center">
                          <p className='text-sm text-gray-500'>Réservé uniquement aux étudiants et enseignants enregistrés</p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;