

// Función reutilizable para hacer peticiones al backend
async function fetchAPI(endpoint, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`http://localhost:5002/api${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
  });

  return response.json();
}

// ✅ Hacer la función accesible globalmente
window.fetchAPI = fetchAPI;