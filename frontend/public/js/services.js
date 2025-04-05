document.addEventListener("DOMContentLoaded", () => {
    const serviceForm = document.getElementById("serviceForm");
    const serviceList = document.getElementById("serviceList");
    const token = localStorage.getItem("token");

    if (!token) {
        alert("⚠️ Debes iniciar sesión.");
        window.location.href = "login.html";
        return;
    }

    // ✅ Función para cargar servicios creados
    async function loadServices() {
        try {
            const response = await fetch("http://127.0.0.1:5002/api/services");
            const data = await response.json();
    
            console.log("📌 Datos recibidos del backend:", data);
    
            if (!Array.isArray(data)) {
                console.error("❌ Error: El backend no devolvió una lista de servicios.", data);
                return;
            }
    
            const serviceList = document.getElementById("serviceList");
            serviceList.innerHTML = "";
    
            data.forEach(service => {
                const li = document.createElement("li");
                li.innerText = `${service.name} - ${service.price}€`;
                serviceList.appendChild(li);
            });
    
        } catch (error) {
            console.error("❌ Error obteniendo servicios:", error);
        }
    }

    // ✅ Función para crear un servicio
    serviceForm?.addEventListener("submit", async (event) => {
        event.preventDefault();

        // 🔹 Obtener valores del formulario
        const name = document.getElementById("serviceName").value.trim();
        const description = document.getElementById("serviceDescription").value.trim();
        const price = document.getElementById("servicePrice").value.trim();
        const category = document.getElementById("serviceCategory").value;

        // ✅ Depuración: Verificar si los valores están llegando correctamente
        console.log("📌 Datos del servicio antes de enviar:", { name, description, price, category });

        // ✅ Validar que los campos no estén vacíos antes de enviar la solicitud
        if (!name || !description || !price || !category) {
            alert("⚠️ Todos los campos son obligatorios.");
            return;
        }

        // 🔹 Construcción del objeto con los datos
        const serviceData = {
            name,
            description,
            price: parseFloat(price), // Asegurar que el precio es un número
            category
        };

        try {
            const response = await fetch("http://127.0.0.1:5002/api/services/create", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(serviceData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            alert("✅ Servicio creado con éxito.");
            serviceForm.reset();
            loadServices();

        } catch (error) {
            console.error("❌ Error creando servicio:", error);
            alert(`⚠️ ${error.message}`);
        }
    });

    loadServices();
});