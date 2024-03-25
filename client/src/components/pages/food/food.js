import React, { useEffect, useState, useContext } from 'react';
import { api } from '../../../utils/api';
import { useParams } from 'react-router-dom';
import styles from './food.module.css';
import { CartContext } from '../../../context/cart';
import { AuthContext } from '../../../context/auth';
import { useNavigate } from 'react-router-dom';

const Food = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const { addToCart } = useContext(CartContext);
  const [allFoods, setAllFoods] = useState([]);
  const [bordas, setBordas] = useState('');
  const [selectedSize, setSelectedSize] = useState('G');
  const [selectedBorder, setSelectedBorder] = useState('');
  const [food, setFood] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showAddToCartMsg, setShowAddToCartMsg] = useState(null);
  const [msg, setMsg] = useState(null);
  const { admin } = useContext(AuthContext);

  const deleteFood = (name) => {
    api.delete(`/foods/deletefood/${name}`, {}).then((response) => {
      setMsg(response.data.msg);
      setTimeout(() => {
        navigate('/foods');
      }, 3000);
    });
  };

  const handleAddToCart = () => {
    addToCart(food || allFoods[0], Number(quantity));
    setShowAddToCartMsg('Item adicionado!');

    setTimeout(() => {
      setShowAddToCartMsg(false);
    }, 2000);
  };

  useEffect(() => {
    api.get(`foods/foodCode/${name}`).then((response) => {
      setAllFoods(response.data);
    });
  }, [name]);

  useEffect(() => {
    api.get('/foods/getallfood').then((response) => {
      setBordas(response.data);
    });
  }, []);

  useEffect(() => {
    // Lógica para encontrar a pizza correspondente com base em selectedSize e selectedBorder
    const foundFood = allFoods.find((item) => item.size === selectedSize && item.border === selectedBorder);
    setFood(foundFood);
  }, [selectedSize, selectedBorder, allFoods]);

  return (
    <main className={styles.container}>
      <strong>{msg}</strong>
      {allFoods && allFoods[0] && (
        <section className={styles.section1}>
          <strong style={{ fontSize: '1.5em' }}>{showAddToCartMsg}</strong>
          <h1 className={styles.name}>{allFoods[0].name}</h1>
          <div style={{ display: 'flex', gap: '0.5em' }}>
            <img className="avatar" src={`${process.env.REACT_APP_API}/images/foods/${allFoods[0].image}`} alt="" />
            <div>
              <span>{allFoods[0].description}</span>
            </div>
          </div>
          {food && (
            <>
              <div className={styles.select}>
                <label htmlFor="sizeSelector">Escolha o Tamanho:</label>
                <select
                  id="sizeSelector"
                  value={selectedSize}
                  onChange={(event) => setSelectedSize(event.target.value)}
                >
                  <option value="P">P</option>
                  <option value="M">M</option>
                  <option value="G">G</option>
                </select>
              </div>
              <div className={styles.select}>
                <label htmlFor="borderSelector">Escolha a Borda:</label>
                <select value={selectedBorder} onChange={(event) => setSelectedBorder(event.target.value)}>
                  <option value="">Sem borda</option>
                  {bordas &&
                    bordas
                      .filter((item) => item.category === 'Bordas')
                      .map((item) => (
                        <option key={item.name} value={item.name}>
                          {`${item.name} - R$${item.price}`}
                        </option>
                      ))}
                </select>
              </div>
            </>
          )}
          <div className={styles.select}>
            <label value={quantity} htmlFor="quantity">
              Quantidade
            </label>
            {food ? (
              <select onChange={(e) => setQuantity(e.target.value)} value={quantity} name="" id="">
                <option value="1">1</option>
                <option value="0.5">Meia</option>
                <option value="0.25">1/4</option>
                <option value="0.75">1/3</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            ) : (
              <input value={quantity} onChange={(e) => setQuantity(e.target.value)} name="quantity" type="number" />
            )}
          </div>

          {food ? (
            <h2>R$: {(food.price * quantity).toFixed(2)}</h2>
          ) : (
            <h2>R$: {(allFoods[0].price * quantity).toFixed(2)}</h2>
          )}

          <button onClick={handleAddToCart}>Adicionar ao pedido</button>
          {admin && <button onClick={() => deleteFood(food.name)}>Excluir</button>}
        </section>
      )}
    </main>
  );
};

export default Food;
