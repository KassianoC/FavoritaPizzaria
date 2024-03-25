const jwt = require('jsonwebtoken');

const createUserToken = async (user, req, res) => {
  const token = jwt.sign(
    {
      name: user.nome,
      id: user.id,
    },
    'kjkszpj',
    { expiresIn: '7d' },
  );

  return res.json({
    msgRegiter: '',
    msgLogin: 'Você esta autenticado!',
    token: token,
    userId: user.id,
    user: user,
  });
};

module.exports = createUserToken;
