const API_BASE_URL = "https://gestion-proyecto10.onrender.com";

document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("⚠️ Todos los campos son obligatorios.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(`❌ ${data.message || "Credenciales inválidas"}`);
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("userRole", data.user.role);
    window.location.href = data.user.role === "profesional"
      ? "dashboard-profesional.html"
      : "cliente.html";

  } catch (err) {
    console.error("❌ Error al iniciar sesión:", err);
    alert("❌ Error de conexión con el servidor.");
  }
});