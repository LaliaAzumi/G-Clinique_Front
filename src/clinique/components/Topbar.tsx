// import { useEffect, useState, useRef } from "react";
// import { Bell, Search } from "lucide-react";
// import { toast } from "sonner";
// import { connectNotifications } from "@/lib/notifications-websocket";
// import "./Topbar.css";
// import notificationMp3 from "@/assets/notif.mp3";

// export default function Topbar() {
//   const [user, setUser] = useState<any>(null); // ou typer correctement ton User
//   const [open, setOpen] = useState(false);
//   const [notifOpen, setNotifOpen] = useState(false);
//   const [notifications, setNotifications] = useState<string[]>([]);
//   const lastNotificationRef = useRef("");

//   // 👇 typer le ref pour un div HTML
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) setUser(JSON.parse(savedUser));
//   }, []);

//   const notificationSound = useRef<HTMLAudioElement | null>(null);

//   useEffect(() => {
//     notificationSound.current = new Audio(notificationMp3);
//   }, []);

//   useEffect(() => {
//     if (!user?.id) return;

//     return connectNotifications(user, (message) => {
//       if (lastNotificationRef.current === message) return;
//       lastNotificationRef.current = message;
//       // 🔊 Son
//     notificationSound.current?.play().catch(console.error);

//       setNotifications((prev) => {
//         return [message, ...prev].slice(0, 8);
//       });
//       toast.info("Notification", { description: message });
//     });
//   }, [user]);

//   // Close dropdown if clicked outside
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) {
//         return;
//       }
//       setOpen(false);
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);
  
// const getInitials = (name?: string) => {
//   if (!name || name.length === 0) return "??"; // fallback
//   const parts = name.trim().split(" ");
//   if (parts.length >= 2) {
//     return (parts[0][0] + parts[1][0]).toUpperCase();
//   }
//   // Si un seul mot, prend les 2 premières lettres (si possible)
//   return name.substring(0, Math.min(2, name.length)).toUpperCase();
// };

//   return (
//     <>
//       <header className="topbar">
//         <div className="topbar-search" style={{ background: "#ffffff00", opacity: 0.001 }}>
//           {/* <Search size={15} className="search-icon" /> */}
//           <input type="hidden" placeholder="Rechercher..." />
//         </div>

//         <div className="topbar-right">
//           <button
//             className="notif-btn"
//             type="button"
//             onClick={() => setNotifOpen((value) => !value)}
//             style={{ position: "relative" }}
//           >
//             <Bell size={20} />
//             {notifications.length > 0 && (
//               <span
//                 style={{
//                   position: "absolute",
//                   top: "-4px",
//                   right: "-4px",
//                   minWidth: "16px",
//                   height: "16px",
//                   borderRadius: "999px",
//                   background: "#ef4444",
//                   color: "white",
//                   fontSize: "10px",
//                   lineHeight: "16px",
//                   textAlign: "center",
//                 }}
//               >
//                 {notifications.length}
//               </span>
//             )}
//           </button>

//           <div
//             className="user-info"
//             onClick={() => setOpen(!open)}
//             style={{ cursor: "pointer" }}
//           >
//             <div className="user-avatar">
//               {user?.username ? getInitials(user.username) : "U"}
//             </div>

//             <div className="user-details">
//               <span className="user-name">{user?.username || "Chargement..."}</span>
//               <span className="user-role">{user?.role || ""}</span>
//               <span className="user-role">{user?.firstLogin ? "Premier login" : "Non premier login"}</span>

//             </div>

//             <span className="user-chevron">∨</span>
//           </div>
//         </div>
//       </header>

//       {/* Dropdown séparé */}
//       {open && (
//         <div
//           ref={dropdownRef}
//           style={{
//             position: "absolute",
//             top: "60px",
//             right: "20px",
//             backgroundColor: "black",
//             padding: "10px 15px",
//             borderRadius: "5px",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
//             zIndex: 1000,
//           }}
//         >
//           <div>{user ? user.email : ""}</div>
//           <div>changer mdp</div>
          

//         </div>
//       )}

//       {notifOpen && (
//         <div
//           style={{
//             position: "absolute",
//             top: "60px",
//             right: "190px",
//             width: "320px",
//             maxWidth: "calc(100vw - 24px)",
//             backgroundColor: "#0f172a",
//             color: "white",
//             padding: "12px",
//             borderRadius: "8px",
//             boxShadow: "0 12px 30px rgba(0,0,0,0.28)",
//             zIndex: 1000,
//           }}
//         >
//           <div style={{ fontWeight: 700, marginBottom: "8px" }}>Notifications</div>
//           {notifications.length === 0 ? (
//             <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px" }}>
//               Aucune notification.
//             </div>
//           ) : (
//             notifications.map((notification, index) => (
//               <div
//                 key={`${notification}-${index}`}
//                 style={{
//                   padding: "10px 0",
//                   borderTop: index === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
//                   fontSize: "13px",
//                   lineHeight: 1.4,
//                 }}
//               >
//                 {notification}
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </>
//   );
// }
import { useEffect, useState, useRef } from "react";
import { Bell, Search } from "lucide-react";
import { toast } from "sonner";
import { connectNotifications } from "@/lib/notifications-websocket";
import "./Topbar.css";
import notificationMp3 from "@/assets/notif.mp3";

export default function Topbar() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // 📩 Notifications
  const [notifications, setNotifications] = useState<string[]>([]);

  // 🔴 Compteur non lu
  const [unreadCount, setUnreadCount] = useState(0);

  const lastNotificationRef = useRef("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  const notificationSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    notificationSound.current = new Audio(notificationMp3);
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    return connectNotifications(user, (message) => {
      if (lastNotificationRef.current === message) return;

      lastNotificationRef.current = message;

      // 🔊 Son notification
      notificationSound.current?.play().catch(console.error);

      // 📩 Ajouter notif
      setNotifications((prev) => {
        return [message, ...prev].slice(0, 8);
      });

      // 🔴 Ajouter +1
      setUnreadCount((prev) => prev + 1);

      toast.info("Notification", {
        description: message,
      });
    });
  }, [user]);

  // Fermer dropdown si click ailleurs
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        dropdownRef.current.contains(e.target as Node)
      ) {
        return;
      }

      setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name?: string) => {
    if (!name || name.length === 0) return "??";

    const parts = name.trim().split(" ");

    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    return name.substring(0, Math.min(2, name.length)).toUpperCase();
  };

  return (
    <>
      <header className="topbar">
        <div
          className="topbar-search"
          style={{ background: "#ffffff00", opacity: 0.001 }}
        >
          {/* <Search size={15} className="search-icon" /> */}
          <input type="hidden" placeholder="Rechercher..." />
        </div>

        <div className="topbar-right">
          <button
            className="notif-btn"
            type="button"
            style={{ position: "relative" }}
            onClick={() => {
              setNotifOpen((value) => !value);

              // ✅ reset compteur rouge
              setUnreadCount(0);
            }}
          >
            <Bell size={20} />

            {/* 🔴 Badge rouge */}
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  minWidth: "16px",
                  height: "16px",
                  borderRadius: "999px",
                  background: "#ef4444",
                  color: "white",
                  fontSize: "10px",
                  lineHeight: "16px",
                  textAlign: "center",
                  fontWeight: 600,
                  padding: "0 4px",
                }}
              >
                {unreadCount}
              </span>
            )}
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
              <span className="user-name">
                {user?.username || "Chargement..."}
              </span>

              <span className="user-role">
                {user?.role || ""}
              </span>

              <span className="user-role">
                {user?.firstLogin
                  ? "Premier login"
                  : "Non premier login"}
              </span>
            </div>

            <span className="user-chevron">∨</span>
          </div>
        </div>
      </header>

      {/* Dropdown user */}
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
          <div>changer mdp</div>
        </div>
      )}

      {/* Notifications */}
      {notifOpen && (
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "190px",
            width: "320px",
            maxWidth: "calc(100vw - 24px)",
            backgroundColor: "#0f172a",
            color: "white",
            padding: "12px",
            borderRadius: "8px",
            boxShadow: "0 12px 30px rgba(0,0,0,0.28)",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            Notifications
          </div>

          {notifications.length === 0 ? (
            <div
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "13px",
              }}
            >
              Aucune notification.
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div
                key={`${notification}-${index}`}
                style={{
                  padding: "10px 0",
                  borderTop:
                    index === 0
                      ? "none"
                      : "1px solid rgba(255,255,255,0.08)",
                  fontSize: "13px",
                  lineHeight: 1.4,
                }}
              >
                {notification}
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}