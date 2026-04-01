import { Service, CreateServiceInput, UpdateServiceInput } from "@/types/service";

const mockServices: Service[] = [
  {
    id: "1",
    name: "Consultation Générale",
    description: "Consultation médicale généraliste",
    clinicId: "1",
    clinicName: "Clinique Central",
    price: 50000,
    duration: 30,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Dentologie",
    description: "Soins dentaires complets",
    clinicId: "1",
    clinicName: "Clinique Central",
    price: 75000,
    duration: 45,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Chirurgie",
    description: "Interventions chirurgicales",
    clinicId: "2",
    clinicName: "Clinique Santé Plus",
    price: 200000,
    duration: 120,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let services = [...mockServices];

export const serviceService = {
  async getAll(): Promise<Service[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(services), 300);
    });
  },

  async getByClinicId(clinicId: string): Promise<Service[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(services.filter((s) => s.clinicId === clinicId));
      }, 200);
    });
  },

  async getById(id: string): Promise<Service | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(services.find((s) => s.id === id) || null);
      }, 200);
    });
  },

  async create(data: CreateServiceInput): Promise<Service> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newService: Service = {
          id: Date.now().toString(),
          ...data,
          clinicName: data.clinicId,
          isActive: data.isActive ?? true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        services.push(newService);
        resolve(newService);
      }, 300);
    });
  },

  async update(data: UpdateServiceInput): Promise<Service> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = services.findIndex((s) => s.id === data.id);
        if (index !== -1) {
          services[index] = {
            ...services[index],
            ...data,
            updatedAt: new Date().toISOString(),
          };
          resolve(services[index]);
        }
        resolve(services[index]);
      }, 300);
    });
  },

  async delete(id: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        services = services.filter((s) => s.id !== id);
        resolve();
      }, 200);
    });
  },
};
