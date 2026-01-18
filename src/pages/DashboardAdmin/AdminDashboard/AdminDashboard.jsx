import { useState } from 'react';
import { Users, School2Icon, GraduationCap, BookOpen, TrendingUp, Calendar } from 'lucide-react';
import PageHeader from '../../../components/PageHeader';

// Composant StatCard pour les statistiques
const StatCard = ({ title, value, icon: Icon, iconBgColor, subtitle, isLoading }) => {
    return (
        <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-gray-500 text-sm mb-1">{title}</p>
                    {isLoading ? (
                        <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                        <p className="text-3xl font-bold text-gray-900">{value}</p>
                    )}
                    {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconBgColor} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    // Données de démo (tu remplaceras par tes vrais hooks plus tard)
    const [stats] = useState({
        enseignants: 24,
        etudiants: 356,
        classes: 12,
        matieres: 18
    });

    // Activité récente
    const recentActivity = [
        { action: 'Nouvel enseignant ajouté', user: 'Prof. Martin Dupont', time: 'Il y a 5 min' },
        { action: 'Note saisie', user: 'Mathématiques - Terminale A', time: 'Il y a 12 min' },
        { action: 'Nouvel étudiant inscrit', user: 'Marie Curie', time: 'Il y a 1h' },
        { action: 'Classe créée', user: 'Première B', time: 'Il y a 2h' },
    ];

    // Top classes
    const topClasses = [
        { name: 'Terminale A', avg: 16.5, students: 32 },
        { name: 'Première C', avg: 15.8, students: 28 },
        { name: 'Seconde B', avg: 15.2, students: 30 },
        { name: 'Terminale B', avg: 14.9, students: 29 },
    ];

    return (
        <div className="space-y-6">
            <PageHeader 
                title="Tableau de bord"
                subtitle="Vue d'ensemble de votre établissement"
            />

            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Enseignants"
                    value={stats.enseignants}
                    icon={Users}
                    iconBgColor="from-pink-500 to-rose-500"
                    subtitle="Enseignants actifs"
                />
                
                <StatCard
                    title="Étudiants"
                    value={stats.etudiants}
                    icon={GraduationCap}
                    iconBgColor="from-orange-500 to-amber-500"
                    subtitle="Étudiants inscrits"
                />
                
                <StatCard
                    title="Classes"
                    value={stats.classes}
                    icon={School2Icon}
                    iconBgColor="from-emerald-500 to-teal-500"
                    subtitle="Classes actives"
                />
                
                <StatCard
                    title="Matières"
                    value={stats.matieres}
                    icon={BookOpen}
                    iconBgColor="from-blue-500 to-cyan-500"
                    subtitle="Matières enseignées"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Activité récente */}
                <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-gray-900 text-xl font-bold">Activité récente</h2>
                        <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        {recentActivity.map((item, index) => (
                            <div key={index} className="flex items-start gap-4 p-3 rounded-lg hover:bg-pink-50 transition-colors">
                                <div className="w-2 h-2 rounded-full bg-pink-500 mt-2" />
                                <div className="flex-1">
                                    <p className="text-gray-900 font-medium">{item.action}</p>
                                    <p className="text-gray-500 text-sm">{item.user}</p>
                                </div>
                                <span className="text-gray-400 text-xs">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top classes par moyenne */}
                <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-gray-900 text-xl font-bold">Top Classes</h2>
                        <TrendingUp className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-4">
                        {topClasses.map((classe, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-pink-50 transition-colors">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-900 font-medium">{classe.name}</p>
                                    <p className="text-gray-500 text-sm">{classe.students} étudiants</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-900 font-bold">{classe.avg}/20</p>
                                    <p className="text-gray-400 text-xs">Moyenne</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100">
                <h2 className="text-gray-900 text-xl font-bold mb-4">Actions rapides</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="bg-white p-4 rounded-xl border border-pink-100 hover:shadow-md transition-all duration-300 text-left">
                        <Users className="w-8 h-8 text-pink-500 mb-2" />
                        <p className="font-medium text-gray-900">Ajouter un enseignant</p>
                        <p className="text-gray-500 text-sm mt-1">Créer un nouveau compte enseignant</p>
                    </button>
                    
                    <button className="bg-white p-4 rounded-xl border border-pink-100 hover:shadow-md transition-all duration-300 text-left">
                        <GraduationCap className="w-8 h-8 text-orange-500 mb-2" />
                        <p className="font-medium text-gray-900">Inscrire un étudiant</p>
                        <p className="text-gray-500 text-sm mt-1">Ajouter un nouvel étudiant</p>
                    </button>
                    
                    <button className="bg-white p-4 rounded-xl border border-pink-100 hover:shadow-md transition-all duration-300 text-left">
                        <BookOpen className="w-8 h-8 text-emerald-500 mb-2" />
                        <p className="font-medium text-gray-900">Créer une matière</p>
                        <p className="text-gray-500 text-sm mt-1">Ajouter une nouvelle matière</p>
                    </button>
                    
                    <button className="bg-white p-4 rounded-xl border border-pink-100 hover:shadow-md transition-all duration-300 text-left">
                        <Calendar className="w-8 h-8 text-blue-500 mb-2" />
                        <p className="font-medium text-gray-900">Planifier période</p>
                        <p className="text-gray-500 text-sm mt-1">Définir une période scolaire</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;