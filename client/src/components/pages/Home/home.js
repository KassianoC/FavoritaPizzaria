import { useEffect, useState } from 'react';
import styles from './home.module.css';
import { api } from '../../../utils/api';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  function discount(price) {
    return price - price * 0.05;
  }

  useEffect(() => {
    api.get('/foods/getallfood').then((response) => {
      const uniqueProdcts = response.data.filter((product) => product.description !== '');
      setProducts(uniqueProdcts);
    });
  }, []);
  return (
    <main className={styles.container}>
      <h1>Promoções da semana</h1>
      <section className={styles.section1}>
        {products.length > 0 &&
          products.map((product) => (
            <div
              onClick={() => navigate(`/food/${product.name}`)}
              className={product.category == 'Bebidas' ? styles.bebidas : styles.food}
              key={product.code}
            >
              <h2>{product.category == 'Pizza' ? 'Pizza ' + product.name : product.name}</h2>
              <img className="avatar" src={`${process.env.REACT_APP_API}/images/foods/${product.image}`} alt="" />
              <del>R$: {product.price}</del>
              <span>R$: {discount(product.price).toFixed(2)}</span>
            </div>
          ))}
      </section>
      <section></section>
    </main>
  );
}
export default Home;
