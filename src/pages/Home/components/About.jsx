import { 
    Target, 
    CheckCircle,
    Shield,
    Zap,
    BarChart3,
    Heart,
    Rocket
} from 'lucide-react';

const About = () => {
    return (
        <section id="about" className="py-16 md:py-20 bg-gradient-to-b from-white via-rose-50/30 to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Titre */}
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        À <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">Propos</span>
                    </h2>
                    <p className="text-gray-600 text-base md:text-lg lg:text-xl max-w-2xl mx-auto px-4">
                        Découvrez l'essence d'EasyNotes et pourquoi nous sommes la solution idéale 
                        pour votre établissement
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
                    {/* Colonne gauche - Mission & Vision */}
                    <div className="space-y-6 md:space-y-8">
                        {/* C'est quoi EasyNotes ? */}
                        <div className="group relative">
                            <div className="absolute -inset-2 bg-gradient-to-r from-pink-500/5 to-rose-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                            
                            <div className="relative bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border border-rose-100 shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4 md:gap-6 mb-6">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-md flex-shrink-0 mx-auto sm:mx-0">
                                        <Target className="w-6 h-6 md:w-7 md:h-7 text-white" />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">C'est quoi EasyNotes ?</h3>
                                        <div className="w-12 h-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full mx-auto sm:mx-0"></div>
                                    </div>
                                </div>
                                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                                    Une plateforme de gestion de notes <span className="font-semibold text-pink-500">intelligente</span> conçue 
                                    exclusivement pour les établissements scolaires. Elle offre à chaque acteur 
                                    une expérience personnalisée avec des <span className="font-semibold text-blue-500">permissions adaptées</span> à son rôle dans l'écosystème éducatif.
                                </p>
                            </div>
                        </div>

                        {/* Mission */}
                        <div className="group relative">
                            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                            
                            <div className="relative bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4 md:gap-6 mb-6">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center shadow-md flex-shrink-0 mx-auto sm:mx-0">
                                        <Rocket className="w-6 h-6 md:w-7 md:h-7 text-white" />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Notre mission</h3>
                                        <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mx-auto sm:mx-0"></div>
                                    </div>
                                </div>
                                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                                    <span className="font-semibold text-blue-500">Simplifier radicalement</span> la gestion académique en éliminant 
                                    les tâches administratives répétitives. Nous visons à créer un environnement 
                                    où chaque minute est consacrée à l'<span className="font-semibold text-emerald-500">enseignement</span> et à 
                                    l'<span className="font-semibold text-emerald-500">apprentissage</span>, et non à la paperasse.
                                </p>
                            </div>
                        </div>

                        {/* Vision */}
                        <div className="group relative">
                            <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                            
                            <div className="relative bg-white rounded-xl md:rounded-2xl p-6 md:p-8 border border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-start gap-4 md:gap-6 mb-6">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-md flex-shrink-0 mx-auto sm:mx-0">
                                        <Heart className="w-6 h-6 md:w-7 md:h-7 text-white" />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Notre vision</h3>
                                        <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto sm:mx-0"></div>
                                    </div>
                                </div>
                                <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                                    Imaginer un futur éducatif où la <span className="font-semibold text-emerald-500">technologie</span> sert 
                                    véritablement la pédagogie. Nous aspirons à une école numérique où 
                                    la collaboration est fluide, les données sont exploitables et 
                                    chaque étudiant peut atteindre son <span className="font-semibold text-pink-500">plein potentiel</span>.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Colonne droite - Pourquoi choisir EasyNotes */}
                    <div className="relative">
                        {/* Élément décoratif flottant (caché sur mobile) */}
                        <div className="hidden lg:block absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-r from-pink-300/20 to-rose-300/20 rounded-full blur-xl"></div>
                        
                        <div className="lg:sticky lg:top-24">
                            {/* En-tête */}
                            <div className="mb-8 md:mb-10">
                                <div className="inline-block mb-4">
                                    <div className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-semibold rounded-full shadow-lg">
                                        POURQUOI NOUS CHOISIR
                                    </div>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                                    L'excellence <span className="text-pink-500">EasyNotes</span>
                                </h3>
                                <p className="text-gray-600 text-base md:text-lg">
                                    Les raisons qui font de nous le partenaire idéal pour la transformation 
                                    numérique de votre établissement
                                </p>
                            </div>

                            {/* Points */}
                            <div className="space-y-4 md:space-y-6">
                                {/* Point 1 */}
                                <div className="group relative overflow-hidden bg-white rounded-xl p-5 md:p-6 border border-rose-100 shadow-md hover:shadow-lg hover:border-pink-200 transition-all duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 to-rose-500/0 group-hover:from-pink-500/5 group-hover:to-rose-500/5 transition-all duration-500 -z-10"></div>
                                    <div className="relative flex flex-col sm:flex-row sm:items-start gap-4">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0 mx-auto sm:mx-0">
                                            <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Sécurité absolue</h4>
                                            <p className="text-gray-600 text-sm md:text-base">
                                                Protection maximale avec chiffrement de bout en bout, 
                                                conformité RGPD stricte et authentification à plusieurs facteurs. 
                                                Vos données sensibles sont en sécurité totale.
                                            </p>
                                        </div>
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0 hidden sm:block" />
                                    </div>
                                </div>

                                {/* Point 2 */}
                                <div className="group relative overflow-hidden bg-white rounded-xl p-5 md:p-6 border border-rose-100 shadow-md hover:shadow-lg hover:border-pink-200 transition-all duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 to-rose-500/0 group-hover:from-pink-500/5 group-hover:to-rose-500/5 transition-all duration-500 -z-10"></div>
                                    <div className="relative flex flex-col sm:flex-row sm:items-start gap-4">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0 mx-auto sm:mx-0">
                                            <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Productivité optimale</h4>
                                            <p className="text-gray-600 text-sm md:text-base">
                                                Automatisation intelligente qui réduit le temps administratif de 70%. 
                                                Saisie ultra-rapide, bulletins générés automatiquement, 
                                                analyses instantanées pour des décisions éclairées.
                                            </p>
                                        </div>
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0 hidden sm:block" />
                                    </div>
                                </div>

                                {/* Point 3 */}
                                <div className="group relative overflow-hidden bg-white rounded-xl p-5 md:p-6 border border-rose-100 shadow-md hover:shadow-lg hover:border-pink-200 transition-all duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 to-rose-500/0 group-hover:from-pink-500/5 group-hover:to-rose-500/5 transition-all duration-500 -z-10"></div>
                                    <div className="relative flex flex-col sm:flex-row sm:items-start gap-4">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0 mx-auto sm:mx-0">
                                            <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Intelligence des données</h4>
                                            <p className="text-gray-600 text-sm md:text-base">
                                                Tableaux de bord sophistiqués, analyses prédictives et visualisations 
                                                avancées. Transformez vos données académiques en insights actionnables 
                                                pour améliorer les performances.
                                            </p>
                                        </div>
                                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0 hidden sm:block" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;