// L'URL pointe vers ton API FastAPI
const API_URL = "http://localhost:9090/api/v1/actes";

export const acteService = {
  /**
   * Récupère la liste de tous les actes (Public)
   */
 getAll: async () => {
  console.log("--- 1. Entrée dans acteService.getAll ---");
  try {
    const response = await fetch(`${API_URL}`, { method: "GET" });
    // console.log("--- 2. Réponse fetch reçue, statut :", response.status);

    if (!response.ok) {
      throw new Error("Erreur HTTP : " + response.status);
    }
    const result = await response.json();
    // console.log("--- 3. JSON parsé :", result);
    if (result && result.success) {
      console.log("--- 4. Succès détecté, retour de result.data ---");
      return result.data; 
    }   
    // console.log("--- 4. Retour du résultat direct ---");
    return result;

  } catch (error) {
    console.error("--- ERREUR dans acteService :", error);
    throw error;
  }
    },
};


//liste medecins avy @ base
// L'URL pointe vers ton API FastAPI pour les médecins (Port 8080)
const MED_API_URL = "http://localhost:9090/api/v1/medecins";

export const medecinService = {
  /**
   * Récupère la liste de tous les médecins (Public - Sans Token)
   */
  getAll: async () => {
    console.log("--- 1. Entrée dans medecinService.getAll ---");
    try {
      const response = await fetch(`${MED_API_URL}`, { 
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Erreur HTTP : " + response.status);
      }

      const result = await response.json();

      // Selon ta structure JSON : {"success":true, "data":{"medecins": [...]}}
      if (result && result.success && result.data && result.data.medecins) {
        console.log("--- 2. Succès : Retour de la liste des médecins ---");
        return result.data.medecins; 
      }   

      return result;

    } catch (error) {
      console.error("--- ERREUR dans medecinService :", error);
      throw error;
    }
  },
};

//visible par les gens /api/v1/rendez-vous/save-public
// --- AJOUT : SERVICE RENDEZ-VOUS ---
const RDV_API_URL = "http://localhost:8000/api/v1/rendez-vous";

export const rendezVousService = {
  /**
   * Crée un rendez-vous complet (Patient + RDV + Paiement)
   * ACCÈS PUBLIC : Pas de token requis
   */
  savePublic: async (rdvData) => {
    console.log("--- 1. Envoi du RDV public ---", rdvData);
    try {
      const response = await fetch(`${RDV_API_URL}/save-public`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rdvData),
      });

      const result = await response.json();

      if (!response.ok) {
        // On récupère le message d'erreur envoyé par FastAPI/Spring Boot
        throw new Error(result.detail || "Erreur lors de l'enregistrement");
      }

      console.log("--- 2. Succès : RDV enregistré ---", result);
      return result;
    } catch (error) {
      console.error("--- ERREUR dans rendezVousService :", error);
      throw error;
    }
  },
};