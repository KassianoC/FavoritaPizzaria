import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/layout/nav/nav';
import Container from '../components/layout/container/container';
import Home from '../components/pages/Home/home';
import Footer from '../components/layout/footer/footer';
import Login from '../components/pages/login/login';
import { useContext } from 'react';
import { AuthProvider, AuthContext } from '../context/auth';
import { CartProvider } from '../context/cart';
import NewFood from '../components/pages/newfood/newFood';
import Foods from '../components/pages/foods/foods';
import Cart from '../components/pages/cart/cart';
import Orders from '../components/pages/admin/orders/orders';
import Order from '../components/pages/admin/order/order';
import Food from '../components/pages/food/food';
import FoodsFilter from '../components/pages/foodsFilter/foodsFilter';
import Roulette from '../components/pages/admin/roulette/roulette';

const Admin = ({ children }) => {
  const { authenticated, admin, loading } = useContext(AuthContext);
  if (loading) {
    return <div className="loading">Carregando Dados...</div>;
  }
  if (!authenticated || (authenticated && !admin)) {
    return <Navigate to="/foods" />;
  }
  return children;
};

const Rout = () => {
  return (
    <div>
      <Router>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <Container>
              <Routes>
                {/* Rtotas abertas! */}
                <Route path="/" exact element={<Home />} />
                <Route path="/foods" element={<Foods />} />
                <Route path="/foodsfilter/:category" element={<FoodsFilter />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/food/:name" element={<Food />} />
                <Route path="/admin" element={<Login />} />

                {/* Rotas  Admin */}
                <Route
                  path="/roulette"
                  element={
                    <Admin>
                      <Roulette />
                    </Admin>
                  }
                />
                <Route
                  path="/newfood"
                  element={
                    <Admin>
                      <NewFood />
                    </Admin>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <Admin>
                      <Orders />
                    </Admin>
                  }
                />
                <Route
                  path="/orderid/:code"
                  element={
                    <Admin>
                      <Order />
                    </Admin>
                  }
                />
              </Routes>
            </Container>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </Router>
    </div>
  );
};

export default Rout;
