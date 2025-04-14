document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 layout.js cargado correctamente");

  const navbar = document.getElementById("navbar");
  const footer = document.getElementById("footer");
  const currentPage = window.location.pathname;

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("userRole"); // 👈 debe haberse guardado al hacer login

  if (navbar) {
    navbar.innerHTML = `
      <nav class="navbar">
        <div class="container">
          <div class="brand-title">Luméa</div>
          <div class="hamburger" onclick="toggleMenu()">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <ul class="nav-links" id="navLinks">
            ${role !== "profesional" ? `
              <li><a href="index.html">Inicio</a></li>
              <li><a href="bookings.html">Reservar</a></li>
            ` : ""}
            <li><a href="#" id="dashboardLink">Mi Panel</a></li>
            <li><a href="login.html" id="loginNav" class="btn-login">Iniciar Sesión</a></li>
            <li><button id="logoutBtn" class="btn-secondary">Cerrar Sesión</button></li>
          </ul>
        </div>
      </nav>
    `;
  }

  // Botones y enlaces dinámicos
  const loginNav = document.getElementById("loginNav");
  const logoutBtn = document.getElementById("logoutBtn");
  const dashboardLink = document.getElementById("dashboardLink");

  if (dashboardLink) {
    dashboardLink.href = role === "profesional"
      ? "dashboard-profesional.html"
      : "cliente.html";
  }

  // Lógica para ocultar/mostrar botones según sesión
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

  // Footer global
  if (footer) {
    footer.innerHTML = `
      <footer class="footer">
        <p>&copy; 2025 Luméa. Todos los derechos reservados.</p>
      </footer>
    `;
  }
});

// Menú hamburguesa para responsive
function toggleMenu() {
  const nav = document.getElementById('navLinks');
  if (nav) nav.classList.toggle('active');
}