// import { Medecin } from "@/types/medecins";

// // Simulation d'une base de données locale ou appel API
// let mockMedecins: Medecin[] = [
//   { id: "1", Nom: "RAKOTO", Specialite: "Cardiologie", Telephone: "034 00 000 01", Adress: "Lot IV 22 Ankadifotsy" },
//   { id: "2", Nom: "ANDRIA", Specialite: "Généraliste", Telephone: "032 11 222 33", Adress: "Ambohijatovo" },
// ];

// export const medecinService = {
//   getAll: async (): Promise<Medecin[]> => {
//     // Simule un délai réseau
//     return new Promise((resolve) => {
//       setTimeout(() => resolve([...mockMedecins]), 500);
//     });
//   },

//   create: async (data: Omit<Medecin, "id">): Promise<Medecin> => {
//     const newMedecin = {
//       ...data,
//       id: Math.random().toString(36).substr(2, 9),
//     };
//     mockMedecins.push(newMedecin);
//     return newMedecin;
//   },

//   delete: async (id: string): Promise<void> => {
//     mockMedecins = mockMedecins.filter(m => m.id !== id);
//   }
// };
import { Medecin } from "@/types/medecins";

// L'URL de ton backend FastAPI pour les médecins
const API_URL = "http://localhost:9090/api/v1/medecins";

export const medecinService = {
  /**
   * Récupère la liste réelle depuis la BDD (via FastAPI)
   */
  getAll: async (): Promise<Medecin[]> => {
    console.log("--- Récupération des médecins depuis l'API ---");
    try {
      const response = await fetch(`${API_URL}`, { method: "GET" });

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const result = await response.json();

      // On extrait la liste selon la structure de ton JSON : result.data.medecins
      if (result && result.success && result.data && result.data.medecins) {
        return result.data.medecins;
      }

      return []; // Retourne un tableau vide si rien n'est trouvé
    } catch (error) {
      console.error("Erreur dans medecinService.getAll :", error);
      throw error;
    }
  },

  /**
   * Création d'un médecin dans la BDD
   */
  // Dans votre fichier lib/api-medecins.ts
createWithUser: async (data: any) => {
  const response = await fetch(`${API_URL}/create-with-user`, {
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
   * Suppression d'un médecin dans la BDD
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

  update: async (id: number | string, data: Medecin): Promise<any> => {
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
      console.error("Erreur dans medecinService.update :", error);
      throw error;
    }

  }
};