export const generateWhatsAppMessage = (
  cartItems,
  paymethod,
  troco,
  entregar,
  bairro,
  rua,
  numero,
  referencia,
  comentarios,
  taxa,
  totalValue,
) => {
  const quebraLinha = '\n';
  const emojiCelular = '📱';
  const emojiCartaoCredito = '💳';
  const emojiCasa = '🏠';
  const emojiCarro = '🚗';
  const emojiLocalizacao = '📍';
  const emojiDinheiro = '💰';
  const emojiMoto = '🏍️';

  const formaPagamentoTexto =
    paymethod === 'dinheiro'
      ? `Forma de pagamento: ${paymethod} ${emojiDinheiro} ${quebraLinha}Troco para: R$${troco} `
      : paymethod === 'credito'
      ? `Forma de pagamento: Cartão de crédito ${emojiCartaoCredito}`
      : paymethod === 'pix'
      ? `Forma de pagamento: Pix ${emojiCelular}`
      : paymethod === 'debito'
      ? `Forma de pagamento: Cartão de débito ${emojiCartaoCredito}`
      : 'Forma de pagamento não selecionada';

  // Criar a URL do WhatsApp com os dados do cliente e do pedido
  const pedidoDetalhes = cartItems.map((item) => {
    let categoryEmoji = '';
    if (item.category.includes('tilapia')) {
      categoryEmoji = '🐟';
    } else if (item.category.includes('Pizza')) {
      categoryEmoji = '🍕';
    } else if (item.category.includes('Lanche')) {
      categoryEmoji = '🍔';
    } else if (item.category.includes('batata')) {
      categoryEmoji = '🍟';
    } else if (item.category.includes('Bebidas')) {
      categoryEmoji = '🥤';
    }

    const sizeInfo = item.size ? `-  Tam: ${item.size}` : '';
    const borderInfo = item.border ? `borda: ${item.border}` : '';

    return ` ${categoryEmoji} (${item.quantity}x) ${item.name}  ${sizeInfo} ${quebraLinha}  ${borderInfo} `;
  });
  const detalhesEntregaTexto = entregar
    ? `${emojiLocalizacao}Bairro: ${bairro} 
${emojiLocalizacao}Rua: ${rua} 
${emojiLocalizacao}Numero: ${numero} 
${emojiLocalizacao}Referencia: ${referencia} ${quebraLinha}`
    : '';

  const whatsappMessage = `Olá!${quebraLinha}
Segue o meu pedido!${quebraLinha}
${pedidoDetalhes.join(`${quebraLinha}`)}

Valor Total: R$${parseFloat(taxa) + parseFloat(totalValue)}
${formaPagamentoTexto}  
${entregar ? `${emojiCasa} Entregar` : `${emojiCarro} Irei retirar no local!`} ${quebraLinha}
${detalhesEntregaTexto}${quebraLinha}
${comentarios}`;

  const whatsappURL = `https://api.whatsapp.com/send?phone=5535992020799&text=${encodeURIComponent(whatsappMessage)}`;

  // Abrir a URL do WhatsApp em uma nova janela ou guia
  window.open(whatsappURL, '_blank');
};
