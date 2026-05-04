import { useState, useEffect } from "react";
import { Eye, Pencil, Plus, Search, Trash2, User, X } from "lucide-react";
import { patientService } from "@/lib/api-patients"; 
import Pagination from "../components/Pagination";
import { Patient } from "@/types/patient";
import "./ListePage.css";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import AddPatientForm from "@/components/AddPatientForm";

const ITEMS_PER_PAGE = 10;

const calculateAge = (birthDate: string) => {
  if (!birthDate) return "N/A";
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.abs(new Date(diff).getUTCFullYear() - 1970);
};

export default function ListePatients() {
  // --- ÉTATS ---
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sexeFilter, setSexeFilter] = useState("Tous");
  const [currentPage, setCurrentPage] = useState(1);
  
  // États pour les Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // --- CHARGEMENT ---
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await patientService.getAll();
      setPatients(Array.isArray(data) ? data : []);
      console.log("Patients chargés :", data);
    } catch (error) {
      console.error("Erreur chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // --- ACTIONS ---
  const handleDelete = async (id: number) => {
    if (window.confirm("Supprimer ce patient définitivement ?")) {
      try {
        await patientService.delete(id);
        setPatients(patients.filter(p => p.id !== id));
      } catch (error) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleSave = async (payload: any) => {
    console.log("PAYLOAD UPDATE :", payload);
    try {
      if (payload.id) {
        await patientService.update(payload);
      } else {
        await patientService.create(payload);
      }
      setIsModalOpen(false);
      setSelectedPatient(null);
      fetchPatients();
    } catch (error) {
      alert("Erreur lors de l'enregistrement");
    }
  };

  const openViewModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsViewOpen(true);
  };

  const openEditModal = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  // --- FILTRAGE ---
  const filtered = patients.filter((p) => {
    const matchSearch =
      `${p.nom} ${p.prenom}`.toLowerCase().includes(search.toLowerCase()) ||
      (p.telephone && p.telephone.includes(search));
     const matchSexe = sexeFilter === "Tous" || p.sexe === sexeFilter;
    return matchSearch  && matchSexe;
  });

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dossiers Patients</h1>
          <p className="breadcrumb">Tableau de bord › Patients</p>
        </div>

        {/* MODALE AJOUT / EDITION */}
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          setIsModalOpen(open);
          if(!open) setSelectedPatient(null);
        }}>
          <DialogTrigger asChild>
            <button className="btn-primary" onClick={() => setSelectedPatient(null)}>
              <Plus size={16} /> Ajouter un patient
            </button>
          </DialogTrigger>
          <DialogContent className="glass-card border-white/20 text-white sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {selectedPatient ? "Modifier le Patient" : "Nouveau Patient"}
              </DialogTitle>
            </DialogHeader>
            <AddPatientForm
              initialData={selectedPatient}
              onSubmit={handleSave}
              onCancel={() => setIsModalOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* MODALE VISUALISATION (OEIL) */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="glass-card border-white/20 text-white sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <User size={20} className="text-blue-400" /> 
                Détails du Patient
              </DialogTitle>
            </DialogHeader>
            
            {selectedPatient && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-white/50 uppercase">Nom Complet</p>
                    <p className="font-semibold text-lg">{selectedPatient.nom} {selectedPatient.prenom}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase">ID Patient</p>
                    <p className="font-mono text-blue-300">#{selectedPatient.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                  <div>
                    <p className="text-xs text-white/50 uppercase">Sexe</p>
                    <p>{selectedPatient.sexe || "Non renseigné"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase">Âge</p>
                    <p>{calculateAge(selectedPatient.dateNaissance)} ans</p>
                  </div>
                </div>

                <div className="space-y-3 border-t border-white/10 pt-4">
                  <div>
                    <p className="text-xs text-white/50 uppercase">Téléphone</p>
                    <p>{selectedPatient.telephone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase">Email</p>
                    <p>{selectedPatient.email || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 uppercase">Adresse</p>
                    <p>{selectedPatient.adresse || "Aucune adresse enregistrée"}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsViewOpen(false)}
                  className="login-btn w-full mt-4"
                >
                  Fermer
                </button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="table-card">
        {/* TOOLBAR */}
        <div className="table-toolbar">
          <div className="search-input">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un patient..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Sexe:</label>
            <select
              className="filter-select"
              value={sexeFilter}
              onChange={(e) => { setSexeFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="Tous">Tous</option>
              <option value="M">Homme</option>
              <option value="F">Femme</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-white/60">Chargement de la base de données...</div>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom complet</th>
                  <th>Âge</th>
                  <th>Sexe</th>
                  <th>Téléphone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => (
                  <tr key={p.id}>
                    <td>#{p.id}</td>
                    <td><strong>{p.nom}</strong> {p.prenom}</td>
                    <td>{calculateAge(p.dateNaissance)}</td>
                    <td>{p.sexe || "Non renseigné"}</td>
                    <td>{p.telephone}</td>
                    <td>
                      <div className="actions-cell">
                        <button 
                          className="action-btn view" 
                          title="Voir détails"
                          onClick={() => openViewModal(p)}
                        >
                          <Eye size={15} />
                        </button>
                        <button 
                          className="action-btn edit" 
                          title="Modifier"
                          onClick={() => openEditModal(p)}
                        >
                          <Pencil size={15} />
                        </button>
                        <button 
                          className="action-btn delete" 
                          title="Supprimer"
                          onClick={() => handleDelete(Number(p.id))}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10">Aucun patient trouvé</td>
                  </tr>
                )}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalItems={filtered.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
}