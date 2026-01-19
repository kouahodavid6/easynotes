import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { etudiantsService } from '../service/etudiants.service'
import toast from 'react-hot-toast';

export const etudiantKeys = {
    all: ['etudiants'],
    lists: () => [...etudiantKeys.all, 'list'],
    list: (filters) => [...etudiantKeys.lists(), { filters }],
};

export const useEtudiants = (filters = {}) => {
    const queryClient = useQueryClient();

    // Requête pour la liste
    const etudiantsQuery = useQuery({
        queryKey: etudiantKeys.list(filters),
        queryFn: etudiantsService.getEtudiants,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        select: (data) => data.data || [],
    });

    // Mutation pour l'ajout
    const createEtudiantMutation = useMutation({
        mutationFn: (etudiantData) => etudiantsService.createEtudiant(etudiantData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: etudiantKeys.lists() });
            toast.success(data.message || "Étudiant créé avec succès");
            return data;
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    // Mutation pour la modification
    const updateEtudiantMutation = useMutation({
        mutationFn: ({ id, etudiantData }) => etudiantsService.updateEtudiant({ id, etudiantData }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: etudiantKeys.lists() });
            toast.success(data.message || "Étudiant modifié avec succès");
            return data;
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    // Mutation pour la suppression
    const deleteEtudiantMutation = useMutation({
        mutationFn: (id) => etudiantsService.deleteEtudiant(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: etudiantKeys.lists() });
            
            const previousEtudiants = queryClient.getQueryData(etudiantKeys.lists());
            
            queryClient.setQueryData(etudiantKeys.lists(), (old = []) =>
                old.filter(etudiant => etudiant.id !== id)
            );
            
            return { previousEtudiants };
        },
        onSuccess: (data) => {
            toast.success(data.message || "Étudiant supprimé avec succès");
        },
        onError: (error, id, context) => {
            toast.error(error.message);
            
            if (context?.previousEtudiants) {
                queryClient.setQueryData(etudiantKeys.lists(), context.previousEtudiants);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: etudiantKeys.lists() });
        }
    });

    return {
        // Données et état
        etudiants: etudiantsQuery.data || [],
        isLoading: etudiantsQuery.isLoading,
        isFetching: etudiantsQuery.isFetching,
        error: etudiantsQuery.error,
        refetch: etudiantsQuery.refetch,

        // Ajout
        createEtudiant: createEtudiantMutation.mutate,
        createEtudiantAsync: createEtudiantMutation.mutateAsync,
        isCreating: createEtudiantMutation.isPending,
        createError: createEtudiantMutation.error,

        // Modification
        updateEtudiant: updateEtudiantMutation.mutate,
        updateEtudiantAsync: updateEtudiantMutation.mutateAsync,
        isUpdating: updateEtudiantMutation.isPending,
        updateError: updateEtudiantMutation.error,

        // Suppression
        deleteEtudiant: deleteEtudiantMutation.mutate,
        deleteEtudiantAsync: deleteEtudiantMutation.mutateAsync,
        isDeleting: deleteEtudiantMutation.isPending,
        deleteError: deleteEtudiantMutation.error,

        // Utilitaires
        queryClient
    };
};