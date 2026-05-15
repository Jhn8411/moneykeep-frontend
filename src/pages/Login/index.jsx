import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Login.css';

import logoImg from '../../assets/Logo.svg';

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('/users/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('@MoneyKeep:token', token);
      localStorage.setItem('@MoneyKeep:user', JSON.stringify(user));

      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Erro de conexão com o servidor. Tente novamente.');
      }
    }
  };

  return (
    /* ✅ .login-page envolve tudo e aplica o fundo verde-escuro no desktop */
    <div className="login-page">
      <div className="login-container">

        {/* ── Lado esquerdo: banner verde claro com logo grande (desktop) ── */}
        <div className="login-banner">
          <img src={logoImg} alt="MoneyKeep Logo" className="banner-logo" />
        </div>

        {/* ── Lado direito: formulário ── */}
        <div className="login-content">

          {/* Logo pequena — visível apenas em mobile/tablet */}
          <img src={logoImg} alt="MoneyKeep Logo" className="mobile-logo" />

          <h1>Seja bem vindo ao MoneyKeep</h1>
          <p>Faça seu login ou cadastro para começar!</p>

          <form onSubmit={handleLogin}>

            {error && <div className="error-message">{error}</div>}

            <div className="input-group">
              <label>E-mail</label>
              <input
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>Senha</label>
              <input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary">Entrar</button>
            <button type="button" className="btn-outline" onClick={() => navigate('/cadastro')}>
              Cadastrar-se
            </button>

          </form>

          <a href="#" className="forgot-password">Esqueci minha senha</a>
        </div>

      </div>
    </div>
  );
};

export default Login;