const User = require('../models/User');
const Food = require('../models/food');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getToken = require('../helpers/get_token');
const getUserByToken = require('../helpers/get-user-by-token');
const createUserToken = require('../helpers/create-user-token');

module.exports = class FoodController {
  static async newFood(req, res) {
    const name = req.body.name;
    const price = req.body.price;
    const price1 = req.body.price1;
    const price2 = req.body.price2;
    const price3 = req.body.price3;
    const size = req.body.size;
    const size1 = req.body.size1;
    const size2 = req.body.size2;
    const size3 = req.body.size3;
    const description = req.body.description;
    const category = req.body.category;

    let image = '';
    if (req.file) {
      image = req.file.filename;
    }

    try {
      const pizza = await Food.create({
        name,
        size: size,
        price: price,
        description,
        image,
        category,
        border: '',
      });

      // Opções de preço e tamanho
      const options = [
        { size: size, price: price },
        { size: size1, price: price1 },
        { size: size2, price: price2 },
        { size: size3, price: price3 },
      ];

      for (const option of options) {
        if (option.price && category === 'Pizza') {
          // Criação da pizza base
          const pizza = await Food.create({
            name,
            size: option.size,
            price: option.price,
            description: '',
            image,
            category,
            border: '',
          });

          // Agora, vamos considerar bordas (assumindo que você tenha uma categoria chamada "Bordas")
          const bordas = await Food.findAll({
            where: { category: 'Bordas' },
          });

          for (const borda of bordas) {
            await Food.create({
              name: name,
              size: option.size,
              price: Number(option.price) + Number(borda.price), // Adiciona o preço da borda ao preço original
              description: '',
              image,
              category,
              border: borda.name,
            });
          }
        }
      }

      res.send({ msg: 'Itens cadastrados!' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ msg: 'Erro ao cadastrar itens.' });
    }
  }

  static async getAllFood(req, res) {
    const food = await Food.findAll({
      order: [['category', 'DESC']],
    });
    res.send(food);
  }

  static async editFood(req, res) {
    const code = req.params.code;
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const image = req.file.filename;
    const food = await Food.findByPk(code);

    try {
      food.update({
        name,
        price,
        description,
        image,
      });
      res.send({ msg: 'Produto Atualizado!' });
    } catch (error) {
      console.log(error);
    }
  }

  static async deleteFood(req, res) {
    const name = req.params.name;

    try {
      const deletedCount = await Food.destroy({ where: { name: name } });

      if (deletedCount > 0) {
        res.status(200).send({ msg: 'Itens excluídos!' });
      } else {
        res.status(404).send({ msg: 'Nenhum item encontrado para exclusão!' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ msg: 'Ocorreu um erro ao excluir os itens!' });
    }
  }

  static async foodCode(req, res) {
    const name = req.params.name;

    try {
      const food = await Food.findAll({
        where: { name: name },
      });

      res.status(200).send(food);
    } catch (error) {
      console.error('Erro ao buscar o produto:', error);
      res.status(500).send({ msg: 'Ocorreu um erro ao buscar o Produto.' });
    }
  }
};
