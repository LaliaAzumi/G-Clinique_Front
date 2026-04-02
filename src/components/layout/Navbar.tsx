import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom'; // 1. Ajoute useLocation
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ChevronDown, 
  UserSquare, 
  ClipboardList, 
  ShieldCheck 
} from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const location = useLocation(); // 2. Récupère le path actuel

  // 3. Si on est sur la racine (login), on n'affiche RIEN
  if (location.pathname === "/") {
    return null;
  }

  return (
    <nav className="navbar-container">
      <div className="nav-logo">MedApp</div>
      
      <div className="nav-links">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/appointments" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Calendar size={20} />
          <span>Rendez-vous</span>
        </NavLink>

        <div 
          className="dropdown"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <div className="nav-item dropdown-trigger">
            <Users size={20} />
            <span>Gestion</span>
            <ChevronDown size={16} className={`arrow ${isDropdownOpen ? 'rotate' : ''}`} />
          </div>

          {isDropdownOpen && (
            <div className="dropdown-menu">
              {/* Le path ici doit correspondre à ton App.tsx */}
              <NavLink to="/medecins" className="dropdown-item">
                <ShieldCheck size={18} />
                <span>Médecins</span>
              </NavLink>
              <NavLink to="/patients" className="dropdown-item">
                <UserSquare size={18} />
                <span>Patients</span>
              </NavLink>
              <NavLink to="/secretaires" className="dropdown-item">
                <ClipboardList size={18} />
                <span>Secrétaires</span>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;