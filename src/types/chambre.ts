// src/types/Chambre.ts
export interface Chambre {
  id: string;                  // correspond à Long en Java
  numero: string;              // numéro de chambre
  etat: boolean;               // true = libre, false = occupée
  prixJ: number;               // prix par jour
  etage?: number;              // étage (optionnel)
  isSoinsIntensifs: boolean;   // soins intensifs ou standard
}