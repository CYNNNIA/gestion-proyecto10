document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (!name || !email || !password || !role) {
    alert("⚠️ Todos los campos son obligatorios.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert("❌ Error: " + (data.message || "Error desconocido"));
      return;
    }

    alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
    window.location.href = "login.html";
  } catch (error) {
    console.error("❌ Error en el servidor:", error);
    alert("⚠️ Error en el servidor. Intenta más tarde.");
  }
});