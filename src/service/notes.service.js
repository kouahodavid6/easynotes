import axiosInstance from "../api/axiosInstance";

// Créer une note
const createNote = async (noteData) => {
    try {
        const response = await axiosInstance.post("/api/create/note", noteData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la création de la note");
    }
}

// Récupérer toutes les notes
const getNotes = async () => {
    try {
        const response = await axiosInstance.get("/api/read/notes");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la récupération des notes");
    }
}

// Modifier une note
const updateNote = async ({ id, noteData }) => {
    try {
        const response = await axiosInstance.put(`/api/update/note/${id}`, noteData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la modification de la note");
    }
}

// Supprimer une note
const deleteNote = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/delete/note/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la suppression de la note");
    }
}

export const notesService = {
    createNote,
    getNotes,
    updateNote,
    deleteNote
}