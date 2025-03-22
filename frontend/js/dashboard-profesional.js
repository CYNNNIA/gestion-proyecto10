document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 dashboard-profesional.js cargado correctamente");

  const professionalName = document.getElementById("professionalName");
  const serviceList = document.getElementById("serviceList");

  const token = localStorage.getItem("token") || "";
  if (!token) {
      alert("⚠️ Debes iniciar sesión.");
      window.location.href = "login.html";
      return;
  }

  const userName = localStorage.getItem("userName") || "Profesional";
  if (professionalName) {
      professionalName.textContent = userName;
  } else {
      console.error("❌ No se encontró el elemento professionalName en el DOM");
  }

  async function loadServices() {
      try {
          const response = await fetch("http://127.0.0.1:5002/api/services/professional", {
              method: "GET",
              headers: { "Authorization": `Bearer ${token}` }
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.message);

          serviceList.innerHTML = "";
          data.services.forEach(service => {
              const li = document.createElement("li");
              li.innerHTML = `${service.name} - ${service.price}€`;
              serviceList.appendChild(li);
          });

      } catch (error) {
          console.error("❌ Error cargando servicios:", error);
      }
  }

  loadServices();
});