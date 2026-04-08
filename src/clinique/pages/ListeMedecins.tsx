import { useState, useEffect, useMemo } from "react";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Pagination from "../components/Pagination";
import "./ListePage.css";
import { medecinService } from "@/lib/api-medecins";
import { Medecin } from "@/types/medecins";

const ITEMS_PER_PAGE = 10;

export default function ListeMedecins() {
  // --- ÉTATS PRINCIPAUX ---
  const [medecins, setMedecins] = useState<Medecin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialiteFilter, setSpecialiteFilter] = useState("Toutes");
  const [currentPage, setCurrentPage] = useState(1);

  // --- ÉTATS POUR LA MODALE ---
  const [selectedMedecin, setSelectedMedecin] = useState<Medecin | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // --- CHARGEMENT DES DONNÉES ---
  const fetchMedecins = async () => {
    try {
      setLoading(true);
      const data = await medecinService.getAll();
      setMedecins(data);
      //console.log(data);
    } catch (error) {
      console.error("Erreur API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedecins();
  }, []);

  // --- CALCUL DES SPÉCIALITÉS UNIQUES ---
  const specialitesUniques = useMemo(() => {
    return [...new Set(medecins.map((m) => m.specialite))]
      .filter((spec) => spec)
      .sort((a, b) => a.localeCompare(b));
  }, [medecins]);

  // --- GESTION DES ACTIONS ---
  const handleViewClick = (medecin: Medecin) => {
    setSelectedMedecin(medecin);
    setIsModalOpen(true);
    setIsEditMode(false);
  };

  // Pour le crayon (Modification)
const handleEditClick = (medecin: Medecin) => {
  setSelectedMedecin(medecin);
  setIsEditMode(true);
  setIsModalOpen(true);
};

  // --- LOGIQUE DE FILTRAGE ---
  const filtered = medecins.filter((m) => {
    const nomMedecin = m.nom || "";
    const specialiteMedecin = m.specialite || "";
    const emailMedecin = (m as any).email || "";
    const telephoneMedecin = m.telephone || "";

    const matchSearch =
      nomMedecin.toLowerCase().includes(search.toLowerCase()) ||
      specialiteMedecin.toLowerCase().includes(search.toLowerCase()) ||
      emailMedecin.toLowerCase().includes(search.toLowerCase()) ||
      telephoneMedecin.toLowerCase().includes(search.toLowerCase());

    const matchSpec =
      specialiteFilter === "Toutes" || specialiteMedecin === specialiteFilter;

    return matchSearch && matchSpec;
  });

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (loading) return <div className="p-10">Chargement des données...</div>;
  const handleSave = async () => {
    // 1. Vérifie si l'objet existe
    if (!selectedMedecin) {
        console.error("Aucun médecin sélectionné dans le state");
        return;
    }

    // 2. Vérifie si l'ID est bien présent
    console.log("ID envoyé au backend :", selectedMedecin.id);
    console.log("Données complètes :", selectedMedecin);

    if (!selectedMedecin.id) {
        alert("Erreur : L'ID du médecin est manquant !");
        return;
    }

    try {
        // On force le passage de l'ID en premier argument
        // await medecinService.update(selectedMedecin.id, selectedMedecin);
        // Dans ton code React, change cette ligne :
await medecinService.update(selectedMedecin.medecinId, selectedMedecin); 
// Au lieu de selectedMedecin.id qui semble être erroné
        
        setIsModalOpen(false);
        fetchMedecins(); // Recharge la liste
        alert("Modification enregistrée !");
    } catch (error) {
        console.error("Erreur save:", error);
        alert("Erreur lors de la sauvegarde : " + error);
    }
};

  return (
    <div className="page-container">
      {/* INJECTION DU CSS DE LA MODALE */}
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
          /* FORCE LA COULEUR ICI */
          color: #333 !important; 
          background-color: #fff !important;
        }

        .modal-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }
      `}</style>

      <div className="page-header">
        <div>
          <h1 className="page-title">Liste des médecins</h1>
          <p className="breadcrumb">Tableau de bord › Médecins</p>
        </div>
        <button className="btn-primary" type="button">
          <Plus size={16} /> Ajouter un médecin
        </button>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="search-input">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="filter-group">
            <label className="filter-label">Spécialité :</label>
            <select
              className="filter-select"
              value={specialiteFilter}
              onChange={(e) => {
                setSpecialiteFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="Toutes">Toutes</option>
              {specialitesUniques.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Spécialité</th>
              <th>Téléphone</th>
              <th>E-mail</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((m) => (
              <tr key={m.medecinId}>
                <td><strong>{m.medecinId}</strong></td>
                <td><strong>{m.nom}</strong></td>
                <td>{m.specialite}</td>
                <td>{m.telephone}</td>
                <td className="text-muted">{m.email}</td>
                <td>
                  <div className="actions-cell">
                    <button className="action-btn view" onClick={() => handleViewClick(m)}>
                      <Eye size={15} />
                    </button>
                    <button className="action-btn edit" onClick={() => handleEditClick(m)}><Pencil size={15} /></button>
                    <button className="action-btn delete"><Trash2 size={15} /></button>
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

      {/* AFFICHAGE CONDITIONNEL DE LA MODALE */}
      {isModalOpen && selectedMedecin && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Fiche Médecin</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="info-row"><strong>ID</strong>
               <span>{selectedMedecin.medecinId}</span></div>
              <div className="info-row"><strong>Nom</strong>
              {/* <span>{selectedMedecin.nom}</span></div> */}{isEditMode ? (
                <input 
                  className="modal-input"
                  defaultValue={selectedMedecin.nom} 
                  onChange={(e) => setSelectedMedecin({...selectedMedecin, nom: e.target.value})}
                />
              ) : (
                <span>{selectedMedecin.nom}</span>
              )}</div>
              <div className="info-row"><strong>Spécialité</strong>
               {/* <span>{selectedMedecin.specialite}</span></div> */}
               {isEditMode ? (
                <input 
                  className="modal-input"
                  defaultValue={selectedMedecin.specialite} 
                  onChange={(e) => setSelectedMedecin({...selectedMedecin, specialite: e.target.value})}
                />
              ) : (
                <span>{selectedMedecin.specialite}</span>
              )}</div>
              <div className="info-row"><strong>Téléphone</strong>
               {/* <span>{selectedMedecin.telephone}</span></div> */}
               {isEditMode ? (
                <input 
                  className="modal-input"
                  defaultValue={selectedMedecin.telephone} 
                  onChange={(e) => setSelectedMedecin({...selectedMedecin, telephone: e.target.value})}
                />
              ) : (
                <span>{selectedMedecin.telephone}</span>
              )}</div>
              <div className="info-row"><strong>Email</strong> 
              {/* <span>{selectedMedecin.email || "Non défini"}</span></div> */}
               {isEditMode ? (
                <input 
                  className="modal-input"
                  defaultValue={selectedMedecin.email} 
                  onChange={(e) => setSelectedMedecin({...selectedMedecin, email: e.target.value})}
                />
              ) : (
                <span>{selectedMedecin.email}</span>
              )}</div>
              <div className="info-row"><strong>Utilisateur</strong> 
              {/* <span>{(selectedMedecin as any).username || "N/A"}</span></div> */}
               {isEditMode ? (
                <input 
                  className="modal-input"
                  defaultValue={(selectedMedecin as any).username} 
                  onChange={(e) => setSelectedMedecin({...selectedMedecin, username: e.target.value})}
                />
              ) : (
                <span>{(selectedMedecin as any).username}</span>
              )}</div>
              <div className="info-row"><strong>adresse</strong> 
              {/* <span>{(selectedMedecin as any).adresse }</span></div> */}
              {isEditMode ? (
                <input 
                  className="modal-input"
                  value={selectedMedecin.adresse} 
                  onChange={(e) => setSelectedMedecin({...selectedMedecin, adresse: e.target.value})}
                />
              ) : (
                <span>{selectedMedecin.adresse}</span>
              )}</div>

            </div>
            <div className="modal-footer">
              <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>Fermer</button>
              {isEditMode && (
    <button className="btn-primary" onClick={handleSave}>
      Enregistrer
    </button>
  )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}