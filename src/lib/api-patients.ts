// lib/api-patients.ts
import { Patient } from "../types/patient";

const API_BASE_URL = "http://localhost:8000/api/v1/patients"; // Vérifiez ce port !

export const patientService = {
  getAuthHeader: () => {
    const token = localStorage.getItem("token"); 
    return { "Authorization": `Bearer ${token}` };
  },

  // api-patients.ts
getAll: async (page = 0, size = 10): Promise<any> => {
    const token = localStorage.getItem("token");
    
    if (!token) {
        console.error("Aucun token trouvé dans le localStorage");
        return []; // Retourne un tableau vide au lieu de faire planter le back
    }

    const response = await fetch(`${API_BASE_URL}?page=${page}&size=${size}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        // Si le back répond 500, on regarde le texte de l'erreur
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Erreur serveur");
    }
    return response.json();
},
create: async (patient: any) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/save`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(patient),
    });
    if (!response.ok) throw new Error("Erreur lors de l'ajout");
    return response.json();
  },

  update: async (patient: any) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/update`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(patient),
    });
    if (!response.ok) throw new Error("Erreur lors de la modification");
    return response.json();
  },

  delete: async (id: number) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Erreur lors de la suppression");
    return response.json();
  }
};

