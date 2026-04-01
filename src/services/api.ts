const API_URL = "http://localhost:8000";

export const loginRequest = async (username: string, password: string) => {
  const response = await fetch(`${API_URL}/api/auth/login`, { // <--- corrigé
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }), // correspond à login_data
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Erreur login");
  }

  return data;
};