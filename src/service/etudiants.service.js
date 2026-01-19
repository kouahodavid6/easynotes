import axiosInstance from "../api/axiosInstance";

// Créer un étudiant (avec upload de photo)
const createEtudiant = async (etudiantData) => {
    try {
        const response = await axiosInstance.post("/api/create/etudiant", etudiantData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la création de l'étudiant");
    }
}

// Récupérer tous les étudiants
const getEtudiants = async () => {
    try {
        const response = await axiosInstance.get("/api/read/etudiants");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la récupération des étudiants");
    }
}

// Modifier un étudiant
const updateEtudiant = async ({ id, etudiantData }) => {
    try {
        const response = await axiosInstance.post(`/api/update/etudiant/${id}`, etudiantData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la modification de l'étudiant");
    }
}

// Supprimer un étudiant
const deleteEtudiant = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/delete/etudiant/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la suppression de l'étudiant");
    }
}

export const etudiantsService = {
    createEtudiant,
    getEtudiants,
    updateEtudiant,
    deleteEtudiant
}