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
    const response = await fetch(`${API_BASE_URL}/${id}/annuler`, {
      method: "PUT", 
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
  },

  annuler: async (id: string) => {
      const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE_URL}/${id}/annuler`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
      throw new Error("Erreur annulation");
    }

    return res.json();
  },

  getRdvPaiements: async () => {
    const token = localStorage.getItem("token");
    // console.log("TOKEN =", token);

    const res = await fetch(`${API_BASE_URL}/rdv-paiements`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Erreur chargement RDV paiements");

    return res.json();
  },

  cancelPayment: async (id: number) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/${id}/annuler`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error("Erreur lors de l'annulation du paiement");
    return response.json();
  },

  // medecin reporter rdv
  reporter: async (id: number) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/rdv/${id}/reporter`, {
      method: "PUT",
      headers: { 
        "Authorization": `Bearer ${token}` 
      }
    });

    if (!response.ok) {
      throw new Error("Erreur lors du report du RDV");
    }

    return response.json();
  },

};