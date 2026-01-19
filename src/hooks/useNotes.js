import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesService } from '../service/notes.service';
import toast from 'react-hot-toast';

export const noteKeys = {
    all: ['notes'],
    lists: () => [...noteKeys.all, 'list'],
    list: (filters) => [...noteKeys.lists(), { filters }],
};

export const useNotes = (filters = {}) => {
    const queryClient = useQueryClient();

    // Requête pour la liste
    const notesQuery = useQuery({
        queryKey: noteKeys.list(filters),
        queryFn: notesService.getNotes,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
        select: (data) => data.data || [],
    });

    // Mutation pour l'ajout
    const createNoteMutation = useMutation({
        mutationFn: (noteData) => notesService.createNote(noteData),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
            toast.success(data.message || "Note ajoutée avec succès");
            return data;
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    // Mutation pour la modification
    const updateNoteMutation = useMutation({
        mutationFn: ({ id, noteData }) => notesService.updateNote({ id, noteData }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
            toast.success(data.message || "Note modifiée avec succès");
            return data;
        },
        onError: (error) => {
            toast.error(error.message);
        }
    });

    // Mutation pour la suppression
    const deleteNoteMutation = useMutation({
        mutationFn: (id) => notesService.deleteNote(id),
        onMutate: async (id) => {
            await queryClient.cancelQueries({ queryKey: noteKeys.lists() });
            
            const previousNotes = queryClient.getQueryData(noteKeys.lists());
            
            queryClient.setQueryData(noteKeys.lists(), (old = []) =>
                old.filter(note => note.id !== id)
            );
            
            return { previousNotes };
        },
        onSuccess: (data) => {
            toast.success(data.message || "Note supprimée avec succès");
        },
        onError: (error, id, context) => {
            toast.error(error.message);
            
            if (context?.previousNotes) {
                queryClient.setQueryData(noteKeys.lists(), context.previousNotes);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
        }
    });

    return {
        // Données et état
        notes: notesQuery.data || [],
        isLoading: notesQuery.isLoading,
        isFetching: notesQuery.isFetching,
        error: notesQuery.error,
        refetch: notesQuery.refetch,

        // Ajout
        createNote: createNoteMutation.mutate,
        createNoteAsync: createNoteMutation.mutateAsync,
        isCreating: createNoteMutation.isPending,
        createError: createNoteMutation.error,

        // Modification
        updateNote: updateNoteMutation.mutate,
        updateNoteAsync: updateNoteMutation.mutateAsync,
        isUpdating: updateNoteMutation.isPending,
        updateError: updateNoteMutation.error,

        // Suppression
        deleteNote: deleteNoteMutation.mutate,
        deleteNoteAsync: deleteNoteMutation.mutateAsync,
        isDeleting: deleteNoteMutation.isPending,
        deleteError: deleteNoteMutation.error,

        // Utilitaires
        queryClient
    };
};