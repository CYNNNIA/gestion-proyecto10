document.addEventListener("DOMContentLoaded", () => {
    const serviceForm = document.getElementById("serviceForm");
    const serviceList = document.getElementById("serviceList");
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("⚠️ Debes iniciar sesión.");
      window.location.href = "login.html";
      return;
    }
  
    // ✅ Cargar servicios creados
    async function loadServices() {
      try {
        const response = await fetch(`${API_BASE_URL}/api/services`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
  
        if (!Array.isArray(data)) {
          console.error("❌ Error: El backend no devolvió una lista de servicios.", data);
          return;
        }
  
        serviceList.innerHTML = "";
  
        data.forEach(service => {
          const li = document.createElement("li");
          li.textContent = `${service.name} - ${service.price}€`;
          serviceList.appendChild(li);
        });
  
      } catch (error) {
        console.error("❌ Error obteniendo servicios:", error);
      }
    }
  
    // ✅ Crear nuevo servicio
    serviceForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const name = document.getElementById("serviceName").value.trim();
      const description = document.getElementById("serviceDescription").value.trim();
      const price = document.getElementById("servicePrice").value.trim();
      const category = document.getElementById("serviceCategory").value;
  
      if (!name || !description || !price || !category) {
        alert("⚠️ Todos los campos son obligatorios.");
        return;
      }
  
      const serviceData = {
        name,
        description,
        price: parseFloat(price),
        category,
      };
  
      try {
        const response = await fetch(`${API_BASE_URL}/api/services/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(serviceData),
        });
  
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Error al crear servicio");
  
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