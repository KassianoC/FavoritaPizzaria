import React, { useState, useEffect } from 'react';
import styles from './roulette.module.css';
import { api } from '../../../../utils/api';

const Roulette = () => {
  const [clientNumbers, setClientNumbers] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = () => {
    setIsDrawing(true);
  };

  useEffect(() => {
    const drawNumber = () => {
      const randomIndex = Math.floor(Math.random() * clientNumbers.length);
      setSelectedNumber(clientNumbers[randomIndex]);
    };

    let interval;
    if (isDrawing) {
      // Mostrar todos os números por 8 segundos
      interval = setInterval(drawNumber, 50);
      setTimeout(() => {
        clearInterval(interval);
        setIsDrawing(false);
      }, 8000);
    }

    return () => clearInterval(interval);
  }, [isDrawing, clientNumbers]);

  useEffect(() => {
    // Buscar os números do servidor ao montar o componente
    api.post('/orders/prizedraw', {}, {}).then((response) => {
      console.log(response);
      setClientNumbers(response.data);
    });
  }, []);

  console.log(selectedNumber);

  return (
    <main>
      <section>
        <h1>Numero Sorteado: {selectedNumber}</h1>

        <button onClick={startDrawing} disabled={isDrawing}>
          Iniciar Sorteio
        </button>
      </section>
    </main>
  );
};

export default Roulette;
