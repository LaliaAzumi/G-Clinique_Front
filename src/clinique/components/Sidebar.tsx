import { useEffect, useState, useMemo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Calendar,
  ClipboardList,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Plus,
  Stethoscope,
  UserCog,
  Users,
  Bed,
  Pill
} from "lucide-react";
import "./Sidebar.css";

// --- ÉTAPE 1 : Définition des menus avec les rôles exacts ---
const navItems = [
  { to: "/app/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["SECRETAIRE", "MEDECIN"] },
  { to: "/app/agenda", icon: Calendar, label: "Rendez-vous", roles: ["MEDECIN"] },
  { to: "/app/rendez-vousSec", icon: Calendar, label: "Rendez-vousSec", roles: ["SECRETAIRE"] },
  { to: "/app/medoc", icon: Pill, label: "Médicaments", roles: ["SECRETAIRE"] },
  { to: "/app/chambre", icon: Bed, label: "Chambre", roles: ["ADMIN"] },
  { to: "/app/patients", icon: Users, label: "Patients", roles: ["SECRETAIRE", "MEDECIN"] },
  
  // Seul l'ADMIN peut voir ces deux-là
  { to: "/app/medecins", icon: Stethoscope, label: "Médecins", roles: ["ADMIN"] },
  { to: "/app/secretaires", icon: UserCog, label: "Secrétaires", roles: ["ADMIN"] },
  
  { to: "/app/consultations", icon: ClipboardList, label: "Consultations", roles: ["MEDECIN"] },
  { to: "/app/ordonnances", icon: FileText, label: "Ordonnances", roles: ["MEDECIN", "SECRETAIRE"] },
  { to: "/app/paiements", icon: CreditCard, label: "Paiements", roles: ["SECRETAIRE"] },
];

export default function Sidebar() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  // --- ÉTAPE 2 : Récupérer le rôle au chargement ---
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // On stocke le rôle (ex: "ADMIN")
      setUserRole(parsedUser.role); 
    }
  }, []);

 const filteredNavItems = useMemo(() => {
    if (!userRole) return [];
    
    return navItems.filter((item) => 
      item.roles.includes(userRole.toUpperCase())
    );
  }, [userRole]); // <--- Très important : on écoute les changements de userRole

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Plus className="logo-icon" size={22} />
        <span className="logo-text">Clinique</span>
      </div>

      <nav className="sidebar-nav">
        {filteredNavItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button onClick={handleLogout} className="nav-item nav-logout" style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px' }}>
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}