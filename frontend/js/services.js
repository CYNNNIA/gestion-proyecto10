document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
      alert("⚠️ Debes iniciar sesión como profesional.");
      window.location.href = "login.html";
      return;
  }

  const serviceForm = document.getElementById("serviceForm");
  const serviceList = document.getElementById("serviceList");

  // ✅ Función para cargar los servicios del profesional
  async function loadServices() {
      try {
          const response = await fetch("http://127.0.0.1:5002/api/services/my-services", {
              method: "GET",
              headers: { "Authorization": `Bearer ${token}` }
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.message);

          serviceList.innerHTML = "";
          data.forEach(service => {
              const li = document.createElement("li");
              li.innerText = `${service.name} - ${service.price}€`;

              // Botón para eliminar servicio
              const deleteBtn = document.createElement("button");
              deleteBtn.innerText = "Eliminar";
              deleteBtn.onclick = () => deleteService(service._id);
              li.appendChild(deleteBtn);

              serviceList.appendChild(li);
          });
      } catch (error) {
          console.error("❌ Error obteniendo servicios:", error);
          alert("⚠️ No se pudieron cargar los servicios.");
      }
  }

  // ✅ Función para crear un nuevo servicio
  serviceForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const serviceData = {
          name: document.getElementById("serviceName").value,
          description: document.getElementById("serviceDescription").value,
          price: document.getElementById("servicePrice").value,
          category: document.getElementById("serviceCategory").value,
          availableDates: [] // Esto lo puedes cambiar si agregas fechas en el formulario
      };

      try {
          const response = await fetch("http://127.0.0.1:5002/api/services/create", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify(serviceData)
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.message);

          alert("✅ Servicio creado con éxito");
          serviceForm.reset();
          loadServices();
      } catch (error) {
          console.error("❌ Error creando servicio:", error);
          alert("⚠️ No se pudo crear el servicio.");
      }
  });

  // ✅ Función para eliminar un servicio
  async function deleteService(serviceId) {
      try {
          const response = await fetch(`http://127.0.0.1:5002/api/services/${serviceId}`, {
              method: "DELETE",
              headers: { "Authorization": `Bearer ${token}` }
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.message);

          alert("✅ Servicio eliminado");
          loadServices();
      } catch (error) {
          console.error("❌ Error eliminando servicio:", error);
          alert("⚠️ No se pudo eliminar el servicio.");
      }
  }

  // 🔄 Cargar servicios al iniciar
  loadServices();
});