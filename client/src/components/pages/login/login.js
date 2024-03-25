import styles from './login.module.css';
import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { AuthContext } from '../../../context/auth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleClickLogin = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <main className={styles.container}>
      <form onSubmit={handleClickLogin} className={styles.form}>
        <h2>Login</h2>
        <input name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Entrar</button>
      </form>
    </main>
  );
};

export default Login;
