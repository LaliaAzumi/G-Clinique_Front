// src/services/apiChambre.ts
import { Chambre } from "@/types/chambre";

const BASE_URL = "http://localhost:8000/api/v1/chambres"; // FastAPI

export const apiChambre = {
  // Liste toutes les chambres
  getAll: async (token: string): Promise<Chambre[]> => {
    const res = await fetch(BASE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Erreur récupération chambres");
    const data = await res.json();
    return data;
  },

  // Récupère une chambre spécifique
  getOne: async (id: string, token: string): Promise<Chambre> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Erreur récupération chambre");
    return res.json();
  },

  // Crée une nouvelle chambre
  create: async (chambre: Omit<Chambre, "id">, token: string) => {
    const res = await fetch(`${BASE_URL}/create`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(chambre),
    });
    if (!res.ok) throw new Error("Erreur création chambre");
    return res.json();
  },

  // Met à jour une chambre
  update: async (id: string, chambre: Partial<Omit<Chambre, "id">>, token: string) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(chambre),
    });
    if (!res.ok) throw new Error("Erreur mise à jour chambre");
    return res.json();
  },

  // Supprime une chambre
  delete: async (id: string, token: string) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Erreur suppression chambre");
    return res.json();
  },
};