export interface Agenda {
    id?: number;              // Optionnel car absent lors de la création
    title: string;           // Le libellé du RDV
    start: string | Date;    // Format ISO "2026-04-09T10:00:00"
    end: string | Date;
    patientId?: number;      // Pour lier au dossier médical
    medecinId: number;       // L'ID du médecin concerné
    description?: string;
    statut?: string;         // ex: "CONFIRME", "ANNULE"
}