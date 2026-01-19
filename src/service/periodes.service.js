import axiosInstance from "../api/axiosInstance";

// Créer une période
const createPeriode = async (periodeData) => {
    try {
        const response = await axiosInstance.post("/api/create/periode", periodeData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la création de la période");
    }
}

// Récupérer toutes les périodes
const getPeriodes = async () => {
    try {
        const response = await axiosInstance.get("/api/read/periodes");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la récupération des périodes");
    }
}

// Modifier une période
const updatePeriode = async ({ id, periodeData }) => {
    try {
        const response = await axiosInstance.put(`/api/update/periode/${id}`, periodeData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la modification de la période");
    }
}

// Supprimer une période
const deletePeriode = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/delete/periode/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la suppression de la période");
    }
}

export const periodesService = {
    createPeriode,
    getPeriodes,
    updatePeriode,
    deletePeriode
}