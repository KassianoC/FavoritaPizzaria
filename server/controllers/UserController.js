const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getToken = require('../helpers/get_token');
const getUserByToken = require('../helpers/get-user-by-token');
const createUserToken = require('../helpers/create-user-token');

//const { imageUpload } = require('../helpers/image-upload')

module.exports = class UserController {
  static async register(req, res) {
    const nome = req.body.nome[0].toUpperCase() + req.body.nome.substring(1).toLowerCase();
    const sobrenome = req.body.sobrenome[0].toUpperCase() + req.body.sobrenome.substring(1).toLowerCase();
    const email = req.body.email.toLowerCase();
    const password = await bcrypt.hash(req.body.password, 8);

    try {
      const newUser = await User.create({
        nome,
        sobrenome,
        email,
        password,
      });

      await createUserToken(newUser, req, res);
    } catch (error) {
      res.status(500).json({ msg: error });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({
      attributes: ['id', 'email', 'password', 'isAdmin'],
      where: {
        email: email,
      },
    });

    if (!user) {
      res.send({ msg: 'Endereço de email nao encontrado!' });
      return;
    }
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      res.send({ msg: 'Senha incorreta!' });
      return;
    }
    await createUserToken(user, req, res);
  }

  static async checkUser(req, res) {
    try {
      let currentUser;

      if (req.headers.authorization) {
        const token = getToken(req);

        if (!token) {
          currentUser = null;
          return res.status(401).send({ error: 'Token não fornecido. Faça o login novamente.' });
        }

        const decoded = jwt.verify(token, 'kjkszpj'); // Substitua 'sua_chave_secreta' pela chave usada para assinar os tokens
        currentUser = await User.findByPk(decoded.id);

        if (!currentUser) {
          return res.status(404).send({ error: 'Usuário não encontrado' });
        }

        delete currentUser.password;
      } else {
        currentUser = null;
      }

      res.status(200).send(currentUser);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).send({ error: 'Token expirado. Faça o login novamente.' });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).send({ error: 'Token inválido. Faça o login novamente.' });
      } else {
        console.error(error);
        res.status(500).send({ error: 'Erro interno do servidor' });
      }
    }
  }
};
