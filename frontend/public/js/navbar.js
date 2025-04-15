document.addEventListener("DOMContentLoaded", () => {
    fetch("components/navbar.html")
      .then(response => {
        if (!response.ok) throw new Error("No se pudo cargar la navbar");
        return response.text();
      })
      .then(html => {
        document.body.insertAdjacentHTML("afterbegin", html);
        setupNavbar();
      })
      .catch(error => console.error("❌ Error cargando la navbar:", error));
  });
  
  function setupNavbar() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("userRole");
  
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const dashboardLink = document.getElementById("dashboardLink");
  
  
    if (token) {
      if (loginBtn) loginBtn.style.display = "none";
      if (logoutBtn) logoutBtn.style.display = "inline-block";
    } else {
      if (loginBtn) loginBtn.style.display = "inline-block";
      if (logoutBtn) logoutBtn.style.display = "none";
    }
  
    if (dashboardLink) {
      dashboardLink.href = role === "profesional"
        ? "dashboard-profesional.html"
        : "cliente.html";
    }
  

    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "login.html";
      });
    }
  }