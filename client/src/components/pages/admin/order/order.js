import React, { useEffect, useState } from 'react';
import styles from './order.module.css';
import { useParams } from 'react-router-dom';
import { api } from '../../../../utils/api';

const Order = () => {
  const { code } = useParams();
  const [order, setOrder] = useState({ order: {}, foodItems: [] });
  const [message, setMessage] = useState('Olá, tudo bem?');
  const [msg, setMsg] = useState('');

  console.log(order);

  const handleclickupdate = () => {
    api
      .put(`/orders/putOrder/${order.order.id}`, {
        atendido: true,
      })
      .then((response) => {
        console.log(response);
        setMsg(response.data.msg);
        setTimeout(() => {
          setMsg('');
        }, 3000);
      });
  };

  useEffect(() => {
    api.get(`orders/getOrderItemsByOrderId/${code}`).then((response) => {
      setOrder(response.data);
    });
  }, [code]);

  const whatsappLink = `https://api.whatsapp.com/send?phone=55${order.order.client}&text=${encodeURIComponent(
    message,
  )}&source=FB_Page&app=facebook&entry_point=page_cta&fbclid=IwAR0cpAAl9TMPB6SvhI-itQppWx3P_HhbKZVi2ZDCgNcjl35IwH4TYrstgA4`;

  return (
    <main className={styles.container}>
      <section className={styles.section1}>
        {order.order && (
          <div className={styles.order}>
            <div className={styles.containerinfo}>
              <div>
                <strong>Número do pedido: {order.order.id}</strong>
                <a href={whatsappLink} target="_blank" rel="noreferrer">
                  <p>
                    <strong>Celular</strong>: {order.order.client}
                  </p>
                </a>
                <strong>{msg}</strong>
                <button onClick={handleclickupdate}>Marcar como atendido</button>
              </div>
              <div>
                <strong>Valor total: R${order.order.amount}</strong>
                <strong>Forma de pagamento: {order.order.paymethod}</strong>

                {order.order.paymethod === 'dinheiro' && <strong>Troco para R${order.order.troco || ''}</strong>}
              </div>

              {order.order.entregar ? (
                <div className={styles.endereco}>
                  <h3>Endereço:</h3>
                  <div>
                    <span>Bairro: {order.order.bairro}</span>
                    <span>Rua: {`${order.order.rua} Nº ${order.order.numero}`}</span>
                    <span>Referencia: {order.order.referencia || ''}</span>
                  </div>
                </div>
              ) : (
                <h3>O cliente vai retiar o pedido!</h3>
              )}
            </div>
          </div>
        )}
        <ul>
          {order.foodItems &&
            order.foodItems.map((foodItem) => (
              <li className={styles.card} key={foodItem.code}>
                <p>Código do Item: {foodItem.code}</p>
                <p>Nome do Item: {foodItem.name}</p>
                {foodItem.size && <p>Tamanho: {foodItem.size}</p>}
                {foodItem.border && <p>Borda: {foodItem.border}</p>}
                <p>Quantidade do Item: {foodItem.quantity}</p>
              </li>
            ))}
          {order && <h3 styles={{}}>{order.order.comentarios}</h3>}
        </ul>
      </section>
    </main>
  );
};

export default Order;
