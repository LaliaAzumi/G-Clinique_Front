import { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  Search, 
  Plus, 
  Trash2, 
  Pencil, 
  CreditCard,
  RefreshCw,
  AlertCircle,
  User,
  XCircle // Import de l'icône Croix pour l'annulation
} from "lucide-react";
import { appointmentService } from "@/lib/api-appointments";
import Pagination from "../components/Pagination";
import AddRdvForm from "@/components/AddRdvForm";
import "./ListePage.css";

const ITEMS_PER_PAGE = 8;
const getStatusDetails = (statut: string) => {
  switch (statut) {
    case 'PLANIFIE':
      return { label: 'En attente', className: 'status-pending' }; // Jaune
    case 'CONFIRME':
      return { label: 'Confirmé', className: 'status-success' }; // Vert
    case 'ANNULE':
      return { label: 'Annulé', className: 'status-danger' }; // Rouge
    case 'TERMINE':
      return { label: 'Terminé', className: 'status-neutral' }; // Gris/Bleu
    default:
      return { label: statut, className: 'status-neutral' };
  }
};
export default function Paiements() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("EN_ATTENTE_VALIDATION"); // Nouveau state
  
  // États pour la gestion du formulaire (Modal)
  const [showForm, setShowForm] = useState(false);
  const [selectedRdv, setSelectedRdv] = useState<any>(null);

  const fetchRdv = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await appointmentService.getAll(); 
      console.log(data);
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError("Erreur de récupération des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRdv();
  }, []);

  // Handler Suppression
  const handleDelete = async (id: number) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce paiement ?")) {
      try {
        await appointmentService.delete(id);
        fetchRdv(); // Rafraîchir la liste après suppression
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

// ListeRdv.tsx
// ListeRdv.tsx
// Dans ListeRdv.tsx
const handleCancelRdv = async (rdv: any) => {
  if (!rdv || !rdv.id) return;

  if (window.confirm("Voulez-vous vraiment annuler ce paiement ?")) {
    const payload = {
      id: Number(rdv.id),
      patientId: rdv.patient?.id, // On envoie juste l'ID
      medecinId: rdv.medecin?.id, // On envoie juste l'ID
      date: rdv.date,
      heure: rdv.heure,
      motif: rdv.motif,
      statut: "ANNULE" // La valeur clé
    };
    
    try {
      await appointmentService.save(payload);
      await fetchRdv(); // Force le rafraîchissement
    } catch (err) {
      alert("Erreur lors de l'annulation");
    }
  }
};

  // Handler Validation Paiement
  const handleValidatePayment = async (id: number) => {
    try {
      await appointmentService.validerPaiement(id);
      fetchRdv(); // Rafraîchir pour voir le statut "Payé"
    } catch (err) {
      alert("Erreur lors de la validation du paiement");
    }
  };

  // Handler Ouverture Formulaire (Ajout ou Modif)
  const handleOpenForm = (rdv: any = null) => {
    setSelectedRdv(rdv);
    setShowForm(true);
  };

const handleFormSubmit = async (data: any) => {
  try {
    const payload = {
      ...(selectedRdv?.id && { id: Number(selectedRdv.id) }),
      patientId: Number(data.patientId),
      medecinId: Number(data.medecinId),
      date: data.date,
      heure: data.heure,
      motif: data.motif,
      statut: selectedRdv ? data.statut : "EN_ATTENTE"
    };
    console.log("Données à envoyer au service API:", payload);

    await appointmentService.save(payload);

    setShowForm(false);
    setSelectedRdv(null);
    fetchRdv();

  } catch (err) {
    console.error(err);
    alert("Erreur lors de l'enregistrement");
  }
};
  // Filtrage
    const filtered = appointments.filter((rdv) => {
    const matchesSearch = 
        rdv.patient?.nom?.toLowerCase().includes(search.toLowerCase()) ||
        rdv.patient?.prenom?.toLowerCase().includes(search.toLowerCase());

    // Logique du filtre de statut
    const matchesStatus = 
        statusFilter === "Tous" || rdv.statut === statusFilter;

    return matchesSearch && matchesStatus;
    });

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="page-container">
      {/* Modal du Formulaire */}
      {showForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <AddRdvForm 
      rdvToEdit={selectedRdv}
      onSuccess={handleFormSubmit} 
      onCancel={() => { setShowForm(false); setSelectedRdv(null); }}
    />
  </div>
)}

      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="text-blue-400" /> Gestion des paiement
          </h1>
          <p className="text-white/60">Consultez et gérez les paiements des consultations</p>
        </div>
        
        {/* <button className="btn-primary flex items-center gap-2" onClick={() => handleOpenForm()}>
          <Plus size={18} /> 
          <span>Planifier un paiement</span>
        </button> */}
      </div>

      <div className="table-container">
        <div className="table-actions flex items-center justify-between gap-4 mb-4">
            <div className="search-bar flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 py-2 w-full max-w-md transition focus-within:ring-2 focus-within:ring-blue-400">
                <Search size={18} className="text-white/50" />
                <input 
                type="text" 
                placeholder="Rechercher un patient ou un motif..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-white placeholder:text-white/40 w-full text-sm"
                />
            </div>
            {/* <div className="flex items-center gap-2">
                <label className="text-xs text-white/50 uppercase tracking-wider font-semibold">Statut:</label>
                <select 
                className="login-input !w-[160px] cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                >
                <option value="Tous">Tous</option>
                <option value="EN_ATTENTE">En attente</option>
                <option value="EN_ATTENTE_VALIDATION">En attente validation</option>
                <option value="ANNULE">Annulé</option>
                <option value="TERMINE">Terminé</option>
                <option value="EN_ATTENTE_REPORTER">En attente de report</option>

                </select>
            </div> */}
            <button 
                className="refresh-btn flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition disabled:opacity-50"
                onClick={fetchRdv}
                disabled={loading}
                title="Rafraîchir"
            >
                <RefreshCw 
                size={18} 
                className={`text-white ${loading ? "animate-spin" : ""}`} 
                />
            </button>
            </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <table className="custom-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date & Heure</th>
              <th>Motif</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && paginated.map((rdv) => {
              // Récupération des détails du statut pour cette ligne
              const { label, className } = getStatusDetails(rdv.statut);
              
              return (
                <tr key={rdv.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar-mini"><User size={14} /></div>
                      <span className="font-medium text-white">{rdv.patient?.nom || "Inconnu"}</span>
                      <span className="font-medium text-white">{rdv.patient?.prenom || "Inconnu"}</span>

                    </div>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="flex items-center gap-1 text-sm">
                        <Calendar size={12} /> {rdv.date} 
                      </span>
                      <span className="flex items-center gap-1 text-xs text-white/50">
                        <Clock size={12} /> {rdv.heure}
                      </span>
                    </div>
                  </td>
                  {/* <span className="truncate max-w-[150px] inline-block">{rdv.motif}</span>*/}
                  <td>
                    <span className="whitespace-normal break-words max-w-[250px] inline-block">
                      {rdv.motif}
                    </span>
                  </td> 
                  <td>
                    {/* Application dynamique de la classe CSS du statut */}
                    <span className={`status-badge ${className}`}>
                      {label}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {/* <button className="action-btn edit" title="Modifier" onClick={() => handleOpenForm(rdv)}>
                        <Pencil size={15} />
                      </button> */}
                      
                      {/* Bouton Encaisser (Carte bancaire) - Uniquement si En attente */}
                      {rdv.statut === 'EN_ATTENTE_VALIDATION' && (
                        <button 
                          className="action-btn view" 
                          style={{ color: '#fbbf24' }}
                          onClick={() => handleValidatePayment(rdv.id)}
                          title="Encaisser"
                        >
                          <CreditCard size={15} />
                        </button>
                      )}

                      {/* NOUVEAU : Bouton Annuler (Croix) - Uniquement si En attente ou Confirmé */}
                      {(rdv.statut === 'EN_ATTENTE_VALIDATION' || rdv.statut === 'CONFIRME') && (
                        <button 
                          className="action-btn delete" 
                          style={{ color: '#ef4444' }} // Couleur rouge
                          onClick={() => handleCancelRdv(rdv)}
                          title="Annuler le paiement"
                        >
                          <XCircle size={15} />
                        </button>
                      )}

                      <button   
                        className="action-btn delete" 
                        onClick={() => handleDelete(rdv.id)}
                        title="Annuler définitivement"
                      >
                        {/* <Trash2 size={15} /> */}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!loading && paginated.length === 0 && (
              <tr><td colSpan={5} className="text-center py-10 text-white/30">Aucun paiement trouvé.</td></tr>
            )}
          </tbody>
        </table>

        <Pagination 
          currentPage={currentPage} 
          totalItems={filtered.length} 
          itemsPerPage={ITEMS_PER_PAGE} 
          onPageChange={setCurrentPage} 
        />
      </div>
    </div>
  );
}