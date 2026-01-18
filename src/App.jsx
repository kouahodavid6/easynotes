// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import NotFound from "./components/NotFound";
import PrivateRoute from "./components/PrivateRoute";

// Dashboards
import AdminDashboard from "./pages/DashboardAdmin/AdminDashboard";
import EnseignantDashboard from "./pages/DashboardEnseignant/EnseignantDashboard";
import EtudiantDashboard from "./pages/DashboardEtudiant/etudiantDashboard";

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
                  <main>
                      <Routes>
                          {/* Routes publiques */}
                          <Route path="/" element={<Home />} />
                          <Route path="/login" element={<Login />} />
                          
                          {/* Routes protégées par rôle */}
                          <Route 
                              path="/admin/dashboard" 
                              element={
                                  <PrivateRoute requiredRole="admin">
                                      <AdminDashboard />
                                  </PrivateRoute>
                              } 
                          />
                          
                          <Route 
                              path="/enseignant/dashboard" 
                              element={
                                  <PrivateRoute requiredRole="enseignant">
                                      <EnseignantDashboard />
                                  </PrivateRoute>
                              } 
                          />
                          
                          <Route 
                              path="/etudiant/dashboard" 
                              element={
                                  <PrivateRoute requiredRole="etudiant">
                                      <EtudiantDashboard />
                                  </PrivateRoute>
                              } 
                          />
                          
                          {/* Routes de secours */}
                          <Route path="/not-found" element={<NotFound />} />
                          <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                </div>
            </Router>
        </QueryClientProvider>
    );
}

export default App;