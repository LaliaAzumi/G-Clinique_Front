import { Medecin } from "@/types/medecins";

// Simulation d'une base de données locale ou appel API
let mockMedecins: Medecin[] = [
  { id: "1", Nom: "RAKOTO", Specialite: "Cardiologie", Telephone: "034 00 000 01", Adress: "Lot IV 22 Ankadifotsy" },
  { id: "2", Nom: "ANDRIA", Specialite: "Généraliste", Telephone: "032 11 222 33", Adress: "Ambohijatovo" },
];

export const medecinService = {
  getAll: async (): Promise<Medecin[]> => {
    // Simule un délai réseau
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockMedecins]), 500);
    });
  },

  create: async (data: Omit<Medecin, "id">): Promise<Medecin> => {
    const newMedecin = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    };
    mockMedecins.push(newMedecin);
    return newMedecin;
  },

  delete: async (id: string): Promise<void> => {
    mockMedecins = mockMedecins.filter(m => m.id !== id);
  }
};