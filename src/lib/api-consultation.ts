const API_BASE_URL = "http://localhost:8000/api/v1/consultations";

export const consultationService = {
  getByMedecin: async (medecinId: number) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/medecin/${medecinId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Erreur de récupération");
    return response.json();
  }
};