import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classesService } from '../service/classes.service'
import toast from 'react-hot-toast';

export const classeKeys = {
    all: ['classes'],
    lists: () => [...classeKeys.all, 'list'],
    list: (filters) => [...classeKeys.lists(), { filters }],
    details: () => [...classeKeys.all, 'detail'],
    detail: (id) => [...classeKeys.details(), id],
};

export const useClasses = (filters = {}) => {
    const queryClient = useQueryClient();

    // Requête pour la liste
    const classesQuery = useQuery({
        queryKey: classeKeys.list(filters),
        queryFn: classesService.getClasses,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        select: (data) => data.data || [],
    });

    // Mutation pour l'ajout
    const createClasseMutation = useMutation({
        mutationFn: (classeData) => classesService.createClasse(classeData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: classeKeys.lists() });
            toast.success(data.message || "Classe créée avec succès");
            return data;
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    // Mutation pour la modification
    const updateClasseMutation = useMutation({
        mutationFn: ({ id, classeData }) => classesService.updateClasse({ id, classeData }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: classeKeys.lists() });
            toast.success(data.message || "Classe modifiée avec succès");
            return data;
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    // Mutation pour la suppression
    const deleteClasseMutation = useMutation({
        mutationFn: (id) => classesService.deleteClasse(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: classeKeys.lists() });
            
            const previousClasses = queryClient.getQueryData(classeKeys.lists());
            
            queryClient.setQueryData(classeKeys.lists(), (old = []) =>
                old.filter(classe => classe.id !== id)
            );
            
            return { previousClasses };
        },
        onSuccess: (data) => {
            toast.success(data.message || "Classe supprimée avec succès");
        },
        onError: (error, id, context) => {
            toast.error(error.message);
            
            if (context?.previousClasses) {
                queryClient.setQueryData(classeKeys.lists(), context.previousClasses);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: classeKeys.lists() });
        }
    });

    return {
        // Données et état
        classes: classesQuery.data || [],
        isLoading: classesQuery.isLoading,
        isFetching: classesQuery.isFetching,
        error: classesQuery.error,
        refetch: classesQuery.refetch,

        // Ajout
        createClasse: createClasseMutation.mutate,
        createClasseAsync: createClasseMutation.mutateAsync,
        isCreating: createClasseMutation.isPending,
        createError: createClasseMutation.error,

        // Modification
        updateClasse: updateClasseMutation.mutate,
        updateClasseAsync: updateClasseMutation.mutateAsync,
        isUpdating: updateClasseMutation.isPending,
        updateError: updateClasseMutation.error,

        // Suppression
        deleteClasse: deleteClasseMutation.mutate,
        deleteClasseAsync: deleteClasseMutation.mutateAsync,
        isDeleting: deleteClasseMutation.isPending,
        deleteError: deleteClasseMutation.error,

        // Utilitaires
        queryClient
    };
};