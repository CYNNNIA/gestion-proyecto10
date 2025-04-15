

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

  try {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Error en la solicitud");
    }

    return result;
  } catch (error) {
    console.error(`❌ Error al hacer la petición a ${endpoint}:`, error);
    throw error;
  }
}