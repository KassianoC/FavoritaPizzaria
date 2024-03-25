import React, { useState, useEffect } from 'react';
import styles from './orders.module.css';
import { Link } from 'react-router-dom';
import { api } from '../../../../utils/api';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const [order, setOrder] = useState([]);
  const navigate = useNavigate();
  const [prevOrderIds, setPrevOrderIds] = useState([]);

  const playNotificationSound = () => {
    const audio = new Audio('./caixa_registradora_efeito_sonoro_toquesengracadosmp3.com.mp3');
    audio.play();
  };

  const arraysEqual = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders/getAllOrders');

        const currentOrderIds = response.data.map((order) => order.id);

        if (!arraysEqual(currentOrderIds, prevOrderIds)) {
          setOrder(response.data);
          playNotificationSound();
          setPrevOrderIds(currentOrderIds);
        }
      } catch (error) {
        console.error('Error fetching order data:', error);
      }
    };

    fetchOrders();
    const intervalId = setInterval(fetchOrders, 10000);

    return () => clearInterval(intervalId);
  }, [prevOrderIds]);

  return (
    <main className={styles.container}>
      <section className={styles.section1}>
        <table className="table">
          <thead>
            <tr>
              <th>Numero#</th>
              <th>Cliente</th>
              <th>entregar</th>
              <th>Bairro</th>
              <th>Total</th>
              <th>data</th>
              <th>Horas</th>
            </tr>
          </thead>

          <tbody>
            {order.map((order) => (
              <tr onClick={() => navigate(`/orderid/${order.id}`)} key={order.id}>
                <td style={{ backgroundColor: order.atendido && '#b61100' }}>{order.id}</td>
                <td style={{ backgroundColor: order.atendido && '#b61100' }}>{order.client}</td>
                <td style={{ backgroundColor: order.atendido && '#b61100' }}>
                  {order.entregar === true ? 'Sim' : 'Não'}
                </td>
                <td style={{ backgroundColor: order.atendido && '#b61100' }}>{order.bairro ? order.bairro : 'N/A'}</td>
                <td style={{ backgroundColor: order.atendido && '#b61100' }}>R$: {order.amount}</td>
                <td style={{ backgroundColor: order.atendido && '#b61100' }}>
                  {order.createdAt[8]}
                  {order.createdAt[9]}/{order.createdAt[5]}
                  {order.createdAt[6]}/{order.createdAt[0]}
                  {order.createdAt[1]}
                  {order.createdAt[2]}
                  {order.createdAt[3]}
                </td>
                <td style={{ backgroundColor: order.atendido && '#b61100' }}>
                  {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} H
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
};

export default Orders;
