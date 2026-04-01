export type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  serviceId: string;
  serviceName: string;
  clinicId: string;
  clinicName: string;
  appointmentDate: string;
  appointmentTime: string;
  duration: number; // en minutes
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentInput {
  patientId: string;
  serviceId: string;
  clinicId: string;
  appointmentDate: string;
  appointmentTime: string;
  notes?: string;
}

export interface UpdateAppointmentInput extends Partial<CreateAppointmentInput> {
  id: string;
  status?: AppointmentStatus;
}
