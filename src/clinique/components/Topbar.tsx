import { useEffect, useState, useRef } from "react";
import { Bell, Search } from "lucide-react";
import "./Topbar.css";

export default function Topbar() {
  const [user, setUser] = useState<any>(null); // ou typer correctement ton User
  const [open, setOpen] = useState(false);

  // 👇 typer le ref pour un div HTML
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
const getInitials = (name?: string) => {
  if (!name || name.length === 0) return "??"; // fallback
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  // Si un seul mot, prend les 2 premières lettres (si possible)
  return name.substring(0, Math.min(2, name.length)).toUpperCase();
};

  return (
    <>
      <header className="topbar">
        <div className="topbar-search">
          <Search size={15} className="search-icon" />
          <input type="text" placeholder="Rechercher..." />
        </div>

        <div className="topbar-right">
          <button className="notif-btn" type="button">
            <Bell size={20} />
          </button>

          <div
            className="user-info"
            onClick={() => setOpen(!open)}
            style={{ cursor: "pointer" }}
          >
            <div className="user-avatar">
              {user?.username ? getInitials(user.username) : "U"}
            </div>

            <div className="user-details">
              <span className="user-name">{user?.username || "Chargement..."}</span>
              <span className="user-role">{user?.role || ""}</span>
            </div>

            <span className="user-chevron">∨</span>
          </div>
        </div>
      </header>

      {/* Dropdown séparé */}
      {open && (
        <div
          ref={dropdownRef}
          style={{
            position: "absolute",
            top: "60px",
            right: "20px",
            backgroundColor: "black",
            padding: "10px 15px",
            borderRadius: "5px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            zIndex: 1000,
          }}
        >
          <div>{user ? user.email : ""}</div>
        </div>
      )}
    </>
  );
}