import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import FeedbackModal from '../../components/FeedbackModal';
import './Cadastro.css';

import logoImg from '../../assets/logo.svg';

const Cadastro = () => {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');

  const [modal, setModal] = useState({ isOpen: false, type: 'success', title: '', message: '' });

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await api.post('/users/register', { name, email, password });
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Conta criada!',
        message: 'Seu cadastro foi realizado com sucesso. Faça o login para começar a usar o MoneyKeep.',
      });
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setModal({
          isOpen: true,
          type: 'error',
          title: 'Erro ao cadastrar',
          message: 'Não foi possível criar sua conta. Verifique os dados e tente novamente.',
        });
      }
    }
  };

  const handleModalClose = () => {
    if (modal.type === 'success') {
      navigate('/');
    } else {
      setModal((m) => ({ ...m, isOpen: false }));
    }
  };

  return (
    /* ✅ .cadastro-page aplica o fundo verde-escuro igual ao Login */
    <div className="cadastro-page">
      <div className="cadastro-container">

        {/* ── Lado esquerdo: banner verde claro com logo (desktop) ── */}
        <div className="cadastro-banner">
          <img src={logoImg} alt="MoneyKeep Logo" className="banner-logo" />
        </div>

        {/* ── Lado direito: formulário ── */}
        <div className="cadastro-content">

          {/* Logo pequena — visível apenas em mobile/tablet */}
          <img src={logoImg} alt="MoneyKeep Logo" className="mobile-logo" />

          <h1>Cadastro</h1>
          <p>Termine o cadastro e comece a economizar</p>

          <form onSubmit={handleRegister}>

            {error && <div className="error-message">{error}</div>}

            <div className="input-group">
              <label>Nome</label>
              <input
                type="text"
                placeholder="Digite seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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

            <button type="submit" className="btn-primary">Cadastrar</button>
            <button type="button" className="btn-outline" onClick={() => navigate('/')}>
              Voltar
            </button>

          </form>
        </div>

      </div>

      <FeedbackModal
        isOpen={modal.isOpen}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onConfirm={handleModalClose}
      />
    </div>
  );
};

export default Cadastro;