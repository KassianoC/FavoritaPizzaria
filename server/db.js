const Sequelize = require('sequelize');

const sequelize = new Sequelize('food', 'root', 'root', {
  dialect: 'mysql',
  host: 'localhost',
});

sequelize
  .authenticate()
  .then(() => {
    console.log('conectado com sequileze');
  })
  .catch((erro) => {
    console.log('erro' + erro);
  });

module.exports = sequelize;
