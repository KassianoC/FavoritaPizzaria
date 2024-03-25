const jwt = require('jsonwebtoken');

// Middleware to validate token
const checkToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Acesso negado! Token não fornecido.' });

  try {
    const verified = jwt.verify(token, 'kjkszpj');
    req.user = verified;
    next(); // Continue the flow
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      // Token expirado
      return res.status(401).json({ msg: 'Token expirado. Faça o login novamente.' });
    } else {
      // Outro erro de verificação de token
      return res.status(400).json({ message: 'O Token é inválido!' });
    }
  }
};

module.exports = checkToken;
