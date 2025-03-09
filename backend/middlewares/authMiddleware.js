const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log('Cabeceras recibidas:', req.headers); // Para ver qué cabeceras están llegando

  const authHeader = req.header('Authorization');
  console.log('Token recibido:', authHeader); // Ver qué valor tiene exactamente el token

  if (!authHeader) {
    return res.status(401).json({ message: 'Acceso denegado. No hay token.' });
  }

  const token = authHeader.split(' ')[1]; // Extraer solo el token sin "Bearer"

  if (!token) {
    return res.status(401).json({ message: 'Formato de token incorrecto' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token inválido' });
  }
};