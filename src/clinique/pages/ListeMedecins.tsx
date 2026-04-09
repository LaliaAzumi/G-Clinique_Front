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
  if (!selectedMedecin) return;

  try {
    if (selectedMedecin.medecinId) {
      // MODE ÉDITION (Update) - On garde l'objet tel quel car ton @PutMapping est différent
      await medecinService.update(selectedMedecin.medecinId, selectedMedecin);
      alert("Médecin modifié avec succès !");
    } else {
      // MODE CRÉATION - On restructure pour correspondre au Java
      const dataToCreate = {
        medecin: {
          nom: selectedMedecin.nom,
          specialite: selectedMedecin.specialite,
          telephone: selectedMedecin.telephone,
          adresse: selectedMedecin.adresse
        },
        username: (selectedMedecin as any).username,
        email: (selectedMedecin as any).email
      };

      console.log("Envoi de la structure correcte :", dataToCreate);
      
      await medecinService.createWithUser(dataToCreate);
      alert("Médecin et compte utilisateur créés !");
    }

    setIsModalOpen(false);
    fetchMedecins();
  } catch (error) {
    console.error("Erreur save:", error);
    alert("Une erreur est survenue lors de la création.");
  }
};
const handleDeleteClick = async (id: number | string) => {
  if (window.confirm("Voulez-vous vraiment supprimer ce médecin ?")) {
    try {
      await medecinService.delete(id.toString());
      alert("Médecin supprimé !");
      fetchMedecins(); // Rafraîchit la liste automatiquement
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression.");
    }
  }
};
const handleAddClick = () => {
  setSelectedMedecin({
    nom: "",
    specialite: "",
    telephone: "",
    email: "",
    username: "",
    adresse: "",
  } as any);

  setIsEditMode(true);
  setIsModalOpen(true);
};

const SPECIALITES_LISTE = [
  "Cardiologie",
  "Dermatologie",
  "Généraliste",
  "Neurologie",
  "Pédiatrie",
  "Psychiatrie",
  "Radiologie",
  "Ophtalmologie"
];

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
        <button className="btn-primary" type="button"onClick={handleAddClick}>
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
                    <button className="action-btn delete" onClick={() => handleDeleteClick(m.medecinId)}><Trash2 size={15} /></button>
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
      
      {/* HEADER : Titre dynamique */}
      <div className="modal-header">
        <h2>
          {selectedMedecin.medecinId 
            ? `Modifier le Médecin : ${selectedMedecin.nom}` 
            : "Ajouter un nouveau Médecin"}
        </h2>
        <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
      </div>

      {/* BODY : Formulaire ou Consultation */}
      <div className="modal-body">
        
        {/* ID : Affiché uniquement en modification */}
        {selectedMedecin.medecinId && (
          <div className="info-row">
            <strong>ID</strong>
            <span>{selectedMedecin.medecinId}</span>
          </div>
        )}

        {/* NOM */}
        <div className="info-row">
          <strong>Nom</strong>
          {isEditMode ? (
            <input 
              className="modal-input"
              value={selectedMedecin.nom || ""} 
              onChange={(e) => setSelectedMedecin({...selectedMedecin, nom: e.target.value})}
            />
          ) : (
            <span>{selectedMedecin.nom}</span>
          )}
        </div>

      

        {/* SPÉCIALITÉ */}
        <div className="info-row">
  <strong>Spécialité</strong>
  {isEditMode ? (
    <select 
      className="modal-input"
      value={selectedMedecin.specialite || ""} 
      onChange={(e) => setSelectedMedecin({...selectedMedecin, specialite: e.target.value})}
    >
      <option value="" disabled>Choisir une spécialité</option>
      {SPECIALITES_LISTE.map((spec) => (
        <option key={spec} value={spec}>
          {spec}
        </option>
      ))}
    </select>
  ) : (
    <span>{selectedMedecin.specialite}</span>
  )}
</div>

        {/* TÉLÉPHONE */}
        <div className="info-row">
          <strong>Téléphone</strong>
          {isEditMode ? (
            <input 
              className="modal-input"
              value={selectedMedecin.telephone || ""} 
              onChange={(e) => setSelectedMedecin({...selectedMedecin, telephone: e.target.value})}
            />
          ) : (
            <span>{selectedMedecin.telephone}</span>
          )}
        </div>

        {/* EMAIL (Sert aussi pour la création du compte utilisateur) */}
        <div className="info-row">
          <strong>Email</strong>
          {isEditMode ? (
            <input 
              className="modal-input"
              type="email"
              value={selectedMedecin.email || ""} 
              onChange={(e) => setSelectedMedecin({...selectedMedecin, email: e.target.value})}
            />
          ) : (
            <span>{selectedMedecin.email || "Non défini"}</span>
          )}
        </div>

        {/* NOM D'UTILISATEUR (Pour le compte lié) */}
        <div className="info-row">
          <strong>Utilisateur</strong>
          {isEditMode ? (
            <input 
              className="modal-input"
              placeholder="Nom de connexion"
              value={(selectedMedecin as any).username || ""} 
              onChange={(e) => setSelectedMedecin({...selectedMedecin, username: e.target.value})}
            />
          ) : (
            <span>{(selectedMedecin as any).username || "N/A"}</span>
          )}
        </div>

        {/* ADRESSE */}
        <div className="info-row">
          <strong>Adresse</strong>
          {isEditMode ? (
            <input 
              className="modal-input"
              value={selectedMedecin.adresse || ""} 
              onChange={(e) => setSelectedMedecin({...selectedMedecin, adresse: e.target.value})}
            />
          ) : (
            <span>{selectedMedecin.adresse || "Non renseignée"}</span>
          )}
        </div>
      </div>

      {/* FOOTER : Actions */}
      <div className="modal-footer">
        <button className="btn-close-modal" onClick={() => setIsModalOpen(false)}>
          Annuler
        </button>
        {isEditMode && (
          <button className="btn-primary" onClick={handleSave}>
            {selectedMedecin.medecinId ? "Enregistrer les modifications" : "Créer le médecin"}
          </button>
        )}
      </div>

    </div>
  </div>
)}
    </div>
  );
}