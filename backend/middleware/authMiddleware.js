const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // 🔍 Verificar si el token está presente en el encabezado
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Acceso denegado. No hay token.' });
    }

    // 📌 El token debe tener el formato "Bearer token"
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Formato de token incorrecto' });
    }

    // 🎫 Extraer y limpiar el token
    const token = tokenParts[1].trim();

    // 🔍 Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Agregar los datos del usuario autenticado a `req.user`

    console.log('✅ Usuario autenticado:', decoded);
    next();
  } catch (error) {
    console.error('❌ Error al verificar token:', error.message);
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};