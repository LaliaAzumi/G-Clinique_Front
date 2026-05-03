import { Agenda } from "@/types/agenda";

const API_URL = "http://localhost:8000/api/v1/calendar";

export const agendaService = {
  /**
   * Récupère les événements (RDV)
   */
  getEvents: async (startDate?: string): Promise<Agenda[]> => {
    try {
      const token = localStorage.getItem("token");
      // const userId = localStorage.getItem("userId");
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id; // Assure-toi que c'est le bon champ (id

      // 🔍 sécurité minimale
      if (!token) throw new Error("Token manquant");
      if (!userId) throw new Error("UserId manquant");

      // params
      const params = new URLSearchParams();
      if (startDate) params.append("startOfWeek", startDate);

      const url = `${API_URL}/eventsN/${userId}?${params.toString()}`;

      console.log("URL =", url);
      console.log("TOKEN =", token);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      // 🔥 gestion propre des erreurs
      if (response.status === 401) {
        throw new Error("Non autorisé (401)");
      }

      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      const result = await response.json();

      return Array.isArray(result) ? result : (result.data || []);

    } catch (error) {
      console.error("Erreur dans agendaService.getEvents :", error);
      throw error;
    }
  },

  /**
   * Création d'un rendez-vous
   */
  createEvent: async (eventData: Partial<Agenda>): Promise<Agenda> => {
    try {
      const token = localStorage.getItem("token");

      if (!token) throw new Error("Token manquant");

      const response = await fetch(`${API_URL}/event`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(eventData),
      });

      if (response.status === 401) {
        throw new Error("Non autorisé (401)");
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Erreur lors de la création du RDV");
      }

      return await response.json();

    } catch (error) {
      console.error("Erreur dans agendaService.createEvent :", error);
      throw error;
    }
  }
};