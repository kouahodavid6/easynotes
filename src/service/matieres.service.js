import axiosInstance from "../api/axiosInstance";

// Créer une matière
const createMatiere = async (matiereData) => {
    try {
        const response = await axiosInstance.post("/api/create/matiere", matiereData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la création de la matière");
    }
}

// Récupérer toutes les matières
const getMatieres = async () => {
    try {
        const response = await axiosInstance.get("/api/read/matieres");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la récupération des matières");
    }
}

// Modifier une matière
const updateMatiere = async ({ id, matiereData }) => {
    try {
        const response = await axiosInstance.put(`/api/update/matiere/${id}`, matiereData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la modification de la matière");
    }
}

// Supprimer une matière
const deleteMatiere = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/delete/matiere/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la suppression de la matière");
    }
}

export const matieresService = {
    createMatiere,
    getMatieres,
    updateMatiere,
    deleteMatiere
}