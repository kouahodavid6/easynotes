import axiosInstance from "../api/axiosInstance";

// Créer une classe
const createClasse = async (classeData) => {
    try {
        const response = await axiosInstance.post("/api/create/classe", classeData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la création de la classe");
    }
}

// Récupérer toutes les classes
const getClasses = async () => {
    try {
        const response = await axiosInstance.get("/api/read/classes");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la récupération des classes");
    }
}

// Modifier une classe
const updateClasse = async ({ id, classeData }) => {
    try {
        const response = await axiosInstance.put(`/api/update/classe/${id}`, classeData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la modification de la classe");
    }
}

// Supprimer une classe
const deleteClasse = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/delete/classe/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la suppression de la classe");
    }
}

export const classesService = {
    createClasse,
    getClasses,
    updateClasse,
    deleteClasse
}