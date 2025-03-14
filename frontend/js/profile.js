document.addEventListener("DOMContentLoaded", async () => {
  const username = document.getElementById("username");
  const userEmail = document.getElementById("userEmail");
  const userRole = document.getElementById("userRole");
  const clientView = document.getElementById("clientView");
  const professionalView = document.getElementById("professionalView");
  const navServices = document.getElementById("navServices");
  const logoutBtn = document.getElementById("logoutBtn");
  const serviceList = document.getElementById("serviceList"); // Puede ser null si no está en la página

  // ✅ Verificar si el usuario está autenticado
  const token = localStorage.getItem("token");
  if (!token) {
      alert("⚠️ Debes iniciar sesión.");
      window.location.href = "login.html";
      return;
  }

  try {
      // ✅ Obtener datos desde localStorage
      const name = localStorage.getItem("userName") || "Usuario";
      const email = localStorage.getItem("userEmail") || "No disponible";
      const role = localStorage.getItem("userRole") || "cliente";

      console.log("🔹 Datos cargados desde localStorage:", { name, email, role });

      if (username) username.innerText = name;
      if (userEmail) userEmail.innerText = email;
      if (userRole) userRole.innerText = role.charAt(0).toUpperCase() + role.slice(1); // Capitalizar

      // ✅ Mostrar contenido según el rol del usuario
      if (role === "cliente") {
          clientView?.classList.remove("hidden");
          professionalView?.classList.add("hidden");
          if (navServices) navServices.style.display = "none";
      } else if (role === "profesional") {
          clientView?.classList.add("hidden");
          professionalView?.classList.remove("hidden");
          if (navServices) navServices.style.display = "inline";
          loadProfessionalServices(); // ✅ Cargar servicios si es un profesional
      }

  } catch (error) {
      console.error("❌ Error cargando el perfil:", error);
      alert("⚠️ Error al cargar el perfil.");
  }

  // ✅ Cerrar sesión correctamente
  logoutBtn?.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "login.html";
  });

  // ✅ Función para cargar servicios del profesional
  async function loadProfessionalServices() {
      try {
          const response = await fetch("http://127.0.0.1:5002/api/services/professional", {
              method: "GET",
              headers: { "Authorization": `Bearer ${token}` }
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.message);

          console.log("📌 Servicios cargados:", data.services);

          if (serviceList) {
              serviceList.innerHTML = ""; // Limpiar antes de cargar nuevos elementos

              data.services.forEach(service => {
                  const li = document.createElement("li");
                  li.innerText = `${service.name} - ${service.price}€`;
                  serviceList.appendChild(li);
              });
          }

      } catch (error) {
          console.error("❌ Error obteniendo servicios:", error);
          alert("⚠️ No se pudieron cargar los servicios.");
      }
  }
});