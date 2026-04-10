import React, { useState, useEffect } from "react";
import { Eye, Search, History, Trash2, Calendar, FileText } from "lucide-react";
import Pagination from "../components/Pagination";
import "./ListePage.css"; // Ton CSS avec les variables --glass-bg, etc.

// Définition des types pour TypeScript
interface Patient {
  nom: string;
  prenom: string;
}

interface RendezVous {
  id: number;
  motif: string;
  patient: Patient;
}

interface Consultation {
  id: number;
  date: string;
  diagnostique: string;
  maladie: string;
  rendezVous: RendezVous;
}

const ConsultationList: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const ITEMS_PER_PAGE = 5; // Aligné avec ton @RequestParam(defaultValue = "5")

  // Fonction pour charger les données
  const loadConsultations = async () => {
    setLoading(true);
    try {
      // Construction de l'URL avec les paramètres attendus par ton Controller
      const url = new URL("http://localhost:8080/consultations/api/list");
      url.searchParams.append("page", (currentPage - 1).toString());
      url.searchParams.append("size", ITEMS_PER_PAGE.toString());
      if (search) url.searchParams.append("keyword", search);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error("Erreur lors de la récupération");
      
      const data = await response.json();
      setConsultations(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Erreur API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsultations();
  }, [currentPage, search]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <History className="text-primary" /> Historique des Consultations
          </h1>
          <p className="breadcrumb">Tableau de bord › Consultations</p>
        </div>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="search-input">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher par nom de patient..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Patient</th>
              <th>Diagnostic / Maladie</th>
              <th>Motif</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-10">
                  <span className="animate-pulse text-primary-3">Chargement des données...</span>
                </td>
              </tr>
            ) : consultations.length > 0 ? (
              consultations.map((c) => (
                <tr key={c.id}>
                  <td><span className="id-badge">#{c.id}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-primary-2" />
                      {new Date(c.date).toLocaleDateString("fr-FR")}
                    </div>
                  </td>
                  <td>
                    <strong>{c.rendezVous.patient.nom.toUpperCase()}</strong> {c.rendezVous.patient.prenom}
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="specialite-tag w-fit mb-1">{c.maladie || "Général"}</span>
                      <span className="text-xs text-muted italic truncate w-48" title={c.diagnostique}>
                        {c.diagnostique}
                      </span>
                    </div>
                  </td>
                  <td className="text-muted">{c.rendezVous.motif}</td>
                  <td>
                    <div className="actions-cell">
                      <button className="action-btn view" title="Voir l'ordonnance">
                        <FileText size={15} />
                      </button>
                      <button className="action-btn edit" title="Détails">
                        <Eye size={15} />
                      </button>
                      <button className="action-btn delete" title="Supprimer">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-10 text-muted">
                  Aucune consultation trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalItems={totalPages * ITEMS_PER_PAGE}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default ConsultationList;