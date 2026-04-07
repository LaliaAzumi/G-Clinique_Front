import { useState, useEffect, useCallback } from "react";
import { Eye, Pencil, Plus, Search, Trash2, User as UserIcon } from "lucide-react";
import { patientService } from "@/lib/api-patients"; // Import de votre service API
import Pagination from "../components/Pagination";
import "./ListePage.css";

// Interface basée sur votre modèle backend
interface Patient {
  id: number;
  nom: string;
  prenom: string;
  sexe: string;
  age: number;
  telephone: string;
  derniereConsultation?: string;
}

const ITEMS_PER_PAGE = 10;

export default function ListePatients() {
  // --- États ---
  const [patients, setPatients] = useState<Patient[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [search, setSearch] = useState("");
  const [sexeFilter, setSexeFilter] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);

  // --- Chargement des données ---
  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Rappel : Spring Boot utilise un index de page 0
      const data = await patientService.getAll(currentPage - 1, ITEMS_PER_PAGE);
      
      // Gestion de la réponse paginée de Spring Boot (objet Page)
      if (data && data.content) {
        setPatients(data.content);
        setTotalItems(data.totalElements);
      } else {
        // Fallback si l'API renvoie un tableau simple
        setPatients(Array.isArray(data) ? data : []);
        setTotalItems(Array.isArray(data) ? data.length : 0);
      }
    } catch (err: any) {
      setError(err.message || "Impossible de charger les patients.");
      console.error("Erreur Fetch:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // --- Filtrage local (Optionnel si non géré par le backend) ---
  const filteredPatients = patients.filter((p) => {
    const matchSearch =
      `${p.nom} ${p.prenom}`.toLowerCase().includes(search.toLowerCase()) ||
      p.telephone.includes(search);
    const matchSexe = sexeFilter === "Tous" || p.sexe === sexeFilter;
    return matchSearch && matchSexe;
  });

  // --- Rendu Interface ---
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Liste des patients</h1>
          <p className="breadcrumb">Tableau de bord › Patients</p>
        </div>
        <button className="btn-primary" type="button">
          <Plus size={16} />
          Ajouter un patient
        </button>
      </div>

      <div className="table-card">
        {/* Barre d'outils avec recherche et filtres */}
        <div className="table-toolbar">
          <div className="search-input">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher par nom ou téléphone..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          
          <div className="filter-group">
            <label className="filter-label">Sexe:</label>
            <select
              className="filter-select"
              value={sexeFilter}
              onChange={(e) => {
                setSexeFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="Tous">Tous</option>
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
            </select>
          </div>
        </div>

        {/* Gestion des états : Erreur / Chargement / Vide */}
        {error && <div className="error-message">⚠️ {error}</div>}
        
        {loading ? (
          <div className="loading-state">Chargement des données...</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Patient</th>
                <th>Nom complet</th>
                <th>Sexe</th>
                <th>Âge</th>
                <th>Téléphone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((p) => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td>
                      <span className="patient-name">
                        <strong>{p.nom.toUpperCase()}</strong> {p.prenom}
                      </span>
                    </td>
                    <td>
                      <div className="sexe-cell">
                        <div className={`sexe-icon sexe-${p.sexe === "Homme" ? "homme" : "femme"}`}>
                          <UserIcon size={13} />
                        </div>
                        {p.sexe}
                      </div>
                    </td>
                    <td>{p.age} ans</td>
                    <td>{p.telephone}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="action-btn view" title="Voir">
                          <Eye size={15} />
                        </button>
                        <button className="action-btn edit" title="Modifier">
                          <Pencil size={15} />
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
                  <td colSpan={6} style={{ textAlign: "center", padding: "2rem" }}>
                    Aucun patient trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Pagination connectée au backend */}
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}