import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { matieresService } from '../service/matieres.service'
import toast from 'react-hot-toast';

export const matiereKeys = {
    all: ['matieres'],
    lists: () => [...matiereKeys.all, 'list'],
    list: (filters) => [...matiereKeys.lists(), { filters }],
};

export const useMatieres = (filters = {}) => {
    const queryClient = useQueryClient();

    // Requête pour la liste
    const matieresQuery = useQuery({
        queryKey: matiereKeys.list(filters),
        queryFn: matieresService.getMatieres,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        select: (data) => data.data || [],
    });

    // Mutation pour l'ajout
    const createMatiereMutation = useMutation({
        mutationFn: (matiereData) => matieresService.createMatiere(matiereData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: matiereKeys.lists() });
            toast.success(data.message || "Matière créée avec succès");
            return data;
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    // Mutation pour la modification
    const updateMatiereMutation = useMutation({
        mutationFn: ({ id, matiereData }) => matieresService.updateMatiere({ id, matiereData }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: matiereKeys.lists() });
            toast.success(data.message || "Matière modifiée avec succès");
            return data;
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    // Mutation pour la suppression
    const deleteMatiereMutation = useMutation({
        mutationFn: (id) => matieresService.deleteMatiere(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: matiereKeys.lists() });
            
            const previousMatieres = queryClient.getQueryData(matiereKeys.lists());
            
            queryClient.setQueryData(matiereKeys.lists(), (old = []) =>
                old.filter(matiere => matiere.id !== id)
            );
            
            return { previousMatieres };
        },
        onSuccess: (data) => {
            toast.success(data.message || "Matière supprimée avec succès");
        },
        onError: (error, id, context) => {
            toast.error(error.message);
            
            if (context?.previousMatieres) {
                queryClient.setQueryData(matiereKeys.lists(), context.previousMatieres);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: matiereKeys.lists() });
        }
    });

    return {
        // Données et état
        matieres: matieresQuery.data || [],
        isLoading: matieresQuery.isLoading,
        isFetching: matieresQuery.isFetching,
        error: matieresQuery.error,
        refetch: matieresQuery.refetch,

        // Ajout
        createMatiere: createMatiereMutation.mutate,
        createMatiereAsync: createMatiereMutation.mutateAsync,
        isCreating: createMatiereMutation.isPending,
        createError: createMatiereMutation.error,

        // Modification
        updateMatiere: updateMatiereMutation.mutate,
        updateMatiereAsync: updateMatiereMutation.mutateAsync,
        isUpdating: updateMatiereMutation.isPending,
        updateError: updateMatiereMutation.error,

        // Suppression
        deleteMatiere: deleteMatiereMutation.mutate,
        deleteMatiereAsync: deleteMatiereMutation.mutateAsync,
        isDeleting: deleteMatiereMutation.isPending,
        deleteError: deleteMatiereMutation.error,

        // Utilitaires
        queryClient
    };
};