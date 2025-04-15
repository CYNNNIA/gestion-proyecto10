# 💆‍♀️ Luméa - Plataforma de Reservas de Belleza y Bienestar

**Luméa** es una plataforma web que permite a profesionales ofrecer servicios de belleza y bienestar, y a clientes reservarlos fácilmente según disponibilidad. Todo está gestionado con autenticación, roles, subida de imágenes, disponibilidad y gestión de reservas.

---

## 🌍 Enlaces del Proyecto

🔗 **Frontend (Vercel)**: [https://lumea.vercel.app](https://lumea.vercel.app)  
🔗 **Backend (Render)**: [https://gestion-proyecto10.onrender.com](https://gestion-proyecto10.onrender.com)  
📦 **Repositorio GitHub**: [https://github.com/CYNNNIA/gestion-proyecto10](https://github.com/CYNNNIA/gestion-proyecto10)

---

## 📁 Estructura del Proyecto

GESTION-PROYECTO10/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── uploads/
├── frontend/
│   ├── assets/
│   ├── components/          # Navbar y Footer
│   └── public/
│       ├── css/
│       ├── js/
│       ├── *.html
│       └── config.js        # Cambiar URL base aquí
├── server.js                # Punto de entrada del backend
├── .env                     # Variables de entorno
├── package.json             # Backend dependencies
└── README.md

---

## 🛠️ Tecnologías Usadas

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Token (JWT)
- BcryptJS
- Multer (Subida de imágenes)
- Dotenv, CORS, Nodemon

### Frontend
- HTML5, CSS3, JavaScript
- Arquitectura modular (componentes)
- Fetch API reutilizable
- Responsive design sin frameworks
- Vercel + Render para despliegue

---

## 📌 Funcionalidades

### General
- Registro/Login con validaciones
- Rutas protegidas según rol
- Diferentes paneles para `cliente` y `profesional`

### Profesional
- Crear, editar y eliminar servicios
- Subir imagen de servicio
- Añadir fechas de disponibilidad
- Visualizar y cancelar reservas

### Cliente
- Reservar servicio y hora disponibles
- Editar y cancelar reservas
- Visualizar historial y estado

### Extras
- Navegación dinámica por rol
- Feedback al usuario: errores, loading, confirmaciones
- Código ordenado y reutilizable (componentización JS/HTML)

---

## 🔐 Seguridad

- Autenticación con JWT
- Hash de contraseñas con Bcrypt
- Middleware de protección de rutas
- Validaciones en cliente y servidor

---

## 🚀 Cómo ejecutar localmente

### 1. Clonar repositorio

```bash
git clone https://github.com/CYNNNIA/gestion-proyecto10.git
cd gestion-proyecto10

2. Backend
npm install
touch .env

Lanzar servidor:
npm run dev

3. Frontend

Abre frontend/public/config.js y asegúrate de que la URL apunta al backend de Render:
const API_BASE_URL = "https://gestion-proyecto10.onrender.com";

📦 Despliegue

Backend: Render
	•	Subido desde GitHub
	•	Build command: npm install
	•	Start command: node server.js

Frontend: Vercel
	•	Subido desde frontend/public
	•	Framework: ninguno
	•	Output directory: public

⸻

📌 Requisitos cumplidos

✅ Modelos: Usuario, Servicio, Disponibilidad, Reserva
✅ Middleware JWT
✅ Subida de imágenes (Multer)
✅ Inserciones cruzadas entre modelos
✅ Validaciones completas en frontend/backend
✅ Función única para peticiones fetch
✅ Componentes HTML reutilizables (navbar.html, footer.html)
✅ Gestión de roles cliente/profesional
✅ Diseño responsive
✅ Feedback visual al usuario
✅ UX clara y sin fricción


🧠 Reflexión final

Este proyecto ha sido una experiencia completa para poner en práctica buenas prácticas, autenticación real, gestión de recursos, roles, diseño modular y despliegue en entornos reales. Ha sido desarrollado con foco en la experiencia de usuario y escalabilidad futura.

⸻

🧑‍💻 Autor

Desarrollado por: @CYNNNIA
Para cualquier consulta o mejora, ¡estaré encantada de ayudarte!