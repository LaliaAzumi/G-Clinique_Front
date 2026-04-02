import { Patient } from "../types/patient";

// Simulacre de données pour ton rendu actuel (Mock Data)
const MOCK_PATIENTS: Patient[] = [
  { id: "1", firstName: "Jean", lastName: "Dupont", email: "jean@mail.com", phone: "03400000", adresse:"Ivato",dateOfBirth: "1985-05-12"},
];

export const patientService = {
  // Cette fonction sera reliée à Spring Boot plus tard
  getAll: async (): Promise<Patient[]> => {
    // Pour l'instant, on retourne les données de test
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_PATIENTS), 500));
  },
  
  create: async (patient: Omit<Patient, "id">) => {
    console.log("Envoi au Backend Spring Boot:", patient);
  }
};