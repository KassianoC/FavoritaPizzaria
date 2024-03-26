import { useContext, useState, useRef, useEffect } from 'react';
import { CartContext } from '../../../context/cart';
import img from '../../../img/logo.jpg';
import { BsTrash3 } from 'react-icons/bs';
import { api } from '../../../utils/api';
import { useNavigate } from 'react-router-dom';
import styles from './cart.module.css';
import { generateWhatsAppMessage } from './watsClient';
import { PriceTheBairros } from './priceTheBairros';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const h2Ref = useRef(null);
  const cartItems = Object.values(cart);
  const totalValue = cartItems.reduce((acc, item) => acc + item.price * Number(item.quantity), 0);
  const totalItems = cartItems.reduce((acc, item) => acc + Number(item.quantity), 0);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [Finaliza, setFinaliza] = useState(false);
  const [entregar, setEntregar] = useState(false);

  const [paymethod, setPaymethod] = useState('');
  const [client, setClient] = useState('');
  const [troco, setTroco] = useState(0);
  const [bairro, setBairro] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [referencia, setReferencia] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [taxa, setTaxa] = useState(0);

  const [endereco, setEndereco] = useState([]); //estado pata o endereço do cliente  causo ja tenha   comprado uma vez

  useEffect(() => {
    api.get(`/orders/returnAddress/${client}`, {}).then((response) => {
      setEndereco((prevEndereco) => {
        // Use a função de callback para garantir que estamos usando o valor mais recente
        const newEndereco = response.data;

        // Atualize os outros estados
        setBairro(newEndereco.bairro);
        setRua(newEndereco.rua);
        setNumero(newEndereco.numero);
        setReferencia(newEndereco.referencia);

        // Retorne o novo valor para atualizar o estado
        return newEndereco;
      });
    });
  }, [client]);

  console.log(totalItems);

  useEffect(() => {
    if (Finaliza && totalItems % 1 !== 0) {
      setFinaliza(false);
      setMsg('Não é permitido a venda de 1/2 Pizza, escolha a outra metade! 🍕');

      setTimeout(() => {
        setMsg('');
      }, 3000);
    }
  }, [cartItems, Finaliza]);

  useEffect(() => {
    cartItems.map((item) => {
      if (item.category !== 'Pizza' && item.quantity % 1 !== 0) {
        setMsg(`🚫${item.name}, Não permite venda fracionada!`);
        setTimeout(() => {
          setFinaliza(false);
          setMsg('');
        }, 2000);
      }
    });
  });

  const handleAbrirWhatsApp = (whatsappMessage) => {
    const whatsappURL = `https://api.whatsapp.com/send?phone=5535992020799&text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappURL, '_blank');
  };

  PriceTheBairros(bairro, setTaxa, entregar);

  const handleClickSale = async () => {
    const cartItems = Object.values(cart);
    const cartData = {
      products: cartItems.map((item) => ({
        code: item.code,
        quantity: item.quantity,
        price: item.price, // Adiciona o preço ao objeto do carrinho
      })),
      client,
      paymethod,
      entregar,
      troco,
      bairro,
      rua,
      numero,
      referencia,
      comentarios,
      amount: 0,
      taxa,
    };

    try {
      const response = await api.post('/orders/neworder', cartData, {});

      setMsg(response.data.msg);
      setTimeout(() => {
        setMsg('');
      }, 3000);

      if (response.status === 200) {
        const whatsappMessage = generateWhatsAppMessage(
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
        );
        handleAbrirWhatsApp(whatsappMessage);
        setBairro('');
        setClient('');
        setNumero('');
        setReferencia('');
        setPaymethod('');
        setClient('');
        setEntregar('');
        setComentarios('');
        setTroco('');
        clearCart();
        navigate('/foods');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = (productCode) => {
    removeFromCart(productCode);
  };
  const handleQuantityChange = (productCode, e) => {
    const newQuantity = parseFloat(e.target.value);
    updateQuantity(productCode, newQuantity);
  };

  return (
    <main className={styles.container}>
      {loading && <div className={styles.loading}>Aguarde....</div>}

      <h1>Seu Pedido</h1>
      {!Finaliza && (
        <section className={styles.section1}>
          {cartItems.map((product) => (
            <div className={styles.containerCard} key={product.code}>
              <div className={styles.info}>
                <div className={styles.productimg}>
                  {product.image ? (
                    <img className="avatar" src={`${process.env.REACT_APP_API}/images/foods/${product.image}`} alt="" />
                  ) : (
                    <img src={img} alt="" />
                  )}
                </div>
                <div className={styles.product}>
                  <p>
                    {product.name} {product.size && ' - ' + product.size}
                  </p>
                  {product.border && <p>Borda de {product.border}</p>}
                  <p>Valor Unitário: R${product.price}</p>
                  <p>Total: R${(Number(product.price) * Number(product.quantity)).toFixed(2)}</p>
                  <label htmlFor={`quantity-${product.code}`}>quant: </label>
                  <input
                    step={product.category === 'Pizza' ? 0.25 : 1}
                    min={product.category === 'Pizza' ? 0.25 : 1}
                    type="number"
                    id={`quantity-${product.code}`}
                    value={product.quantity}
                    onChange={(e) => handleQuantityChange(product.code, e)}
                  />
                </div>
              </div>

              <div className={styles.productActions}>
                {cart.length < 1 ? '' : <button onClick={() => handleRemove(product.code)}>X</button>}
              </div>
            </div>
          ))}
          <h3>Total: R$ {(parseFloat(taxa) + parseFloat(totalValue)).toFixed(2)}</h3>
          <button onClick={() => setFinaliza(true)}>Avançar</button>
        </section>
      )}

      <strong style={{ color: 'white' }}>{msg}</strong>

      {Finaliza && (
        <section className={styles.section2}>
          <h2 ref={h2Ref} tabIndex="-1">
            {msg}
          </h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <h3>Total: R$ {(parseFloat(taxa) + parseFloat(totalValue)).toFixed(2)}</h3>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-around' }}>
              <label htmlFor="entregar">Entregar</label>
              <input checked={entregar} onChange={() => setEntregar(true)} type="checkbox" name="entregar" />
              <label htmlFor="retirar">Retirar</label>
              <input checked={!entregar} onChange={() => setEntregar(false)} type="checkbox" name="entregar" />
            </div>
            <input onChange={(e) => setClient(e.target.value)} placeholder="Numero de celular com DDD" type="number" />

            <div className={styles.entrega}>
              {entregar && (
                <>
                  <div className={styles.bairro}>
                    <select value={bairro} onChange={(e) => setBairro(e.target.value)}>
                      <option value="">Bairro</option>
                      <option value="Santa Efigênia">Santa Efigênia</option>
                      <option value="Centro">Centro</option>
                      <option value="Santa Isabel">Santa Isabel</option>
                      <option value="Jardim Beira Rio">Jardim Beira Rio</option>
                      <option value="Res. Jardim Panorama">Res. Jardim Panorama</option>
                      <option value="Estação">Estação</option>
                      <option value="Laje">Laje</option>
                      <option value="Santa Bárbara do Sapucaí">Santa Bárbara do Sapucaí</option>
                    </select>
                    <p>{taxa > 0 && `Taxa de Entrega: R$${taxa.toFixed(2)}`}</p>
                  </div>
                  <input value={rua} onChange={(e) => setRua(e.target.value)} placeholder="Rua" type="text" />
                  <input value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Numero" type="text" />
                  <input
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    placeholder="Referencia"
                    type="text"
                  />
                </>
              )}

              <div className={styles.paymethod}>
                <select value={paymethod} name="" id="" onChange={(e) => setPaymethod(e.target.value)}>
                  <option value="">Forma de pagamento</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="pix">Pix</option>
                  <option value="credito">Cartão de credito</option>
                  <option value="debito">Cartão de debito</option>
                </select>

                {paymethod === 'dinheiro' ? (
                  <div>
                    <input onChange={(e) => setTroco(e.target.value)} placeholder="Troco para:" type="number" />
                  </div>
                ) : (
                  paymethod === 'pix' && (
                    <div>
                      <p>
                        chave: <strong>35111111111</strong>
                      </p>
                      {/* <img src={qrcode} alt="" /> */}
                    </div>
                  )
                )}
              </div>
              <textarea
                placeholder="Se desejar adicione aqui  mais informaçoes sore o seu pedido!"
                onChange={(e) => setComentarios(e.target.value)}
                name=""
                id=""
                cols="30"
                rows="10"
              ></textarea>
              <div className={styles.button}>
                <button
                  onClick={() => {
                    handleClickSale();
                  }}
                  type="submit"
                >
                  Finalizar
                </button>
                <button onClick={() => setFinaliza(false)}>Voltar</button>
              </div>
            </div>
          </form>
        </section>
      )}
    </main>
  );
};

export default Cart;
