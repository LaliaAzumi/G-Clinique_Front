// import { Secretary } from "../types/secretary";

// const MOCK_SECRETARIES: Secretary[] = [
//   { 
//     id: "s1", 
//     firstName: "Aina", 
//     lastName: "Rakoto", 
//     email: "aina.sec@clinique.mg", 
//     phone: "032 11 222 33", 
//     assignedService: "Accueil Principal",
//     status: "active" 
//   },
// ];

// export const secretaryService = {
//   getAll: async (): Promise<Secretary[]> => {
//     return new Promise((resolve) => setTimeout(() => resolve(MOCK_SECRETARIES), 400));
//   },
  
//   create: async (secretary: Omit<Secretary, "id">) => {
//     console.log("Backend Post - Secretary:", secretary);
//   }
// };
import { Secretary } from "@/types/secretary";

// L'URL de ton backend localhost pour les secrétaires
const API_URL = "http://localhost:9090/api/v1/secretaires";

export const secretaryService = {
  /**
   * Récupère la liste réelle depuis la BDD (via localhost)
   */
  getAll: async (): Promise<Secretary[]> => {
    console.log("--- Récupération des secrétaires depuis l'API ---");
    try {
      const response = await fetch(`${API_URL}`, { method: "GET" });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const result = await response.json();

      // On extrait la liste selon la structure de ton JSON : result.data.secretaires
      if (result && result.success && result.data && result.data.users) {
        return result.data.users;
      }

      return []; // Retourne un tableau vide si rien n'est trouvé
    } catch (error) {
      console.error("Erreur dans secretaryService.getAll :", error);
      throw error;
    }
  },

  /**
   * Création d'un secrétaire dans la BDD
   */
  // Dans votre fichier lib/api-secretaires.ts
create: async (data: any) => {
  const response = await fetch(`${API_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`, // Ajustez selon votre gestion de token
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Erreur lors de la création");
  return response.json();
},
  /**
   * Suppression d'un secrétaire dans la BDD
   */
  delete: async (id: string): Promise<void> => {
  const token = localStorage.getItem("token"); // Récupère ton token
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}` // <--- Crucial
    },
  });

  if (!response.ok) throw new Error("Erreur lors de la suppression");
},

  update: async (id: number | string, data: Secretary): Promise<any> => {
    const token = localStorage.getItem("token"); // Récupère ton token JWT si nécessaire

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Ajout du header Auth
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erreur lors de la modification");
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur dans secretaryService.update :", error);
      throw error;
    }

  }
};