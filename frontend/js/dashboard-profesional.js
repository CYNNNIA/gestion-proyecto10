document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 dashboard-profesional.js cargado");
  
    const serviceForm = document.getElementById("serviceForm");
    const serviceList = document.getElementById("serviceList");
    const availabilityInput = document.getElementById("availabilityPicker");
    const saveAvailabilityBtn = document.getElementById("saveAvailabilityBtn");
    const availabilityList = document.getElementById("availabilityList");
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("⚠️ Debes iniciar sesión.");
      window.location.href = "login.html";
      return;
    }
  
    // ✅ Cargar servicios del profesional
    async function loadServices() {
      try {
        const response = await fetch("http://127.0.0.1:5002/api/services/my-services", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const data = await response.json();
        if (!Array.isArray(data.services)) {
          console.error("❌ El backend no devolvió una lista válida:", data);
          return;
        }
  
        serviceList.innerHTML = "";
  
        data.services.forEach(service => {
          const li = document.createElement("li");
          li.innerHTML = `
            <strong>${service.name}</strong> - ${service.price}€<br>
            <em>${service.category}</em><br>
            ${service.description}<br>
            <button data-id="${service._id}" class="btn-delete">Eliminar</button>
          `;
  
          li.querySelector("button").addEventListener("click", async () => {
            const confirmDelete = confirm("¿Seguro que quieres eliminar este servicio?");
            if (!confirmDelete) return;
  
            try {
              const res = await fetch(`http://127.0.0.1:5002/api/services/${service._id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });
  
              const result = await res.json();
              if (!res.ok) throw new Error(result.message);
  
              alert("✅ Servicio eliminado.");
              loadServices();
            } catch (error) {
              console.error("❌ Error al eliminar servicio:", error);
              alert(`⚠️ ${error.message}`);
            }
          });
  
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
      const price = parseFloat(document.getElementById("servicePrice").value);
      const category = document.getElementById("serviceCategory").value;
  
      if (!name || !description || !price || !category) {
        alert("⚠️ Todos los campos son obligatorios.");
        return;
      }
  
      const serviceData = { name, description, price, category };
  
      try {
        const response = await fetch("http://127.0.0.1:5002/api/services/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
  
    // ✅ Guardar disponibilidad
    saveAvailabilityBtn?.addEventListener("click", async () => {
      const dateTime = availabilityInput.value;
  
      if (!dateTime) {
        alert("⚠️ Debes seleccionar una fecha y hora.");
        return;
      }
  
      try {
        const response = await fetch("http://127.0.0.1:5002/api/availability/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ dateTime }),
        });
  
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
  
        alert("✅ Disponibilidad guardada.");
        availabilityInput.value = "";
        loadAvailability();
      } catch (error) {
        console.error("❌ Error al guardar disponibilidad:", error);
        alert("⚠️ No se pudo guardar la disponibilidad.");
      }
    });
  
    // ✅ Cargar disponibilidad
    async function loadAvailability() {
      try {
        const response = await fetch("http://127.0.0.1:5002/api/availability/my-availability", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const data = await response.json();
        if (!Array.isArray(data)) {
          console.error("❌ No se recibió una lista de disponibilidad:", data);
          return;
        }
  
        availabilityList.innerHTML = "";
  
        data.forEach(entry => {
          const li = document.createElement("li");
          const date = new Date(entry.dateTime).toLocaleString("es-ES");
          li.textContent = date;
          availabilityList.appendChild(li);
        });
      } catch (error) {
        console.error("❌ Error al cargar disponibilidad:", error);
      }
    }
  
    // 🚀 Cargar servicios y disponibilidad al inicio
    loadServices();
    loadAvailability();
  });