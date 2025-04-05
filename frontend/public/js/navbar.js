document.addEventListener("DOMContentLoaded", () => {
  fetch("components/navbar.html")
      .then(response => response.text())
      .then(html => {
          document.body.insertAdjacentHTML("afterbegin", html);
          setupNavbar();
      })
      .catch(error => console.error("❌ Error cargando la navbar:", error));
});

function setupNavbar() {
  const token = localStorage.getItem("token");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (token) {
      loginBtn.style.display = "none";
      logoutBtn.style.display = "inline-block";
  } else {
      loginBtn.style.display = "inline-block";
      logoutBtn.style.display = "none";
  }

  logoutBtn.addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "login.html";
  });
}