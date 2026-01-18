import axiosInstance from "../api/axiosInstance";

// Créer un enseignant (avec upload de photo)
const createEnseignant = async (enseignantData) => {
    try {
        const response = await axiosInstance.post("/api/create/enseignant", enseignantData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la création de l'enseignant");
    }
}

// Récupérer tous les enseignants
const getEnseignants = async () => {
    try {
        const response = await axiosInstance.get("/api/read/enseignants");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la récupération des enseignants");
    }
}

// Modifier un enseignant
const updateEnseignant = async ({ id, enseignantData }) => {
    try {
        const response = await axiosInstance.post(`/api/update/enseignant/${id}`, enseignantData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la modification de l'enseignant");
    }
}

// Supprimer un enseignant
const deleteEnseignant = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/delete/enseignant/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la suppression de l'enseignant");
    }
}

export const enseignantsService = {
    createEnseignant,
    getEnseignants,
    updateEnseignant,
    deleteEnseignant
}