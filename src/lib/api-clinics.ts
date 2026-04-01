import { Clinic, CreateClinicInput, UpdateClinicInput } from "@/types/clinic";

// Données fictives pour la démo
const mockClinics: Clinic[] = [
  {
    id: "1",
    name: "Clinique Central",
    email: "contact@central.com",
    phone: "+261 20 XX XXX XX",
    address: "123 Rue Principale",
    city: "Antananarivo",
    zipCode: "101",
    country: "Madagascar",
    description: "Clinique généraliste moderne",
    servicesCount: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Clinique Santé Plus",
    email: "contact@santeplus.com",
    phone: "+261 20 YY YYY YY",
    address: "456 Avenue Royale",
    city: "Fianarantsoa",
    zipCode: "301",
    country: "Madagascar",
    description: "Spécialisée en chirurgie",
    servicesCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let clinics = [...mockClinics];

export const clinicService = {
  async getAll(): Promise<Clinic[]> {
    // Simuler un délai réseau
    return new Promise((resolve) => {
      setTimeout(() => resolve(clinics), 300);
    });
  },

  async getById(id: string): Promise<Clinic | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(clinics.find((c) => c.id === id) || null);
      }, 200);
    });
  },

  async create(data: CreateClinicInput): Promise<Clinic> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newClinic: Clinic = {
          id: Date.now().toString(),
          ...data,
          servicesCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        clinics.push(newClinic);
        resolve(newClinic);
      }, 300);
    });
  },

  async update(data: UpdateClinicInput): Promise<Clinic> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = clinics.findIndex((c) => c.id === data.id);
        if (index !== -1) {
          clinics[index] = {
            ...clinics[index],
            ...data,
            updatedAt: new Date().toISOString(),
          };
          resolve(clinics[index]);
        }
        resolve(clinics[index]);
      }, 300);
    });
  },

  async delete(id: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        clinics = clinics.filter((c) => c.id !== id);
        resolve();
      }, 200);
    });
  },

  async search(query: string): Promise<Clinic[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = clinics.filter(
          (c) =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.city.toLowerCase().includes(query.toLowerCase())
        );
        resolve(filtered);
      }, 200);
    });
  },
};
