const Sequelize = require('sequelize');
const db = require('../db');
const Order = require('./Order');
const Food = require('./food');

const OrderItem = db.define('OrderItem', {
  quantity: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false,
  },
});

OrderItem.belongsTo(Order, { constraint: true, foreignKey: 'ordernumber' });
OrderItem.belongsTo(Food, { constraint: true, foreignKey: 'code' });

//OrderItem.sync({ force: true });

module.exports = OrderItem;
