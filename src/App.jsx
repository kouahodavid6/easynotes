import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import NotFound from "./components/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import AuthInitializer from "./components/AuthInitializer";
import AdminLayout from "./pages/DashboardAdmin/layouts/AdminLayout";
import AdminDashboard from "./pages/DashboardAdmin/AdminDashboard/AdminDashboard";
import AdminEnseignant from "./pages/DashboardAdmin/AdminEnseignant/AdminEnseignant";

import EnseignantDashboard from "./pages/DashboardEnseignant/EnseignantDashboard";

import EtudiantDashboard from "./pages/DashboardEtudiant/EtudiantDashboard";

// Configuration AOS
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";

// Toaster
import AppToaster from "./components/AppToaster";

// Création du client React Query
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000,
        },
    },
});

function App() {
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            mirror: false,
        });
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <AppToaster />
                    
                    {/* Initialiseur d'authentification pour la sécurité globale */}
                    <AuthInitializer>
                        <main>
                            <Routes>
                                {/* Routes publiques - Protégées avec PublicRoute */}
                                <Route 
                                    path="/" 
                                    element={
                                        <PublicRoute>
                                            <Home />
                                        </PublicRoute>
                                    } 
                                />
                                
                                <Route 
                                    path="/login" 
                                    element={
                                        <PublicRoute>
                                            <Login />
                                        </PublicRoute>
                                    } 
                                />
                                
                                {/* Routes admin - CHANGER ICI */}
                                <Route 
                                    path="/admin/dashboard" 
                                    element={
                                        <PrivateRoute requiredRole="admin">
                                            <AdminLayout>
                                                <AdminDashboard />
                                            </AdminLayout>
                                        </PrivateRoute>
                                    } 
                                />

                                <Route 
                                    path="/admin/enseignant" 
                                    element={
                                        <PrivateRoute requiredRole="admin">
                                            <AdminLayout>
                                                <AdminEnseignant />
                                            </AdminLayout>
                                        </PrivateRoute>
                                    } 
                                />
                                
                                {/* Routes enseignant */}
                                <Route 
                                    path="/enseignant/dashboard" 
                                    element={
                                        <PrivateRoute requiredRole="enseignant">
                                            <EnseignantDashboard />
                                        </PrivateRoute>
                                    } 
                                />
                                
                                {/* Routes étudiant */}
                                <Route 
                                    path="/etudiant/dashboard" 
                                    element={
                                        <PrivateRoute requiredRole="etudiant">
                                            <EtudiantDashboard />
                                        </PrivateRoute>
                                    } 
                                />
                                
                                {/* Route 404 personnalisée */}
                                <Route path="/not-found" element={<NotFound />} />
                                
                                {/* Catch-all route - redirige vers 404 */}
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </main>
                    </AuthInitializer>
                </div>
            </Router>
        </QueryClientProvider>
    );
}

export default App;