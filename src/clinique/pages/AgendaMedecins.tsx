import React, { useState, useEffect, useCallback } from 'react';
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
import "./ListePage.css";

export default function AgendaMedecins() {
  // --- ÉTATS ---
  const [rdvs, setRdvs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date());

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
    console.error("data API Agenda:", data);

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

  return (
    <div className="page-container">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Agenda Médical</h1>
          <p className="breadcrumb">G-Clinique › Planning hebdomadaire</p>
        </div>
        <div className="flex-gap-2">
          <button className="btn-secondary" onClick={() => setStartDate(new Date())}>
            <CalendarIcon size={16} /> Aujourd'hui
          </button>
          <button className="btn-primary">
            <Plus size={16} /> Nouveau RDV
          </button>
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
                          <div className={`rv-card ${getStatutBadge(rv.statut)}`}>
                            <div className="rv-header">
                              <span className="patient-name">
                                <strong>{rv.patient?.nom || "Patient"} {rv.patient?.prenom}</strong>
                              </span>
                              <MoreVertical size={14} className="cursor-pointer" />
                            </div>
                            <div className="rv-motif">
                              {rv.motif}
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .agenda-table { table-layout: fixed; min-width: 1000px; border-collapse: separate; border-spacing: 0; }
        .agenda-slot { height: 90px; vertical-align: top; padding: 6px !important; border: 1px solid #f0f0f0; }
        .hour-cell { background: #fafafa41; border-right: 2px solid #eee; font-size: 0.8rem; }
        
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
      `}} />
    </div>
  );
}