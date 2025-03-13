const API_BASE_URL = "http://127.0.0.1:5002/api";

/**
 * Función para hacer solicitudes al backend.
 * @param {string} endpoint - Ruta de la API (por ejemplo, "/auth/login").
 * @param {string} method - Método HTTP ("GET", "POST", "PUT", "DELETE").
 * @param {Object} body - Datos a enviar en la solicitud (opcional).
 * @param {boolean} requiresAuth - Indica si la solicitud necesita autenticación (true/false).
 * @returns {Promise<Object>} - Respuesta del servidor en formato JSON.
 */
async function apiRequest(endpoint, method = "GET", body = null, requiresAuth = false) {
    const headers = { "Content-Type": "application/json" };

    // Agregar el token de autenticación si es necesario
    if (requiresAuth) {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("⚠️ Debes iniciar sesión.");
            window.location.href = "login.html";
            return;
        }
        headers["Authorization"] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : null,
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "⚠️ Error en la solicitud.");
        }

        return data;
    } catch (error) {
        console.error("❌ Error en API:", error.message);
        alert(error.message);
        return null;
    }
}

// Exportar funciones para reutilizarlas en otros archivos
export { apiRequest };