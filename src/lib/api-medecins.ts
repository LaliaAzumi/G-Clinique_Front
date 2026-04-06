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
const API_URL = "http://localhost:8080/api/v1/medecins";

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
  create: async (data: Omit<Medecin, "id">): Promise<Medecin> => {
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Erreur lors de la création");
    const result = await response.json();
    return result.data;
  },

  /**
   * Suppression d'un médecin dans la BDD
   */
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Erreur lors de la suppression");
  }
};