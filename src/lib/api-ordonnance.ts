const API_URL = "http://localhost:8000/api/v1/ordonnances";
export const SPRING_URL = "http://localhost:9090";

const getToken = () => localStorage.getItem("token");

export const ordonnanceService = {
  searchByPatient: async (name: string) => {
    const response = await fetch(
      `${API_URL}/search?name=${encodeURIComponent(name)}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || "Erreur recherche");
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data?.data?.ordonnances || data?.ordonnances || [];
  },

  markAsPaid: async (id: number) => {
    const response = await fetch(`${API_URL}/${id}/pay`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new Error(msg || "Erreur paiement");
    }

    return response.json();
  },

  getPdfUrl: (id: number) => `${SPRING_URL}/api/v1/ordonnances/${id}/pdf`,
};
