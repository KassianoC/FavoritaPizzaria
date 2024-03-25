import { useEffect, createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Adicione o código abaixo para carregar o carrinho do localStorage ao inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const addToCart = (product, quantity) => {
    const newCart = { ...cart };
    if (newCart[product.code]) {
      newCart[product.code] = {
        ...newCart[product.code],
        quantity: newCart[product.code]?.quantity + quantity || 1,
        price: product.price, // Adiciona o preço ao objeto do carrinho
      };
    } else {
      newCart[product.code] = { ...product, quantity: quantity };
    }
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart)); // Salva o carrinho no localStorage
  };

  const removeFromCart = (productId) => {
    const newCart = { ...cart };
    delete newCart[productId];
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart)); // Salva o carrinho no localStorage
  };

  const updateQuantity = (productId, quantity) => {
    const newCart = { ...cart };
    newCart[productId].quantity = quantity;
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart)); // Salva o carrinho no localStorage
  };

  const clearCart = () => {
    setCart({});
    localStorage.removeItem('cart'); // Remove o carrinho do localStorage
  };

  const totalItems = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};
