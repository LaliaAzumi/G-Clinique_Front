import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  MoreVertical, 
  Plus,
  Loader2
} from "lucide-react";
import { agendaService } from "@/lib/api-agenda";
// import { agendaService } from "@/lib/api-agenda";
import { appointmentService } from "@/lib/api-appointments";
import "./ListePage.css";
import { toast } from '@/components/ui/use-toast';

export default function AgendaMedecins() {
  // --- ÉTATS ---
  const navigate = useNavigate(); // Ajoute cette ligne
  const [rdvs, setRdvs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedRdv, setSelectedRdv] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const hours = Array.from({ length: 11 }, (_, i) => i + 8);
  const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
// ✅ format date propre (évite bug UTC)
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-CA"); // YYYY-MM-DD
  };
  
  // --- LOGIQUE DATE ---
  const getMonday = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const monday = getMonday(startDate);
  const mondayIso = formatDate(monday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const formatDateLabel = () => {
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: '2-digit' 
    };
  
    return `Semaine du ${monday.toLocaleDateString('fr-FR', options)} au ${sunday.toLocaleDateString('fr-FR', options)} ${sunday.getFullYear()}`;
  };

  

  const fetchAgenda = useCallback(async () => {
  setLoading(true);
  try {
    // On utilise la version string stable
    const data = await agendaService.getEvents(mondayIso);
    setRdvs(data);
    console.log("data API Agenda:", data);

  } catch (error) {
    console.error("Erreur API Agenda:", error);
  } finally {
    setLoading(false);
  }
}, [mondayIso]); // ✅ Dépendance stable : l'API ne sera rappelée que si la date change vraiment

useEffect(() => {
  fetchAgenda();
}, [fetchAgenda]);

  // --- NAVIGATION ---
  const handlePrevWeek = () => {
    const newDate = new Date(monday);
    newDate.setDate(newDate.getDate() - 7);
    setStartDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(monday);
    newDate.setDate(newDate.getDate() + 7);
    setStartDate(newDate);
  };

  // --- UI HELPERS ---
  const getStatutBadge = (statut: string) => {
    const styles: any = {
      TERMINE: "bg-success-light text-success",
      EN_ATTENTE: "bg-warning-light text-warning",
      // 🔥 ajouté ici
      EN_ATTENTE_REPORTER: "bg-reporter-light text-reporter",
      ANNULE: "bg-danger-light text-danger",
      URGENT: "bg-danger-light text-danger",
    };
    return styles[statut] || "bg-info-light text-info";
  };

  const findRDV = (dayIndex: number, hour: number) => {
  return rdvs.find(r => {
    // 1. On récupère le jour de la semaine (0-6) à partir de r.date
    const d = new Date(r.date);
    let rdvDayIndex = d.getDay();
    rdvDayIndex = (rdvDayIndex === 0) ? 6 : rdvDayIndex - 1;

    // 2. On extrait l'heure (format "09:00:00")
    const rdvHour = parseInt(r.heure.split(':')[0], 10);

    return rdvDayIndex === dayIndex && rdvHour === hour;
  });
};
const handleStartRdv = (rdv: any) => {
  setShowModal(false); 
  
  // On envoie l'ID dans l'URL ET l'objet complet dans le state
  navigate(`/app/consultation/${rdv.id}`, { 
    state: { rdvData: rdv } 
  }); 
};

const handleReporterRdv = async (rdv: any) => {
  try {
    await appointmentService.reporter(rdv.id);

    console.log("RDV en attente de report");
    await fetchAgenda(); // 🔥 refresh propre depuis API
    // refresh ou update state
  } catch (e) {
    console.error(e.message);
  }
};

  return (
    <div className="page-container">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Agenda Médical</h1>
          <p className="breadcrumb">G-Clinique › Planning hebdomadaire</p>
        </div>
        <div className="flex-gap-2" style={{ display: 'flex', alignItems: 'center' }}>
  {/* Bouton Aujourd'hui corrigé */}
  <button className="btn-secondary" onClick={() => setStartDate(new Date())}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <CalendarIcon size={16} /> 
      <span>Aujourd'hui</span>
    </div>
  </button>

  {/* Recherche par date */}
  <div className="date-search-container" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '10px' }}>
    <label htmlFor="date-picker" style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Aller au :</label>
    <input 
      id="date-picker"
      type="date" 
      className="btn-secondary" // On réutilise tes classes pour le style
      style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #ddd' }}
      onChange={(e) => {
        if (e.target.value) {
          setStartDate(new Date(e.target.value));
        }
      }}
    />
  </div>
</div>
      </div>

      <div className="table-card">
        {/* TOOLBAR */}
        <div className="table-toolbar" style={{ justifyContent: 'space-between' }}>
          <div className="flex-align-center">
            <button className="action-btn" onClick={handlePrevWeek}>
              <ChevronLeft size={20} />
            </button>
            <h3 className="section-subtitle" style={{ margin: '0 15px', minWidth: '280px', textAlign: 'center' }}>
              {formatDateLabel()}
            </h3>
            <button className="action-btn" onClick={handleNextWeek}>
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="filter-group">
            {loading && <Loader2 className="animate-spin text-muted" size={20} />}
          </div>
        </div>

        {/* LÉGENDE DES STATUTS */}
        <div className="status-legend">
          <div className="legend-item">
            <span className="legend-color success"></span>
            <span>Terminé</span>
          </div>

          <div className="legend-item">
            <span className="legend-color warning"></span>
            <span>En attente</span>
          </div>

          <div className="legend-item">
            <span className="legend-color danger"></span>
            <span>Annulé / Urgent</span>
          </div>

          <div className="legend-item">
            <span className="legend-color info"></span>
            <span>En Attente de validation</span>
          </div>
          <div className="legend-item">
            <span className="legend-color warning-reporter"></span>
            <span>En attente de report</span>
          </div>
        </div>

        {/* TABLE */}
        <div className="calendar-grid-container" style={{ overflowX: 'auto' }}>
          <table className="data-table agenda-table">
            <thead>
              <tr>
                <th style={{ width: '80px', textAlign: 'center' }}>
                  <Clock size={16} />
                </th>
                {days.map(d => (
                  <th key={d} className="text-center">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map(hour => (
                <tr key={hour}>
                  <td className="hour-cell text-center font-bold text-muted">
                    {hour}:00
                  </td>
                  {days.map((day, index) => {
                    const rv = findRDV(index, hour);
                    return (
                      <td key={day} className="agenda-slot">
                        {rv && (
                          <div className={`rv-card ${getStatutBadge(rv.statut)}`}
                          onClick={() => {
                                    setSelectedRdv(rv);
                                    setShowModal(true);
                                }}
                          >
                            <div className="rv-header">
                              <span className="patient-name">
                                <strong>{rv.patient?.nom || "Patient"} {rv.patient?.prenom}</strong>
                              </span>
                              <MoreVertical size={14} className="cursor-pointer" />
                            </div>
                            <div className="rv-motif">
                              {rv.motif}
                            </div>
                            {rv.date}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
           {/* MODALE DE DÉTAILS */}
{showModal && selectedRdv && (
  <div className="modal-overlay" onClick={() => setShowModal(false)}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h2>Détails du Rendez-vous</h2>
        {selectedRdv.date}
        <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
      </div>
      <div className="modal-body">
        <div className="detail-item">
          <strong>Patient:</strong> {selectedRdv.patient?.nom} {selectedRdv.patient?.prenom}
        </div>
        <div className="detail-item">
          <strong>Heure:</strong> {selectedRdv.heure}
        </div>
        <div className="detail-item">
          <strong>Motif:</strong> {selectedRdv.motif}
        </div>
        <div className="detail-item">
          <strong>Statut:</strong> 
          <span className={`badge ${getStatutBadge(selectedRdv.statut)}`}>
            {selectedRdv.statut}
          </span>
        </div>
        <div className="detail-item">
          <strong>Statut Paiement :</strong> 
          <span className={`badge ${getStatutBadge(selectedRdv.statutPaiement)}`}>
            {selectedRdv.statutPaiement}
          </span>
        </div>

        {selectedRdv.notes && (
          <div className="detail-item">
            <strong>Notes:</strong> {selectedRdv.notes}
          </div>
        )}
      </div>
      <div className="modal-footer">
        {selectedRdv.statut === "EN_ATTENTE" && selectedRdv.statutPaiement === "PAYE" && (
          <>
            <button 
              className="btn-primary" 
              onClick={() => handleStartRdv(selectedRdv)}
              style={{ backgroundColor: '#1fb468', borderColor: '#1fb468' }} // Couleur verte pour l'action
              >
              Commencer la consultation
            </button> 
            <button 
              className="btn btn-warning"
              onClick={() => handleReporterRdv(selectedRdv)}
              disabled={!selectedRdv}
            >
              Reporter le RDV
            </button>
<br/>
          </>
        )}
        
        <button className="btn-secondary" onClick={() => setShowModal(false)}>Fermer</button>
      </div>
    </div>
  </div>
)}
        </div>
       
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .agenda-table { table-layout: fixed; min-width: 1000px; border-collapse: separate; border-spacing: 0; }
        .agenda-slot { height: 90px; vertical-align: top; padding: 6px !important; border: 1px solid #f0f0f0; }
        .hour-cell { background: #fafafa5e; border-right: 2px solid #eee; font-size: 0.8rem; }
        
        .rv-card {
          padding: 8px;
          border-radius: 6px;
          font-size: 0.75rem;
          border-left: 4px solid currentColor;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .rv-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
        .rv-motif { opacity: 0.9; font-style: italic; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        
        .bg-success-light { background-color: #e6f7ed; color: #1fb468; }
        .bg-warning-light { background-color: #fff9e6; color: #fcc419; }
        .bg-danger-light { background-color: #ffeef0; color: #f03e3e; }
        .bg-info-light { background-color: #e7f5ff; color: #228be6; }
        
        .flex-align-center { display: flex; align-items: center; }
        .flex-gap-2 { display: flex; gap: 8px; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input[type="date"].btn-secondary {
  cursor: pointer;
  font-family: inherit;
  color: #666;
}

.date-search-container {
  border-left: 1px solid #eee;
  padding-left: 15px;
}
  .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #eeeeee1a;
  padding: 20px;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.detail-item {
  margin-bottom: 12px;
  font-size: 0.95rem;
}

.detail-item strong {
  display: inline-block;
  width: 80px;
  color: #f3dfdf;
}

.modal-footer {
  margin-top: 20px;
  text-align: right;
  border-top: 1px solid #eee;
  padding-top: 15px;
}

.badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-left: 5px;
}
      `}} />
    </div>
  );
}