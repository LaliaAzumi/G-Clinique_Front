import { Chambre } from "../types/chambre";

// Simulacre de données pour ton rendu actuel (Mock Data)
const MOCK_CHAMBRES: Chambre[] = [
  { id: "1", numero: "123", etat: true, prixJ: 50000, etage : 12, isSoinsIntensifs : false },
];

export const chambreService = {
  // Cette fonction sera reliée à Spring Boot plus tard
  getAll: async (): Promise<Chambre[]> => {
    // Pour l'instant, on retourne les données de test
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_CHAMBRES), 500));
  },
  
  create: async (chambre: Omit<Chambre, "id">) => {
    console.log("Envoi au Backend Spring Boot:", chambre);
  }
};