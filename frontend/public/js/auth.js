// public/js/auth.js

const form = document.getElementById("authForm");
const errorMessage = document.getElementById("errorMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nameInput = document.getElementById("authName");
  const roleInput = document.getElementById("authRole");

  const name = nameInput ? nameInput.value.trim() : null;
  const role = roleInput ? roleInput.value : null;

  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value.trim();

  const isRegistering = !!nameInput && !!roleInput;

  const url = isRegistering
    ? "http://localhost:5002/api/auth/register"
    : "http://localhost:5002/api/auth/login";

  const payload = isRegistering
    ? { name, email, password, role }
    : { email, password };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      errorMessage.style.display = "block";
      errorMessage.textContent = `❌ ${data.message || "Error desconocido"}`;
      return;
    }

    errorMessage.style.display = "none";

    if (!isRegistering) {
      localStorage.setItem("token", data.token);
      const redir = data.user.role === "profesional"
        ? "dashboard-profesional.html"
        : "cliente.html";
      window.location.href = redir;
    } else {
      alert("✅ Registro exitoso. Inicia sesión.");
      window.location.href = "login.html";
    }
  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    alert("⚠️ Error en el servidor. Intenta de nuevo.");
  }
});