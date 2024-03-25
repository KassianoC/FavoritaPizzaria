import styles from './nav.module.css';
import logo from '../../../img/logo.jpg';
import { CartContext } from '../../../context/cart';
import { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/auth';
import { MdOutlineMenuBook } from 'react-icons/md';
import { BiSolidFoodMenu } from 'react-icons/bi';
import Logo from '../logo/Logo';

function NavBar() {
  const { cart } = useContext(CartContext);
  const cartItems = Object.values(cart);
  const totalItems = cartItems.reduce((acc, item) => acc + Number(item.quantity), 0);
  const { authenticated, logout, admin } = useContext(AuthContext);
  const [classcar, setClasscar] = useState('');
  const [onMenu, setOnMenu] = useState(false);
  const [startX, setStartX] = useState(null);
  const [currentX, setCurrentX] = useState(null);
  const menuRef = useRef(null);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (startX && currentX) {
      const diff = currentX - startX;
      if (diff < -50) {
        setOnMenu(false);
      }
    }
    setStartX(null);
    setCurrentX(null);
  };

  useEffect(() => {
    setClasscar(styles.car);

    setTimeout(() => {
      setClasscar(styles.carReturn);
    }, 2000);
  }, [cart]);

  return (
    <nav
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={styles.container}
    >
      <section className={styles.section1}>
        <div>
          <Link to="./">
            <Logo />
            {/* <img src="https://sachefmio.blob.core.windows.net/chefmio/logo/top-pizza.png" alt="" /> */}
          </Link>
        </div>
        {admin ? (
          <div className={styles.admin}>
            <Link to="/orders">todos pedidos</Link>
            <Link to="/newfood">Novo Prodruto</Link>
            {/* <Link to="/roulette">Sorteio</Link> */}
            <button onClick={logout}>Sair</button>
          </div>
        ) : (
          <>
            {totalItems > 0 && (
              <Link className={classcar} to="/cart">
                Pedido
                {totalItems > 0 && <sup>{Number(totalItems)}</sup>}
              </Link>
            )}

            <div>
              {onMenu ? (
                <MdOutlineMenuBook onClick={() => setOnMenu(false)} className={styles.btnmenu} />
              ) : (
                <BiSolidFoodMenu onClick={() => setOnMenu(true)} className={styles.btnmenu} />
              )}
            </div>
          </>
        )}
      </section>

      <section ref={menuRef} className={`${styles.menu} ${onMenu ? styles.showMenu : ''}`}>
        <div className={styles.logo}>
          <Logo />
        </div>

        {/* <img src="https://sachefmio.blob.core.windows.net/chefmio/logo/top-pizza.png" alt="" /> */}
        <ul onClick={() => setOnMenu(false)}>
          <li>
            🍽️
            <Link to="/foods">Cardapio completo</Link>
          </li>
          <li>
            🍕
            <Link to="foodsfilter/Pizza"> Pizza</Link>
          </li>
          <li>
            🥪
            <Link to="foodsfilter/Lanche">Lanche</Link>
          </li>
          <li>
            🥞
            <Link to="foodsfilter/Panqueca"> Panqueca</Link>
          </li>
          <li>
            🍟
            <Link to="foodsfilter/Porçoes"> Porçoes</Link>
          </li>
          <li>
            🥤
            <Link to="foodsfilter/Bebidas"> Bebidas</Link>
          </li>
        </ul>
      </section>
    </nav>
  );
}

export default NavBar;
