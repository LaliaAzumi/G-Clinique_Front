export interface Clinic {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  description?: string;
  image?: string;
  servicesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClinicInput {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  description?: string;
  image?: string;
}

export interface UpdateClinicInput extends Partial<CreateClinicInput> {
  id: string;
}
