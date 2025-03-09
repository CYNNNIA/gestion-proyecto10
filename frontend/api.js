const API_URL = 'http://localhost:5002/api';

// Función reutilizable para hacer peticiones al backend
async function fetchAPI(endpoint, method = 'GET', body = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    };

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la petición:', error);
        return { error: 'Error en la conexión con el servidor' };
    }
}

export { fetchAPI };