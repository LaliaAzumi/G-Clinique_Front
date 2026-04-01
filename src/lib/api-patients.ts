// lib/api-patients.ts
import { Patient } from "../types/patient";

const API_BASE_URL = "http://localhost:8000/api/v1/patients";

export const patientService = {
  // Récupérer le token depuis le localStorage (ou votre store d'état)
  getAuthHeader: () => {
    const token = localStorage.getItem("token"); 
    return { "Authorization": `Bearer ${token}` };
  },

  getAll: async (page = 0, size = 10): Promise<Patient[]> => {
    const response = await fetch(`${API_BASE_URL}?page=${page}&size=${size}`, {
      headers: patientService.getAuthHeader()
    });
    if (!response.ok) throw new Error("Erreur lors de la récupération");
    return response.json();
  },

  create: async (patient: Omit<Patient, "id">): Promise<Patient> => {
    const response = await fetch(`${API_BASE_URL}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...patientService.getAuthHeader()
      },
      body: JSON.stringify(patient),
    });
    if (!response.ok) throw new Error("Erreur lors de la création");
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: patientService.getAuthHeader()
    });
    if (!response.ok) throw new Error("Erreur lors de la suppression");
  }
};