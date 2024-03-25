const Order = require('../models/Order'); // Certifique-se de que o modelo esteja importado corretamente

const prizeDraw = async () => {
  try {
    // Encontrar todas as ordens com informações de clientes
    const orders = await Order.findAll({ where: { atendido: true } });

    // Criar um array com todos os números de celular
    const allPhoneNumbers = orders.map((order) => order.client);

    // Verificar se há clientes e retornar o array
    if (allPhoneNumbers.length > 0) {
      return allPhoneNumbers;
    } else {
      console.error('Nenhum cliente encontrado nas ordens.');
      return [];
    }
  } catch (error) {
    console.error('Erro ao obter números de celular:', error.message);
    throw error;
  }
};

module.exports = prizeDraw;
