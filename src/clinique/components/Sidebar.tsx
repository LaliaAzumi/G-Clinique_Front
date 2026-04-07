import { NavLink } from "react-router-dom";
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
} from "lucide-react";
import "./Sidebar.css";

const navItems = [
  { to: "/app/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/app/rendez-vous", icon: Calendar, label: "Rendez-vous" },
  { to: "/app/patients", icon: Users, label: "Patients" },
  { to: "/app/medecins", icon: Stethoscope, label: "Médecins" },
  { to: "/app/secretaires", icon: UserCog, label: "Secrétaires" },
  { to: "/app/consultations", icon: ClipboardList, label: "Consultations" },
  { to: "/app/ordonnances", icon: FileText, label: "Ordonnances" },
  { to: "/app/paiements", icon: CreditCard, label: "Paiements" },
] as const;

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Plus className="logo-icon" size={22} />
        <span className="logo-text">Clinique</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, icon: Icon, label }) => (
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
        <NavLink to="/" className="nav-item nav-logout">
          <LogOut size={18} />
          <span>Déconnexion</span>
        </NavLink>
      </div>
    </aside>
  );
}
