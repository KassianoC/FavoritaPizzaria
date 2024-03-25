const getToken = require('../helpers/get_token');
const getUserByToken = require('../helpers/get-user-by-token');

const isAdmin = async (req, res, next) => {
  try {
    const token = getToken(req);

    console.log(token);

    if (!token) {
      return res.status(401).json({ msg: 'Token não fornecido. Faça o login novamente.' });
    }

    const user = await getUserByToken(token);

    if (!user || !user.isAdmin) {
      return res.status(401).json({ msg: 'Você não é um administrador' });
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      // Token expirado
      return res.status(401).json({ msg: 'Token expirado. Faça o login novamente.' });
    } else {
      console.error(error);
      return res.status(500).json({ msg: 'Erro interno do servidor' });
    }
  }
};

module.exports = isAdmin;
