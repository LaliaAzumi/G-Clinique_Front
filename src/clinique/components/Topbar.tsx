import { Bell, Search } from "lucide-react";
import "./Topbar.css";

export default function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={15} className="search-icon" />
        <input type="text" placeholder="Rechercher..." />
      </div>
      <div className="topbar-right">
        <button className="notif-btn" type="button">
          <Bell size={20} />
        </button>
        <div className="user-info">
          <div className="user-avatar">TA</div>
          <div className="user-details">
            <span className="user-name">Tiana Admin</span>
            <span className="user-role">Admin</span>
          </div>
          <span className="user-chevron">∨</span>
        </div>
      </div>
    </header>
  );
}
