
const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: '⚠️ Acceso denegado. No hay token.' });
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ message: '⚠️ Formato de token incorrecto.' });
    }

    const token = tokenParts[1].trim();
    req.user = jwt.verify(token, process.env.JWT_SECRET);

    console.log('✅ Usuario autenticado:', req.user);
    next();
  } catch (error) {
    console.error('❌ Error al verificar token:', error.message);
    return res.status(403).json({ message: `⚠️ Token inválido o expirado: ${error.message}` });
  }
};