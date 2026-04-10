import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FullPageLoader } from "@/components/FullPageLoader";
import { Stethoscope, Search, Calendar, Clock, User, ChevronLeft, ChevronRight, FileText } from "lucide-react";

interface Consultation {
  id: number;
  date: string;
  diagnostique: string;
  maladie: string;
  patient: {
    id: number;
    nom: string;
    prenom: string;
    telephone: string;
  };
  heure: string;
  motif: string;
  statut: string;
}

export default function ListeConsultations() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [viewMode, setViewMode] = useState<"today" | "all">("today");
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConsultations();
  }, [currentPage, selectedDate, viewMode]);

  const fetchConsultations = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const url = viewMode === "today"
        ? "http://localhost:8080/api/v1/consultations/today"
        : `http://localhost:8080/api/v1/consultations?page=${currentPage - 1}&size=10&date=${selectedDate}`;

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erreur ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setConsultations(data.data.consultations || []);
        setTotalPages(data.data.totalPages || 1);
      } else {
        throw new Error(data.message || "Erreur lors du chargement");
      }
    } catch (err: any) {
      console.error("Erreur fetch consultations:", err);
      setError(err.message || "Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  const filteredConsultations = consultations.filter((c) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      c.patient.nom.toLowerCase().includes(searchLower) ||
      c.patient.prenom.toLowerCase().includes(searchLower) ||
      c.motif.toLowerCase().includes(searchLower) ||
      c.maladie.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (statut: string) => {
    const styles: Record<string, { bg: string; color: string; label: string }> = {
      EN_ATTENTE: { bg: "#fff9db", color: "#f59f00", label: "En attente" },
      TERMINE: { bg: "#d3f9d8", color: "#2b8a3e", label: "Terminé" },
      ANNULE: { bg: "#ffe3e3", color: "#c92a2a", label: "Annulé" },
    };

    const style = styles[statut] || { bg: "#f8f9fa", color: "#666", label: statut };

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "4px 10px",
          borderRadius: "9999px",
          fontSize: "0.75rem",
          fontWeight: 600,
          backgroundColor: style.bg,
          color: style.color,
        }}
      >
        {style.label}
      </span>
    );
  };

  if (loading) {
    return <FullPageLoader message="Chargement des consultations..." />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-title">
          <Stethoscope size={28} color="#0d9488" />
          <h1>Consultations</h1>
        </div>
        <p className="text-slate-500 mt-1">
          {viewMode === "today"
            ? `Patients du jour à consulter - ${new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}`
            : "Liste des consultations"}
        </p>
      </div>

      <div className="filters-container">
        <div className="view-toggle">
          <button
            className={`toggle-btn ${viewMode === "today" ? "active" : ""}`}
            onClick={() => { setViewMode("today"); setCurrentPage(1); }}
          >
            <Calendar size={16} />
            Aujourd&apos;hui
          </button>
          <button
            className={`toggle-btn ${viewMode === "all" ? "active" : ""}`}
            onClick={() => { setViewMode("all"); setCurrentPage(1); }}
          >
            <FileText size={16} />
            Toutes
          </button>
        </div>

        <div className="search-filter">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher un patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {viewMode === "all" && (
          <div className="date-filter">
            <Calendar size={16} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-input"
            />
          </div>
        )}
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="table-card">
        <div className="table-header">
          <h3>
            {viewMode === "today"
              ? `${filteredConsultations.length} patient(s) à consulter aujourd'hui`
              : `${filteredConsultations.length} consultation(s)`}
          </h3>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Heure</th>
              <th>Patient</th>
              <th>Motif</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredConsultations.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-cell">
                  <div className="empty-state">
                    <Stethoscope size={48} color="#cbd5e1" />
                    <p>Aucune consultation {viewMode === "today" ? "prévue aujourd'hui" : "trouvée"}</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredConsultations.map((consultation) => (
                <tr key={consultation.id}>
                  <td>
                    <div className="time-cell">
                      <Clock size={14} />
                      {consultation.heure || "--:--"}
                    </div>
                  </td>
                  <td>
                    <div className="patient-cell">
                      <User size={16} />
                      <div>
                        <strong>{consultation.patient.prenom} {consultation.patient.nom}</strong>
                        <small>{consultation.patient.telephone}</small>
                      </div>
                    </div>
                  </td>
                  <td>{consultation.motif || "-"}</td>
                  <td>{getStatusBadge(consultation.statut)}</td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="action-btn view"
                        onClick={() => {}}
                        title="Voir détails"
                      >
                        <FileText size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {viewMode === "all" && totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="page-info">
              Page {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
