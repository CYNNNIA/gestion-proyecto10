// public/js/login.js
document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("⚠️ Todos los campos son obligatorios.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5002/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(`❌ ${data.message || "Error desconocido"}`);
      return;
    }

    localStorage.setItem("token", data.token);
    window.location.href = data.user.role === "profesional"
      ? "dashboard-profesional.html"
      : "cliente.html";
  } catch (err) {
    alert("❌ Error al iniciar sesión.");
    console.error(err);
  }
});