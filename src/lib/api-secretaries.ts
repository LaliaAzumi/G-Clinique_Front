import { Secretary } from "../types/secretary";

// L'URL de ton serveur FastAPI
const API_URL = "http://localhost:8000/api/v1/secretaires";

export const secretaryService = {
  // Récupérer le token stocké lors de la connexion
  getAuthHeader: () => {
    const token = localStorage.getItem("token"); // Adapte selon où tu stockes ton JWT
    return token ? { "Authorization": `Bearer ${token}` } : {};
  },

  getAll: async (): Promise<Secretary[]> => {
    const response = await fetch(`${API_URL}`, {
      headers: { ...secretaryService.getAuthHeader() }
    });
    
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des secrétaires");
    }
    return response.json();
  },
  
  create: async (secretary: Omit<Secretary, "id">) => {
    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...secretaryService.getAuthHeader()
      },
      body: JSON.stringify(secretary),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Erreur lors de la création");
    }
    return response.json();
  }
};