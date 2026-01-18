import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enseignantsService } from '../service/enseignants.service'
import toast from 'react-hot-toast';

export const enseignantKeys = {
    all: ['enseignants'],
    lists: () => [...enseignantKeys.all, 'list'],
    list: (filters) => [...enseignantKeys.lists(), { filters }],
};

export const useEnseignants = (filters = {}) => {
    const queryClient = useQueryClient();

    // Requête pour la liste
    const enseignantsQuery = useQuery({
        queryKey: enseignantKeys.list(filters),
        queryFn: enseignantsService.getEnseignants,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        select: (data) => data.data || [],
    });

    // Mutation pour l'ajout
    const createEnseignantMutation = useMutation({
        mutationFn: (enseignantData) => enseignantsService.createEnseignant(enseignantData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: enseignantKeys.lists() });
            toast.success(data.message || "Enseignant créé avec succès");
            return data;
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    // Mutation pour la modification
    const updateEnseignantMutation = useMutation({
        mutationFn: ({ id, enseignantData }) => enseignantsService.updateEnseignant({ id, enseignantData }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: enseignantKeys.lists() });
            toast.success(data.message || "Enseignant modifié avec succès");
            return data;
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    // Mutation pour la suppression
    const deleteEnseignantMutation = useMutation({
        mutationFn: (id) => enseignantsService.deleteEnseignant(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: enseignantKeys.lists() });
            
            const previousEnseignants = queryClient.getQueryData(enseignantKeys.lists());
            
            queryClient.setQueryData(enseignantKeys.lists(), (old = []) =>
                old.filter(enseignant => enseignant.id !== id)
            );
            
            return { previousEnseignants };
        },
        onSuccess: (data) => {
            toast.success(data.message || "Enseignant supprimé avec succès");
        },
        onError: (error, id, context) => {
            toast.error(error.message);
            
            if (context?.previousEnseignants) {
                queryClient.setQueryData(enseignantKeys.lists(), context.previousEnseignants);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: enseignantKeys.lists() });
        }
    });

    return {
        // Données et état
        enseignants: enseignantsQuery.data || [],
        isLoading: enseignantsQuery.isLoading,
        isFetching: enseignantsQuery.isFetching,
        error: enseignantsQuery.error,
        refetch: enseignantsQuery.refetch,

        // Ajout
        createEnseignant: createEnseignantMutation.mutate,
        createEnseignantAsync: createEnseignantMutation.mutateAsync,
        isCreating: createEnseignantMutation.isPending,
        createError: createEnseignantMutation.error,

        // Modification
        updateEnseignant: updateEnseignantMutation.mutate,
        updateEnseignantAsync: updateEnseignantMutation.mutateAsync,
        isUpdating: updateEnseignantMutation.isPending,
        updateError: updateEnseignantMutation.error,

        // Suppression
        deleteEnseignant: deleteEnseignantMutation.mutate,
        deleteEnseignantAsync: deleteEnseignantMutation.mutateAsync,
        isDeleting: deleteEnseignantMutation.isPending,
        deleteError: deleteEnseignantMutation.error,

        // Utilitaires
        queryClient
    };
};