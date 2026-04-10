// Correction: utilise le port 8000 pour FastAPI ou vérifie le port Spring Boot
const API_URL = "http://localhost:8080/api/v1/chambres";

export interface Chambre {
  id?: number;
  numero: string;
  nom: string; // Nom court ex: A01, B01
  etat: boolean;
  prixJ: number;
  //etage?: number;
  etage?: string; // "RDC", "1", "2", "3"
  soinsIntensifs: boolean;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) return {};
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const chambreService = {
  getAll: async (): Promise<Chambre[]> => {
    const response = await fetch(API_URL, {
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Erreur lors du chargement des chambres");
    const data = await response.json();
    return data.data?.chambres || [];
  },

  getById: async (id: number): Promise<Chambre> => {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Chambre non trouvée");
    const data = await response.json();
    return data.data?.chambre;
  },

  create: async (chambre: Chambre): Promise<Chambre> => {
    const headers = getAuthHeaders();
    if (!headers.Authorization) {
      throw new Error("Veuillez vous connecter pour créer une chambre");
    }
    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers,
      body: JSON.stringify(chambre),
    });
    if (!response.ok) {
      const text = await response.text();
      // Si la réponse est HTML (redirection vers login), message personnalisé
      if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<")) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }
      try {
        const error = JSON.parse(text);
        throw new Error(error.message || "Erreur lors de la création");
      } catch {
        throw new Error("Erreur lors de la création");
      }
    }
    const data = await response.json();
    return data.data?.chambre;
  },

  update: async (id: number, chambre: Chambre): Promise<Chambre> => {
    const headers = getAuthHeaders();
    if (!headers.Authorization) {
      throw new Error("Veuillez vous connecter pour modifier une chambre");
    }
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(chambre),
    });
    if (!response.ok) {
      const text = await response.text();
      if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<")) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }
      try {
        const error = JSON.parse(text);
        throw new Error(error.message || "Erreur lors de la modification");
      } catch {
        throw new Error("Erreur lors de la modification");
      }
    }
    const data = await response.json();
    return data.data?.chambre;
  },

  delete: async (id: number): Promise<void> => {
    const headers = getAuthHeaders();
    if (!headers.Authorization) {
      throw new Error("Veuillez vous connecter pour supprimer une chambre");
    }
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) {
      const text = await response.text();
      if (text.trim().startsWith("<!DOCTYPE") || text.trim().startsWith("<")) {
        throw new Error("Session expirée. Veuillez vous reconnecter.");
      }
      try {
        const error = JSON.parse(text);
        throw new Error(error.message || "Impossible de supprimer cette chambre");
      } catch {
        throw new Error("Impossible de supprimer cette chambre");
      }
    }
  },
};
