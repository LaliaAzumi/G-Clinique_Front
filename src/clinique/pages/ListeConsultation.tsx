import { useState, useEffect, useMemo } from "react";
import { Eye, Search, FileText, Calendar, X, Activity, Thermometer, Heart, Weight, ClipboardList } from "lucide-react";
import Pagination from "../components/Pagination";
import "./ListePage.css"; 
import { consultationService } from "@/lib/api-consultation";

const ITEMS_PER_PAGE = 10;

export default function ListeConsultations() {
  const [medecinId, setMedecinId] = useState<number | null>(null);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  
  // État pour la popup (Modal)
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);

  // --- CHARGEMENT DES DONNÉES ---
  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        setMedecinId(user.id);
        const response = await consultationService.getByMedecin(Number(user.id));
        const dataArray = response.data ? response.data : response;
        setConsultations(Array.isArray(dataArray) ? dataArray : []);
        console.log("Consultations récupérées:", dataArray); // Debug des données
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  // --- FONCTION DE FORMATAGE DU DIAGNOSTIC ---
  // Transforme "Temp: 37 / Tension: 12/8" en éléments visuels
  const formatDiagnostic = (diagString: string) => {
    if (!diagString) return "Aucune donnée";
    
    // Découpage par "/" ou par retour à la ligne
    const parts = diagString.split(/[/\n\r]+/).map(p => p.trim()).filter(p => p !== "");
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
        {parts.map((part, index) => {
          let icon = <Activity size={16} className="text-blue-500" />;
          if (part.toLowerCase().includes("temp")) icon = <Thermometer size={16} className="text-orange-500" />;
          if (part.toLowerCase().includes("tension")) icon = <Heart size={16} className="text-red-500" />;
          if (part.toLowerCase().includes("poids")) icon = <Weight size={16} className="text-emerald-500" />;
          if (part.toLowerCase().includes("obs")) icon = <ClipboardList size={16} className="text-purple-500" />;

          return (
            <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-100">
              {icon}
              <span className="text-sm font-medium text-gray-700">{part}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // --- FILTRAGE ET PAGINATION ---
  const filtered = useMemo(() => {
    return consultations.filter((c) => {
      const patientNom = c.rendezVous?.patient?.nom || "";
      const searchLower = search.toLowerCase();
      return (
        patientNom.toLowerCase().includes(searchLower) ||
        (c.maladie || "").toLowerCase().includes(searchLower) ||
        (c.diagnostique || "").toLowerCase().includes(searchLower)
      );
    });
  }, [consultations, search]);

  const paginated = useMemo(() => {
    return filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  if (loading) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Historique des Consultations</h1>
          <p className="breadcrumb">Médecin › ID #{medecinId} › Consultations</p>
        </div>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="search-input">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Patient</th>
              <th>Maladie</th>
              <th>Diagnostic Rapide</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((c) => (
              <tr key={c.id}>
                <td><strong>{new Date(c.date).toLocaleDateString()}</strong></td>
                <td>{c.rendezVous?.patient?.nom}</td>
                <td><span className="badge-maladie">{c.maladie}</span></td>
                <td className="text-truncate">{c.diagnostique}</td>
                <td>
                  <div className="actions-cell">
                    <button 
                      className="action-btn view" 
                      onClick={() => setSelectedConsultation(c)}
                      title="Voir détails"
                    >
                      <Eye size={15} />
                    </button>
                    {/* <button className="action-btn edit" title="Ordonnance">
                      <FileText size={15} />
                    </button> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* --- MODAL DE DÉTAILS --- */}
      {selectedConsultation && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Détails de la Consultation</h2>
              <button onClick={() => setSelectedConsultation(null)} className="close-btn">
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="info-section">
                <label>Patient</label>
                <p className="val">{selectedConsultation.rendezVous?.patient?.nom}</p>
              </div>

              <div className="info-section">
                <label>Date & Maladie</label>
                <p className="val">
                  Le {new Date(selectedConsultation.date).toLocaleDateString()} — 
                  <span className="text-blue-600 font-bold ml-2">{selectedConsultation.maladie}</span>
                </p>
              </div>

              <div className="info-section mt-4">
                <label className="mb-2 block text-sm font-semibold text-gray-500 uppercase tracking-wider">
                  Paramètres vitaux & Diagnostic
                </label>
                {formatDiagnostic(selectedConsultation.diagnostique)}
              </div>
            </div>

            <div className="modal-footer">
              {/* <button className="btn-print" onClick={() => window.print()}>
                <FileText size={16} /> Imprimer le compte-rendu
              </button> */}
              <button className="btn-close-action" onClick={() => setSelectedConsultation(null)}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS INTERNE POUR LA MODAL ET LE DESIGN */}
      <style>{`
        .text-truncate {
            max-width: 200px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #666;
            font-size: 0.85rem;
        }
        .badge-maladie {
            background: #e0f2f1;
            color: #00796b;
            padding: 4px 10px;
            border-radius: 50px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(4px);
        }
        .modal-content {
            background: white;
            width: 90%;
            max-width: 600px;
            border-radius: 16px;
            box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
            overflow: hidden;
            animation: slideUp 0.3s ease-out;
        }
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .modal-header {
            padding: 20px;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8fafc;
        }
        .modal-header h2 { font-size: 1.25rem; color: #1e293b; margin: 0; }
        .modal-body { padding: 24px; }
        .info-section { margin-bottom: 16px; }
        .info-section label { font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; font-weight: 700; }
        .info-section .val { font-size: 1.1rem; color: #334155; margin-top: 4px; }
        .modal-footer {
            padding: 16px 24px;
            background: #f8fafc;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
            border-top: 1px solid #eee;
        }
        .btn-print {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #2563eb;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
        }
        .btn-close-action {
            background: white;
            border: 1px solid #e2e8f0;
            padding: 8px 16px;
            border-radius: 8px;
            cursor: pointer;
            color: #64748b;
        }
        .grid { display: grid; }
        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .gap-3 { gap: 0.75rem; }
      `}</style>
    </div>
  );
}