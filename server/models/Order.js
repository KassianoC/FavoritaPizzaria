const Sequelize = require('sequelize');
const db = require('../db');

const Order = db.define('orders', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  amount: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
  client: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  comentarios: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  referencia: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  numero: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  bairro: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  rua: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  troco: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: true,
  },
  entregar: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  atendido: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  paymethod: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

//Order.sync({ force: true });

module.exports = Order;
