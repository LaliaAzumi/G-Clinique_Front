export interface Service {
  id: string;
  name: string;
  description: string;
  clinicId: string;
  clinicName?: string;
  price: number;
  duration: number; // en minutes
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceInput {
  name: string;
  description: string;
  clinicId: string;
  price: number;
  duration: number;
  image?: string;
  isActive?: boolean;
}

export interface UpdateServiceInput extends Partial<CreateServiceInput> {
  id: string;
}
