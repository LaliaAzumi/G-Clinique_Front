import { Secretary } from "../types/secretary";

const MOCK_SECRETARIES: Secretary[] = [
  { 
    id: "s1", 
    firstName: "Aina", 
    lastName: "Rakoto", 
    email: "aina.sec@clinique.mg", 
    phone: "032 11 222 33", 
    assignedService: "Accueil Principal",
    
  },
];

export const secretaryService = {
  getAll: async (): Promise<Secretary[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_SECRETARIES), 400));
  },
  
  create: async (secretary: Omit<Secretary, "id">) => {
    console.log("Backend Post - Secretary:", secretary);
  }
};