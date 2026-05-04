// lib/api-appointments.ts
const API_BASE_URL = "http://localhost:8000/api/v1/rendez-vous";

export const appointmentService = {
  getAll: async () => {
    const token = localStorage.getItem("token");
    console.log("Token pour API Appointments:", token); // Debug du token
    const response = await fetch(`${API_BASE_URL}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Erreur lors de la récupération");
    return response.json();
  },

  save: async (data: any) => {
    const token = localStorage.getItem("token");
    
    // Détection : si data.id existe, c'est une modification
    const isUpdate = data.id && data.id !== "";
    const url = isUpdate ? `${API_BASE_URL}/${data.id}` : `${API_BASE_URL}/save`;
    const method = isUpdate ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) throw new Error("Erreur lors de l'enregistrement");
    return response.json();
  },

  update: async (id: number, data: any) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour");
    }

    return response.json();
  },

  delete: async (id: number) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: { 
      "Authorization": `Bearer ${token}` 
    }
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Erreur de suppression");
  }
},
cancel: async (id: number) => {
    const token = localStorage.getItem("token");
    // Endpoint supposé : PATCH /api/v1/rendez-vous/{id}/cancel
    const response = await fetch(`${API_BASE_URL}/${id}/cancel`, {
      method: "PATCH", 
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Erreur lors de l'annulation");
    return response.json();
  },
  
  validerPaiement: async (id: number) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/${id}/valider-paiement`, {
      method: "PATCH",
      headers: { "Authorization": `Bearer ${token}` }
    });
    return response.json();
  }
};