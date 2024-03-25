const Food = require('../models/food');
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const User = require('../models/User');
const prizeDraw = require('../helpers/prize-draw');

module.exports = class OrderController {
  static async neworder(req, res) {
    const client = req.body.client;
    const paymethod = req.body.paymethod;
    const entregar = req.body.entregar;
    const troco = req.body.troco;
    const bairro = req.body.bairro;
    const rua = req.body.rua;
    const numero = req.body.numero;
    const referencia = req.body.referencia;
    const comentarios = req.body.comentarios;
    const products = req.body.products;
    const taxa = req.body.taxa;

    if (products.length === 0) {
      res.status(201).send({ msg: 'Adicione itens ao seu pedido!' });
      return;
    }

    if (!client) {
      res.status(201).send({ msg: 'Adicione o Celular!' });
      return;
    }

    try {
      let totalAmount = 0;

      const newOrder = await Order.create({
        client: client,
        amount: 0,
        paymethod,
        entregar,
        troco,
        bairro,
        rua,
        numero,
        referencia,
        comentarios,
        atendido: false,
      });

      for (const item of products) {
        const code = item.code;
        const size = item.size;
        const quantity = item.quantity;
        const price = item.price; // Adiciona o preço vindo da requisição

        await OrderItem.create({
          quantity: quantity,
          ordernumber: newOrder.id,
          code: code,
          size: size,
          price: price, // Adiciona o preço na OrderItem
        });

        const itemTotal = price * quantity;
        totalAmount += itemTotal;
      }

      await newOrder.update({ amount: totalAmount + taxa });

      res.status(200).json({ msg: 'Pedido Realizado' });
    } catch (error) {
      console.error('Erro ao processar novo pedido:', error);
      res.status(500).json({ error: 'Erro ao processar novo pedido' });
    }
  }

  static async putOrder(req, res) {
    const id = req.params.id;
    const atendido = req.body.atendido;

    try {
      const order = await Order.findByPk(id);
      if (!order) {
        return res.status(404).send({ msg: 'Pedido não encontrado.' });
      }
      await order.update({ atendido: atendido });
      return res.status(200).send({ msg: 'Pedido atualizado com sucesso.' });
    } catch (error) {
      console.error('Erro ao atualizar pedido:', error);
      return res.status(500).send({ msg: 'Ocorreu um erro ao atualizar o pedido.' });
    }
  }

  static async getAllOrders(req, res) {
    try {
      const orders = await Order.findAll({
        order: [['createdAt', 'DESC']],
      });

      res.status(200).send(orders);
    } catch (error) {
      console.error('Erro ao buscar os pedidos:', error);
      res.status(500).send({ msg: 'Ocorreu um erro ao buscar os pedidos.' });
    }
  }

  static async getOrderItemsByOrderId(req, res) {
    const orderId = req.params.id;

    try {
      const orderItems = await OrderItem.findAll({
        where: { ordernumber: orderId },
        include: [
          {
            model: Food,
          },
          {
            model: Order,
          },
        ],
      });

      const foodMap = new Map();

      orderItems.forEach((item) => {
        const foodKey = item.food.code;
        if (foodMap.has(foodKey)) {
          const existingItem = foodMap.get(foodKey);
          existingItem.quantity += item.quantity || 1; // Assuming there is a quantity property in OrderItem model
        } else {
          const newItem = {
            ...item.food.toJSON(),
            quantity: item.quantity || 1, // Assuming there is a quantity property in OrderItem model
          };
          foodMap.set(foodKey, newItem);
        }
      });

      const uniqueFoodItems = Array.from(foodMap.values());
      const orderInfo = orderItems.length > 0 ? orderItems[0].order.toJSON() : null;
      const result = {
        order: orderInfo,
        foodItems: uniqueFoodItems,
      };

      res.status(200).send(result);
    } catch (error) {
      console.error('Erro ao buscar os OrderItems:', error);
      res.status(500).send({ msg: 'Ocorreu um erro ao buscar os OrderItems.' });
    }
  }

  static async returnAddress(req, res) {
    const number = req.params.number;

    try {
      const address = await Order.findOne({
        where: { client: number },
        order: [['createdAt', 'DESC']],
      });
      res.status(200).send(address);
    } catch (error) {
      console.log(error);
    }
  }

  static async prizeDraw(req, res) {
    try {
      // Chama a função prizeDraw
      const winnerPhoneNumber = await prizeDraw();

      // Envia a resposta ao cliente
      res.status(200).send(winnerPhoneNumber);
    } catch (error) {
      // Se houver um erro, envia uma resposta de erro
      console.error('Erro no sorteio:', error.message);
      res.status(500).json({ error: 'Erro no sorteio' });
    }
  }
};
