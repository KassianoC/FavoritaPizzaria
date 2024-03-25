const jwt = require('jsonwebtoken');

const User = require('../models/User');

const getUserByToken = async (token) => {
  const decoded = jwt.verify(token, 'kjkszpj');

  const userId = decoded.id;

  const user = await User.findOne({ where: { id: userId } });

  return user;
};

module.exports = getUserByToken;
