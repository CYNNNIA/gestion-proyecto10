document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 layout.js cargado correctamente");

  const navbar = document.getElementById("navbar");
  const currentPage = window.location.pathname;

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole"); // 👈 debe estar guardado al hacer login

  if (navbar) {
    navbar.innerHTML = `
      <nav>
        <ul class="nav-links">
          ${role !== "profesional" ? `
            <li><a href="index.html">Inicio</a></li>
            <li><a href="bookings.html">Reservar</a></li>
          ` : ""}
          <li><a href="#" id="dashboardLink">Mi Panel</a></li>
          <li><a href="login.html" id="loginNav" class="btn-login">Iniciar Sesión</a></li>
          <li><button id="logoutBtn" class="btn-secondary">Cerrar Sesión</button></li>
        </ul>
      </nav>
    `;
  }

  const loginNav = document.getElementById("loginNav");
  const logoutBtn = document.getElementById("logoutBtn");
  const dashboardLink = document.getElementById("dashboardLink");

  if (dashboardLink) {
    dashboardLink.href = role === "profesional"
      ? "dashboard-profesional.html"
      : "cliente.html";
  }

  if (currentPage.includes("login.html") || currentPage.includes("register.html")) {
    if (loginNav) loginNav.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
  } else if (token && role) {
    if (loginNav) loginNav.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
  } else {
    if (loginNav) loginNav.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "login.html";
    });
  }

  const footer = document.getElementById("footer");
  if (footer) {
    footer.innerHTML = `
      <footer>
        <p>&copy; 2025 Plataforma de Reservas - Todos los derechos reservados.</p>
      </footer>
    `;
  }
});