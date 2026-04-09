import React, { useEffect, useState } from 'react';
import '../../clinique/CliniqueScope.css';

const RevenueDashboard: React.FC = () => {
    const [dateDebut, setDateDebut] = useState<string>('2026-01-01');
    const [dateFin, setDateFin] = useState<string>('2026-12-31');
    const [stats, setStats] = useState({
        meds: 0,
        chambres: 0, // À connecter plus tard à ton entité Hospitalisation
        consults: 0
    });

    const PRIX_CONSULTATION = 10000;

    useEffect(() => {
        // Fetch vers ton API avec les paramètres dateDebut et dateFin
        // fetch(`/api/stats/global?debut=${dateDebut}&fin=${dateFin}`) ...
    }, [dateDebut, dateFin]);

    const totalGlobal = stats.meds + stats.chambres + (stats.consults * PRIX_CONSULTATION);

    const getPct = (val: number) => totalGlobal > 0 ? ((val / totalGlobal) * 100).toFixed(1) : "0";

    return (
        <div className="clinique-scope p-8">
            <div className="clinique-layer">
                {/* Section Filtres */}
                <div className="flex gap-4 mb-8 p-4" style={{ background: 'var(--glass-bg)', borderRadius: '15px' }}>
                    <div className="flex flex-col">
                        <label className="text-xs mb-1">Date Début</label>
                        <input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} 
                               className="bg-transparent border border-white/20 p-2 rounded text-white" />
                    </div>
                    <div className="flex flex-col">
                        <label className="text-xs mb-1">Date Fin</label>
                        <input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} 
                               className="bg-transparent border border-white/20 p-2 rounded text-white" />
                    </div>
                </div>

                {/* Section Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Card Médicaments */}
                    <StatCard title="Médicaments" value={stats.meds} pct={getPct(stats.meds)} icon="💊" />
                    
                    {/* Card Chambres */}
                    <StatCard title="Chambres" value={stats.chambres} pct={getPct(stats.chambres)} icon="🛌" />
                    
                    {/* Card Consultations */}
                    <StatCard title="Consultations" value={stats.consults * PRIX_CONSULTATION} 
                              pct={getPct(stats.consults * PRIX_CONSULTATION)} icon="🩺" />
                </div>
                
                {/* Ton graphique en dessous... */}
            </div>
        </div>
    );
};

// Petit composant interne pour les cartes au style Glassmorphism
const StatCard = ({ title, value, pct, icon }: any) => (
    <div className="p-6" style={{
        background: 'var(--glass-bg-2)',
        backdropFilter: 'blur(10px)',
        border: '1px solid var(--glass-border)',
        borderRadius: '20px'
    }}>
        <div className="flex justify-between items-start mb-4">
            <span className="text-2xl">{icon}</span>
            <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: 'var(--primary)', color: '#fff' }}>
                {pct}%
            </span>
        </div>
        <h4 style={{ color: 'var(--text-muted)' }} className="text-sm uppercase tracking-wider">{title}</h4>
        <p className="text-2xl font-bold mt-1">{value.toLocaleString()} Ar</p>
    </div>
);

export default RevenueDashboard;