// ✅ Archivo: js/api.js

export async function apiRequest(endpoint, method = "GET", data = null, withAuth = false) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (withAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`http://127.0.0.1:5002/api${endpoint}`, options);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Error en la solicitud");
  }

  return result;
}
