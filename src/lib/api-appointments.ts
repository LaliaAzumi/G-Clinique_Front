import { Appointment, CreateAppointmentInput, UpdateAppointmentInput } from "@/types/appointment";

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "Jean Dupont",
    serviceId: "1",
    serviceName: "Consultation Générale",
    clinicId: "1",
    clinicName: "Clinique Central",
    appointmentDate: new Date().toISOString().split('T')[0],
    appointmentTime: "09:00",
    duration: 30,
    status: "confirmed",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Marie Martin",
    serviceId: "2",
    serviceName: "Dentologie",
    clinicId: "1",
    clinicName: "Clinique Central",
    appointmentDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    appointmentTime: "14:00",
    duration: 45,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let appointments = [...mockAppointments];

export const appointmentService = {
  async getAll(): Promise<Appointment[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(appointments), 300);
    });
  },

  async getById(id: string): Promise<Appointment | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(appointments.find((a) => a.id === id) || null);
      }, 200);
    });
  },

  async getByClinicId(clinicId: string): Promise<Appointment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(appointments.filter((a) => a.clinicId === clinicId));
      }, 200);
    });
  },

  async getByPatientId(patientId: string): Promise<Appointment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(appointments.filter((a) => a.patientId === patientId));
      }, 200);
    });
  },

  async getByDateRange(startDate: string, endDate: string): Promise<Appointment[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = appointments.filter(
          (a) => a.appointmentDate >= startDate && a.appointmentDate <= endDate
        );
        resolve(filtered);
      }, 200);
    });
  },

  async create(data: CreateAppointmentInput): Promise<Appointment> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newAppointment: Appointment = {
          id: Date.now().toString(),
          ...data,
          patientName: data.patientId,
          serviceName: data.serviceId,
          clinicName: data.clinicId,
          duration: 30,
          status: "pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        appointments.push(newAppointment);
        resolve(newAppointment);
      }, 300);
    });
  },

  async update(data: UpdateAppointmentInput): Promise<Appointment> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = appointments.findIndex((a) => a.id === data.id);
        if (index !== -1) {
          appointments[index] = {
            ...appointments[index],
            ...data,
            updatedAt: new Date().toISOString(),
          };
          resolve(appointments[index]);
        }
        resolve(appointments[index]);
      }, 300);
    });
  },

  async delete(id: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        appointments = appointments.filter((a) => a.id !== id);
        resolve();
      }, 200);
    });
  },
};
