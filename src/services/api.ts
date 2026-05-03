const API_URL = "http://localhost:8000";

export const loginRequest = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Erreur login");
  }

  // 1. On sécurise la récupération du nom
  const safeUsername = typeof data.username === "string" && data.username.length > 0
    ? data.username
    : "Unknown";

  // 2. On utilise safeUsername partout pour éviter le crash
  localStorage.setItem("user", JSON.stringify({
    username: safeUsername, // On garde la clé "username" pour matcher avec ta Topbar
    role: data.role || "Utilisateur",
    initials: safeUsername.substring(0, 2).toUpperCase() // <--- Plus de crash ici !
  }));

  return data;
};