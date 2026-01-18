// /hooks/useAuth.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../service/auth.service';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    
    const mutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            if (data.success && data.data) {
                const userData = data.data;
                let token = '';
                
                // Déterminer le bon token selon le rôle
                if (userData.role === 3) {
                    token = userData.token;
                    localStorage.setItem('admin_token', token);
                    localStorage.setItem('admin_user', JSON.stringify(userData));
                } else if (userData.role === 1) {
                    token = userData.tokenEns;
                    localStorage.setItem('teacher_token', token);
                    localStorage.setItem('teacher_user', JSON.stringify(userData));
                } else if (userData.role === 2) {
                    token = userData.tokenEtu;
                    localStorage.setItem('student_token', token);
                    localStorage.setItem('student_user', JSON.stringify(userData));
                }
                
                // Stocker les infos communes
                localStorage.setItem('auth_token', token);
                localStorage.setItem('user_data', JSON.stringify(userData));
                
                queryClient.setQueryData(['currentUser'], userData);
                
                // Redirection selon le rôle
                switch(userData.role) {
                    case 1:
                        navigate('/enseignant/dashboard');
                        break;
                    case 2:
                        navigate('/etudiant/dashboard');
                        break;
                    case 3:
                        navigate('/admin/dashboard');
                        break;
                    default:
                        navigate('/');
                }
                
                toast.success(data.message || 'Connexion réussie !');
            }
        },
        onError: (error) => {
            toast.error(error.message || "Erreur de connexion");
        }
    });
    
    return {
        login: mutation.mutate,
        isLoggingIn: mutation.isPending,
        loginError: mutation.error
    };
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    
    const logout = () => {
        // Supprimer tous les tokens
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        localStorage.removeItem('teacher_token');
        localStorage.removeItem('teacher_user');
        localStorage.removeItem('student_token');
        localStorage.removeItem('student_user');
        
        queryClient.removeQueries();
        queryClient.clear();
        
        // Rediriger vers la page de login
        window.location.href = '/login';
    };
    
    return { logout };
};

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: async () => {
            try {
                const userData = localStorage.getItem('user_data');
                if (!userData) {
                    return null;
                }
                
                return JSON.parse(userData);
            } catch (error) {
                console.error('Erreur parsing user data:', error);
                return null;
            }
        },
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false
    });
};

export const useAuth = () => {
    const { data: user, isLoading } = useCurrentUser();
    const token = localStorage.getItem('auth_token');
    
    return {
        isAuthenticated: !!token && !!user,
        user,
        isLoading: isLoading && !!token,
        hasToken: !!token
    };
};