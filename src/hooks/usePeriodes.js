import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { periodesService } from '../service/periodes.service'
import toast from 'react-hot-toast';

export const periodeKeys = {
    all: ['periodes'],
    lists: () => [...periodeKeys.all, 'list'],
    list: (filters) => [...periodeKeys.lists(), { filters }],
};

export const usePeriodes = (filters = {}) => {
    const queryClient = useQueryClient();

    // Requête pour la liste
    const periodesQuery = useQuery({
        queryKey: periodeKeys.list(filters),
        queryFn: periodesService.getPeriodes,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        select: (data) => data.data || [],
    });

    // Mutation pour l'ajout
    const createPeriodeMutation = useMutation({
        mutationFn: (periodeData) => periodesService.createPeriode(periodeData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: periodeKeys.lists() });
            toast.success(data.message || "Période créée avec succès");
            return data;
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    // Mutation pour la modification
    const updatePeriodeMutation = useMutation({
        mutationFn: ({ id, periodeData }) => periodesService.updatePeriode({ id, periodeData }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: periodeKeys.lists() });
            toast.success(data.message || "Période modifiée avec succès");
            return data;
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    // Mutation pour la suppression
    const deletePeriodeMutation = useMutation({
        mutationFn: (id) => periodesService.deletePeriode(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: periodeKeys.lists() });
            
            const previousPeriodes = queryClient.getQueryData(periodeKeys.lists());
            
            queryClient.setQueryData(periodeKeys.lists(), (old = []) =>
                old.filter(periode => periode.id !== id)
            );
            
            return { previousPeriodes };
        },
        onSuccess: (data) => {
            toast.success(data.message || "Période supprimée avec succès");
        },
        onError: (error, id, context) => {
            toast.error(error.message);
            
            if (context?.previousPeriodes) {
                queryClient.setQueryData(periodeKeys.lists(), context.previousPeriodes);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: periodeKeys.lists() });
        }
    });

    return {
        // Données et état
        periodes: periodesQuery.data || [],
        isLoading: periodesQuery.isLoading,
        isFetching: periodesQuery.isFetching,
        error: periodesQuery.error,
        refetch: periodesQuery.refetch,

        // Ajout
        createPeriode: createPeriodeMutation.mutate,
        createPeriodeAsync: createPeriodeMutation.mutateAsync,
        isCreating: createPeriodeMutation.isPending,
        createError: createPeriodeMutation.error,

        // Modification
        updatePeriode: updatePeriodeMutation.mutate,
        updatePeriodeAsync: updatePeriodeMutation.mutateAsync,
        isUpdating: updatePeriodeMutation.isPending,
        updateError: updatePeriodeMutation.error,

        // Suppression
        deletePeriode: deletePeriodeMutation.mutate,
        deletePeriodeAsync: deletePeriodeMutation.mutateAsync,
        isDeleting: deletePeriodeMutation.isPending,
        deleteError: deletePeriodeMutation.error,

        // Utilitaires
        queryClient
    };
};