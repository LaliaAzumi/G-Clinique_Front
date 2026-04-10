import { useState, useEffect, useMemo } from "react";
import { Eye, Pencil, Plus, Search, Trash2, Bed } from "lucide-react";
import Pagination from "../components/Pagination";
import "./ListePage.css";
import { chambreService, Chambre } from "@/lib/api-chambres";
import { FullPageLoader } from "@/components/FullPageLoader";

const ITEMS_PER_PAGE = 10;

export default function ListeChambres() {
  const [chambres, setChambres] = useState<Chambre[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [etatFilter, setEtatFilter] = useState("Tous");
  const [typeFilter, setTypeFilter] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedChambre, setSelectedChambre] = useState<Chambre | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchChambres = async () => {
    try {
      setLoading(true);
      const data = await chambreService.getAll();
      setChambres(data);
    } catch (error) {
      console.error("Erreur API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChambres();
  }, []);

  const handleViewClick = (chambre: Chambre) => {
    setSelectedChambre(chambre);
    setIsModalOpen(true);
    setIsEditMode(false);
  };

  const handleEditClick = (chambre: Chambre) => {
    setSelectedChambre(chambre);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const filtered = chambres.filter((c) => {
    const nomChambre = c.nom || "";
    const matchSearch = nomChambre.toLowerCase().includes(search.toLowerCase());

    const matchEtat =
      etatFilter === "Tous" ||
      (etatFilter === "Libre" && c.etat) ||
      (etatFilter === "Occupée" && !c.etat);

    const matchType =
      typeFilter === "Tous" ||
      (typeFilter === "Standard" && !c.soinsIntensifs) ||
      (typeFilter === "Soins Intensifs" && c.soinsIntensifs);

    return matchSearch && matchEtat && matchType;
  });

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) return <FullPageLoader message="Chargement des chambres" />;

  const handleSave = async () => {
    if (!selectedChambre) return;
    setSaving(true);

    try {
      if (selectedChambre.id) {
        await chambreService.update(selectedChambre.id, selectedChambre);
        alert("Chambre modifiée avec succès !");
      } else {
        await chambreService.create(selectedChambre);
        alert("Chambre créée avec succès !");
      }

      setIsModalOpen(false);
      fetchChambres();
    } catch (error: any) {
      console.error("Erreur save:", error);
      alert(error.message || "Une erreur est survenue.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette chambre ?")) {
      try {
        await chambreService.delete(id);
        alert("Chambre supprimée !");
        fetchChambres();
      } catch (error: any) {
        console.error("Erreur lors de la suppression:", error);
        alert(error.message || "Erreur lors de la suppression.");
      }
    }
  };

  const ETAGES = [
    { value: "RDC", label: "Rez-de-chaussée" },
    { value: "1", label: "1er étage" },
    { value: "2", label: "2ème étage" },
    { value: "3", label: "3ème étage" },
    { value: "4", label: "4ème étage" },
  ];

  const handleAddClick = () => {
    setSelectedChambre({
      numero: "",
      nom: "",
      etat: true,
      prixJ: 0,
      etage: "RDC",
      soinsIntensifs: false,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const getStatusBadge = (etat: boolean) => {
    return etat ? (
      <span style={{ color: "#28a745", fontWeight: 600 }}>Libre</span>
    ) : (
      <span style={{ color: "#dc3545", fontWeight: 600 }}>Occupée</span>
    );
  };

  const getTypeBadge = (soinsIntensifs: boolean) => {
    return soinsIntensifs ? (
      <span style={{ background: "#ff6b6b", color: "white", padding: "4px 8px", borderRadius: "4px", fontSize: "12px" }}>
        Soins Intensifs
      </span>
    ) : (
      <span style={{ background: "#6c757d", color: "white", padding: "4px 8px", borderRadius: "4px", fontSize: "12px" }}>
        Standard
      </span>
    );
  };

  return (
    <div className="page-container">
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          backdrop-filter: blur(2px);
        }
        .modal-content {
          background: white;
          width: 450px;
          border-radius: 12px;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          animation: modalFadeIn 0.3s ease-out;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .modal-header {
          background: #f8f9fa;
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eee;
        }
        .modal-header h2 { margin: 0; font-size: 1.25rem; color: #333; }
        .close-btn { 
          background: none; border: none; font-size: 24px; cursor: pointer; color: #999; 
        }
        .close-btn:hover { color: #333; }
        .modal-body { padding: 20px; }
        .info-row { 
          display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #fafafa;
        }
        .info-row strong { color: #666; font-weight: 600; }
        .info-row span { color: #333; }
        .modal-footer { 
          padding: 15px 20px; background: #f8f9fa; text-align: right; border-top: 1px solid #eee;
        }
        .btn-close-modal {
          background: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;
        }
        .btn-close-modal:hover { background: #5a6268; }
        .modal-input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
          color: #333 !important; 
          background-color: #fff !important;
        }
        .modal-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }
        .checkbox-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0;
        }
        .checkbox-row input[type="checkbox"] {
          width: 18px;
          height: 18px;
        }
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 60vh;
          color: #6c757d;
        }
        .loading-container p {
          margin-top: 16px;
          font-size: 14px;
        }
        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e9ecef;
          border-top: 4px solid #0056b3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <div className="page-header">
        <div>
          <h1 className="page-title">Liste des chambres</h1>
          <p className="breadcrumb">Tableau de bord › Chambres</p>
        </div>
        <button className="btn-primary" type="button" onClick={handleAddClick}>
          <Plus size={16} /> Ajouter une chambre
        </button>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="search-input">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher par nom..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <div className="filter-group">
              <label className="filter-label">État :</label>
              <select
                className="filter-select"
                value={etatFilter}
                onChange={(e) => {
                  setEtatFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="Tous">Tous</option>
                <option value="Libre">Libre</option>
                <option value="Occupée">Occupée</option>
              </select>
            </div>
            <div className="filter-group">
              <label className="filter-label">Type :</label>
              <select
                className="filter-select"
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="Tous">Tous</option>
                <option value="Standard">Standard</option>
                <option value="Soins Intensifs">Soins Intensifs</option>
              </select>
            </div>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Numéro</th>
              <th>État</th>
              <th>Type</th>
              <th>Étage</th>
              <th>Prix/Jour</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((c) => (
              <tr key={c.id}>
                <td><strong>{c.id}</strong></td>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Bed size={16} color="#666" />
                    <strong>{c.nom}</strong>
                  </div>
                </td>
                <td>{c.numero}</td>
                <td>{getStatusBadge(c.etat)}</td>
                <td>{getTypeBadge(c.soinsIntensifs)}</td>
                <td>{ETAGES.find(e => e.value === c.etage)?.label || c.etage || "-"}</td>
                <td>{c.prixJ?.toLocaleString("fr-FR")} Ar</td>
                <td>
                  <div className="actions-cell">
                    <button className="action-btn view" onClick={() => handleViewClick(c)}>
                      <Eye size={15} />
                    </button>
                    <button className="action-btn edit" onClick={() => handleEditClick(c)}>
                      <Pencil size={15} />
                    </button>
                    <button className="action-btn delete" onClick={() => c.id && handleDeleteClick(c.id)}>
                      <Trash2 size={15} />
                    </button>
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

      {isModalOpen && selectedChambre && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {selectedChambre.id
                  ? `Modifier la Chambre : ${selectedChambre.nom}`
                  : "Ajouter une nouvelle Chambre"}
              </h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>

            <div className="modal-body">
              {/* ID caché - auto-incrémenté par le backend */}
              <input type="hidden" value={selectedChambre.id || ""} />
              {/* Numéro caché - auto-généré par le backend */}
              <input type="hidden" value={selectedChambre.numero || ""} />

              <div className="info-row">
                <strong>Nom</strong>
                {isEditMode ? (
                  <input
                    className="modal-input"
                    placeholder="Ex: A01, B01"
                    value={selectedChambre.nom}
                    onChange={(e) => setSelectedChambre({ ...selectedChambre, nom: e.target.value })}
                  />
                ) : (
                  <span><strong>{selectedChambre.nom}</strong></span>
                )}
              </div>

              <div className="info-row">
                <strong>État</strong>
                {isEditMode ? (
                  <select
                    className="modal-input"
                    value={selectedChambre.etat ? "true" : "false"}
                    onChange={(e) => setSelectedChambre({ ...selectedChambre, etat: e.target.value === "true" })}
                  >
                    <option value="true">Libre</option>
                    <option value="false">Occupée</option>
                  </select>
                ) : (
                  <span>{getStatusBadge(selectedChambre.etat)}</span>
                )}
              </div>

              <div className="info-row">
                <strong>Type</strong>
                {isEditMode ? (
                  <select
                    className="modal-input"
                    value={selectedChambre.soinsIntensifs ? "true" : "false"}
                    onChange={(e) => setSelectedChambre({ ...selectedChambre, soinsIntensifs: e.target.value === "true" })}
                  >
                    <option value="false">Standard</option>
                    <option value="true">Soins Intensifs</option>
                  </select>
                ) : (
                  <span>{getTypeBadge(selectedChambre.soinsIntensifs)}</span>
                )}
              </div>

              <div className="info-row">
                <strong>Étage</strong>
                {isEditMode ? (
                  <select
                    className="modal-input"
                    value={selectedChambre.etage || "RDC"}
                    onChange={(e) => setSelectedChambre({ ...selectedChambre, etage: e.target.value })}
                  >
                    {ETAGES.map((etage) => (
                      <option key={etage.value} value={etage.value}>{etage.label}</option>
                    ))}
                  </select>
                ) : (
                  <span>{ETAGES.find(e => e.value === selectedChambre.etage)?.label || selectedChambre.etage || "-"}</span>
                )}
              </div>

              <div className="info-row">
                <strong>Prix par jour (Ar)</strong>
                {isEditMode ? (
                  <input
                    className="modal-input"
                    type="number"
                    value={selectedChambre.prixJ}
                    onChange={(e) => setSelectedChambre({ ...selectedChambre, prixJ: parseFloat(e.target.value) || 0 })}
                  />
                ) : (
                  <span>{selectedChambre.prixJ?.toLocaleString("fr-FR")} Ar</span>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>
                Annuler
              </button>
              {isEditMode && (
                <button
                  className="btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                  style={{ display: "flex", alignItems: "center", gap: "6px", opacity: saving ? 0.7 : 1 }}
                >
                  {saving && (
                    <span style={{ display: "inline-block", width: "14px", height: "14px", border: "2px solid #fff", borderTop: "2px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }}></span>
                  )}
                  {saving ? "Enregistrement..." : (selectedChambre.id ? "Enregistrer" : "Créer")}
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
