import {
    Settings,
    BookOpen,
    GraduationCap,
    BarChart3,
    Shield,
    Users,
    User,
    Database,
    Eye,
    Clock,
    FileText,
    Rocket,
    Zap,
    BarChart
} from 'lucide-react';
import { steps } from '../../../data/data';
import { Link } from 'react-router-dom';

const Process = () => {
    // Mappage des noms d'icônes vers les composants
    const iconMap = {
        Settings,
        BookOpen,
        GraduationCap,
        BarChart3,
        Shield,
        Users,
        User,
        Database,
        Eye,
        Clock,
        FileText,
        BarChart
    };

    return (
        <section id="process" className="py-20 bg-gradient-to-b from-rose-50 to-white">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Accès simplifié pour <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">enseignants et étudiants</span>
                    </h2>
                    <p className="text-lg text-gray-600">
                        Deux portails personnalisés, quatre étapes clés pour une gestion académique efficace.
                    </p>
                </div>

                {/* Étapes du processus - 4 étapes en grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 relative">
                    {/* Ligne de connexion pour desktop */}
                    <div className="hidden lg:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-pink-500 via-emerald-500 to-blue-500 -translate-y-1/2 z-0"></div>

                    {steps.map((step, index) => {
                        const IconComponent = iconMap[step.iconName];
                        
                        return (
                            <div key={index} className="relative z-10">
                                <div className="text-center">
                                    <div className={`w-16 h-16 md:w-20 md:h-20 mx-auto rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center mb-6 relative`}>
                                        <div className="text-white">
                                            {IconComponent && <IconComponent className="w-6 h-6 md:w-8 md:h-8" />}
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-7 h-7 md:w-8 md:h-8 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-sm font-bold text-gray-700">
                                            {step.number}
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                                    <p className="text-gray-600 text-xs md:text-sm">{step.description}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA final */}
                <div className="text-center">
                    <div className="inline-block bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-2xl p-1">
                        <div className="bg-white rounded-xl p-8 max-w-2xl">
                            <Rocket className="w-12 h-12 text-pink-500 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Prêt à transformer votre établissement ?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Rejoignez les établissements qui ont déjà choisi EasyNotes pour simplifier 
                                leur gestion académique et se concentrer sur l'essentiel.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/login"
                                    className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold rounded-lg 
                                            hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Zap className="w-5 h-5" />
                                        Commencer maintenant
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Process;