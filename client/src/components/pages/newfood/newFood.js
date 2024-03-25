import { Formik, useFormik, Form, Field } from 'formik';
import styles from './newFood.module.css';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaPercent, FaDollarSign } from 'react-icons/fa';
import img from '../../../img/logo.jpg';

import Preview from '../../pages/preview/preview';
import { api } from '../../../utils/api';

const NewFood = () => {
  const navigate = useNavigate();
  const [token] = useState(localStorage.getItem('token') || '');
  const formik = useFormik({ initialValues: { image: '' } });
  const [msg, setMsg] = useState('');
  const [price, setPrice] = useState('');
  const [price1, setPrice1] = useState('');
  const [price2, setPrice2] = useState();
  const [price3, setPrice3] = useState();
  const [size, setSize] = useState('P');
  const [size1, setSize1] = useState('M');
  const [size2, setSize2] = useState('G');
  const [size3, setSize3] = useState('OUTRA');
  const { code } = useParams();
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    api.get(`/foods/foodCode/${code}`).then((response) => {
      setProduct(response.data[0]);
    });
  }, [code]);

  const route = product ? `/Product/editProduct/${product.code}` : '/foods/newfood';
  const httpMethod = product ? 'patch' : 'post';

  const handleClickRegister = (values) => {
    api
      .request({
        method: httpMethod,
        url: route,
        data: {
          name: values.name[0].toUpperCase() + values.name.substring(1).toLowerCase() || product.name,
          price: price,
          price1: price1 || '',
          price2: price2 || '',
          price3: price3 || '',
          size: size,
          size1: size1 || '',
          size2: size2 || '',
          size3: size3 || '',
          description: values.description || '',
          image: formik.values.image || '',
          category: category,
        },
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Basic ${token}`,
        },
      })
      .then((response) => {
        setMsg(response.data.msg);
        setTimeout(() => {
          if (response.status === 200) {
            //navigate('/products');
          }
        }, 2000);
        console.log(response);
      });
  };

  const initialvalues = {
    name: product && product.name,
    price: product && product.price,
    description: product && product.description,
  };

  console.log(category);

  return (
    <main className={styles.container}>
      <span className={styles.msg}>{msg}</span>
      <Formik enableReinitialize initialValues={initialvalues} onSubmit={handleClickRegister}>
        <Form className={styles.form}>
          <section className={styles.section1}>
            <h2>{product ? 'Editar Produto' : 'Novo Produto'}</h2>
            <select value={category} onChange={(e) => setCategory(e.target.value)} name="" id="">
              <option value="">category</option>
              <option value="Pizza">Pizza</option>
              <option value="Lanche">Lanche</option>
              <option value="Panqueca">Panqueca</option>
              <option value="Porcoes">Porçoes</option>
              <option value="Bebidas">Bebidas</option>
              <option value="Bordas">Bordas</option>
            </select>
            <Field name="name" placeholder="Nome do produto" type="text" />
            {category === 'Pizza' ? (
              <div className={styles.variations}>
                <div>
                  <Field
                    value={price}
                    name="price"
                    placeholder="Preço"
                    type="number"
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <select value={size} onChange={(e) => setSize(e.target.value)} name="" id="">
                    <option value="">Tamanho</option>
                    <option value="P">P</option>
                    <option value="Pequena">Pequena</option>
                    <option value="Brotinho">Brotinho</option>
                  </select>
                </div>
                <div>
                  <Field
                    value={price1}
                    name="price"
                    placeholder="Preço"
                    type="number"
                    onChange={(e) => setPrice1(e.target.value)}
                  />
                  <select value={size1} onChange={(e) => setSize1(e.target.value)} name="" id="">
                    <option value="">Tamanho</option>
                    <option value="M">M</option>
                    <option value="Média">Media</option>
                  </select>
                </div>
                <div>
                  <Field
                    value={price2}
                    name="price"
                    placeholder="Preço"
                    type="number"
                    onChange={(e) => setPrice2(e.target.value)}
                  />
                  <select value={size2} onChange={(e) => setSize2(e.target.value)} name="" id="">
                    <option value="">Tamanho</option>
                    <option value="G">G</option>
                    <option value="Grande">Grande</option>
                  </select>
                </div>
                <div>
                  <Field
                    value={price3}
                    name="price"
                    placeholder="Preço"
                    type="number"
                    onChange={(e) => setPrice2(e.target.value)}
                  />
                  <select value={size3} onChange={(e) => setSize3(e.target.value)} name="" id="">
                    <option value="">Tamanho</option>
                    <option value="P">P</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                    <option value="OUTRA">OUTRA</option>
                  </select>
                </div>
              </div>
            ) : (
              <Field
                value={price}
                name="price"
                placeholder="price de venda do produto"
                type="number"
                onChange={(e) => setPrice(e.target.value)}
              />
            )}

            <Field name="description" placeholder="Descrição do produto" as="textarea" />
            <button type="submit">Salvar</button>
          </section>
          <section className={styles.section2}>
            <div>
              <label For="image">
                <p>Foto do produto</p>
                {formik.values.image ? (
                  <Preview file={formik.values.image} />
                ) : product && product.image ? (
                  <img src={`${process.env.REACT_APP_API}/images/${product.image}`} alt="" />
                ) : (
                  <img src={img} alt="" />
                )}
              </label>
            </div>
            <Field
              onChange={(e) => formik.setFieldValue('image', e.target.files[0])}
              id="image"
              name="image"
              placeholder="foto"
              type="file"
            />
          </section>
        </Form>
      </Formik>
    </main>
  );
};

export default NewFood;
