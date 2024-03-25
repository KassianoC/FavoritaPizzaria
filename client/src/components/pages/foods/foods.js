import styles from './foods.module.css';
import { api } from '../../../utils/api';
import { CartContext } from '../../../context/cart';
import { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';

const Foods = () => {
  const { category } = useParams();
  const [food, setFood] = useState([]);
  const [search, setSearch] = useState('');

  console.log(food);

  useEffect(() => {
    api.get('/foods/getallfood').then((response) => {
      const foodFilter = response.data.filter((food) => food.description !== '');
      const filteredFoods = category ? foodFilter.filter((food) => food.category === category) : foodFilter;

      setFood(
        filteredFoods.filter(
          (food) =>
            food.name.toLowerCase().includes(search.toLocaleLowerCase()) ||
            food.category.toLowerCase().includes(search.toLocaleLowerCase()),
        ),
      );
    });
  }, [category, search]);

  return (
    <main className={styles.container}>
      <input placeholder="Pesquisar" onChange={(e) => setSearch(e.target.value)} type="text" />
      <section className={styles.section1}>
        {food
          .filter((item) => item.category !== 'Bordas')
          .map((food) => (
            <Link to={`/food/${food.name}`}>
              <div className={styles.card} key={food.code}>
                <div>
                  <img className="avatar" src={`${process.env.REACT_APP_API}/images/foods/${food.image}`} alt="" />
                  <div>
                    <strong>{food.name}</strong>
                    <span>
                      {food.description.length > 100 ? `${food.description.slice(0, 100)}...` : food.description}
                    </span>
                  </div>
                </div>
                <div>{food.category === 'Pizza' ? <button>Opções</button> : <button>Mais</button>}</div>
              </div>
            </Link>
          ))}
      </section>
    </main>
  );
};

export default Foods;
