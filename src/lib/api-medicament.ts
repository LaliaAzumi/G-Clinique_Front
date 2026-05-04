import { Medicament } from "../types/medicament";

const API_URL = "http://localhost:8000/api/v1/medicaments";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  console.log("Token récupéré pour API:", token); // Debug
  return {
    Authorization: `Bearer ${token}`,
  };
}

export const medicamentService = {
  // ----------------------------
  // LISTE + PAGINATION
  // ----------------------------
  getAll: async (page = 0, size = 100, keyword?: string): Promise<any> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (keyword) params.append("keyword", keyword);

    const res = await fetch(`${API_URL}?${params.toString()}`, {
      method: "GET",
      headers: {
        ...getAuthHeader(),
      },
    });


    if (!res.ok) {
      throw new Error("Erreur lors du chargement des médicaments");
    }

    return res.json();
  },

  // ----------------------------
  // GET BY ID
  // ----------------------------
  getById: async (id: string): Promise<Medicament> => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      headers: {
        ...getAuthHeader(),
      },
    });

    if (!res.ok) {
      throw new Error("Médicament introuvable");
    }

    return res.json();
  },

  // ----------------------------
  // CREATE / UPDATE
  // ----------------------------
  save: async (medicament: Medicament) => {
    const res = await fetch(`${API_URL}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(medicament),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Erreur sauvegarde médicament");
    }

    return res.json();
  },

  // ----------------------------
  // DELETE
  // ----------------------------
  delete: async (id: string) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeader(),
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Erreur suppression");
    }

    return res.json();
  },

  // ----------------------------
  // SEARCH
  // ----------------------------
  search: async (keyword: string): Promise<any> => {
    const res = await fetch(
      `${API_URL}/search?keyword=${encodeURIComponent(keyword)}`,
      {
        method: "GET",
        headers: {
          ...getAuthHeader(),
        },
      }
    );

    if (!res.ok) {
      throw new Error("Erreur recherche médicaments");
    }

    return res.json();
  },
  update: async (id: Number, medicament: Medicament) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(medicament),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Erreur update médicament");
  }

  return res.json();
},
};