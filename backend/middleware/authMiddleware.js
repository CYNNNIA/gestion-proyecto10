const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  console.log('Cabeceras recibidas:', req.headers); // Para depuración

  const authHeader = req.header('Authorization');
  console.log('Token recibido:', authHeader);

  if (!authHeader) {
    return res.status(401).json({ message: 'Acceso denegado. No hay token.' });
  }

  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Formato de token incorrecto' });
  }

  const token = tokenParts[1].replace(/"/g, ''); // Elimina comillas si las hay

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decodificado:', decoded); // Verificar contenido del token
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar token:', error.message);
    res.status(400).json({ message: 'Token inválido' });
  }
};