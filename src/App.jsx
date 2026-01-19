import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import NotFound from "./components/NotFound";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import AuthInitializer from "./components/AuthInitializer";
import UniversalLayout from "./components/layouts/UniversalLayout";

// Pages Admin
import AdminDashboard from "./pages/DashboardAdmin/AdminDashboard/AdminDashboard";
import AdminEnseignant from "./pages/DashboardAdmin/AdminEnseignant/AdminEnseignant";
import AdminClasse from "./pages/DashboardAdmin/AdminClasse/AdminClasse";
import AdminEtudiant from "./pages/DashboardAdmin/AdminEtudiant/AdminEtudiant";
import AdminPeriode from "./pages/DashboardAdmin/AdminPeriode/AdminPeriode";
import AdminMatiere from "./pages/DashboardAdmin/AdminMatiere/AdminMatiere";

// Pages Enseignant
import EnseignantDashboard from "./pages/DashboardEnseignant/EnseignantDashboard/EnseignantDashboard";
import EnseignantNotes from "./pages/DashboardEnseignant/EnseignantNotes/EnseignantNotes";
// import EnseignantCours from "./pages/DashboardEnseignant/EnseignantCours/EnseignantCours";
// import EnseignantDevoirs from "./pages/DashboardEnseignant/EnseignantDevoirs/EnseignantDevoirs";
// import EnseignantStatistiques from "./pages/DashboardEnseignant/EnseignantStatistiques/EnseignantStatistiques";

// Pages Étudiant
import EtudiantDashboard from "./pages/DashboardEtudiant/EtudiantDashboard/EtudiantDashboard";
// import EtudiantNotes from "./pages/DashboardEtudiant/EtudiantNotes/EtudiantNotes";

// Configuration AOS
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";

// Toaster
import AppToaster from "./components/AppToaster";

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
                    
                    <AuthInitializer>
                        <main>
                            <Routes>
                                {/* Routes publiques */}
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
                                
                                {/* Routes Admin */}
                                <Route 
                                    path="/admin/dashboard" 
                                    element={
                                        <PrivateRoute requiredRole="admin">
                                            <UniversalLayout>
                                                <AdminDashboard />
                                            </UniversalLayout>
                                        </PrivateRoute>
                                    } 
                                />
                                <Route 
                                    path="/admin/enseignant" 
                                    element={
                                        <PrivateRoute requiredRole="admin">
                                            <UniversalLayout>
                                                <AdminEnseignant />
                                            </UniversalLayout>
                                        </PrivateRoute>
                                    } 
                                />
                                <Route 
                                    path="/admin/classe" 
                                    element={
                                        <PrivateRoute requiredRole="admin">
                                            <UniversalLayout>
                                                <AdminClasse />
                                            </UniversalLayout>
                                        </PrivateRoute>
                                    } 
                                />
                                <Route 
                                    path="/admin/etudiant" 
                                    element={
                                        <PrivateRoute requiredRole="admin">
                                            <UniversalLayout>
                                                <AdminEtudiant />
                                            </UniversalLayout>
                                        </PrivateRoute>
                                    } 
                                />
                                <Route 
                                    path="/admin/periode" 
                                    element={
                                        <PrivateRoute requiredRole="admin">
                                            <UniversalLayout>
                                                <AdminPeriode />
                                            </UniversalLayout>
                                        </PrivateRoute>
                                    } 
                                />
                                <Route 
                                    path="/admin/matiere" 
                                    element={
                                        <PrivateRoute requiredRole="admin">
                                            <UniversalLayout>
                                                <AdminMatiere />
                                            </UniversalLayout>
                                        </PrivateRoute>
                                    } 
                                />



                                {/* Routes Enseignant */}
                                <Route 
                                    path="/enseignant/dashboard" 
                                    element={
                                        <PrivateRoute requiredRole="enseignant">
                                            <UniversalLayout>
                                                <EnseignantDashboard />
                                            </UniversalLayout>
                                        </PrivateRoute>
                                    } 
                                />
                                <Route 
                                    path="/enseignant/notes" 
                                    element={
                                        <PrivateRoute requiredRole="enseignant">
                                            <UniversalLayout>
                                                <EnseignantNotes />
                                            </UniversalLayout>
                                        </PrivateRoute>
                                    } 
                                />



                                {/* Routes Étudiant */}
                                <Route 
                                    path="/etudiant/dashboard" 
                                    element={
                                        <PrivateRoute requiredRole="etudiant">
                                            <UniversalLayout>
                                                <EtudiantDashboard />
                                            </UniversalLayout>
                                        </PrivateRoute>
                                    } 
                                />
                                {/* <Route 
                                    path="/etudiant/notes" 
                                    element={
                                        <PrivateRoute requiredRole="etudiant">
                                            <UniversalLayout>
                                                <EtudiantNotes />
                                            </UniversalLayout>
                                        </PrivateRoute>
                                    } 
                                /> */}

                                {/* Routes communes */}
                                {/* <Route 
                                    path=":role/profil" 
                                    element={
                                        <PrivateRoute>
                                            <UniversalLayout>
                                                <div>Page de profil</div>
                                            </UniversalLayout>
                                        </PrivateRoute>
                                    } 
                                />
                                <Route 
                                    path=":role/parametres" 
                                    element={
                                        <PrivateRoute>
                                            <UniversalLayout>
                                                <div>Page des paramètres</div>
                                            </UniversalLayout>
                                        </PrivateRoute>
                                    } 
                                />
                                <Route 
                                    path=":role/notifications" 
                                    element={
                                        <PrivateRoute>
                                            <UniversalLayout>
                                                <div>Page des notifications</div>
                                            </UniversalLayout>
                                        </PrivateRoute>
                                    } 
                                /> */}
                                
                                {/* Routes 404 */}
                                <Route path="/not-found" element={<NotFound />} />
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