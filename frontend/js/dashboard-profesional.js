document.addEventListener("DOMContentLoaded", () => {
  const serviceForm = document.getElementById("serviceForm");
  const serviceList = document.getElementById("serviceList");
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

          console.log("📌 Servicios recibidos:", data);

          if (!Array.isArray(data.services)) {
              console.error("❌ El backend no devolvió una lista válida de servicios:", data);
              return;
          }

          serviceList.innerHTML = "";

          data.services.forEach(service => {
              const li = document.createElement("li");
              li.innerHTML = `
                  <strong>${service.name}</strong> - ${service.price}€
                  <button data-id="${service._id}" class="btn-delete">Eliminar</button>
              `;

              // ✅ Eliminar servicio
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

                      alert("✅ Servicio eliminado");
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
      const availability = document.getElementById("serviceAvailability").value;

      console.log("📌 Datos enviados:", { name, description, price, category, availability });

      if (!name || !description || !price || !category || !availability) {
          alert("⚠️ Todos los campos son obligatorios.");
          return;
      }

      const serviceData = { name, description, price, category, availability };

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