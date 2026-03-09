import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './Cadastro.css';
// Importamos os estilos globais de input e botões (podem estar no global ou partilhados do Login)
import '../Login/Login.css'; 

const Cadastro = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); // Limpa os erros ao tentar novamente

    try {
      // Faz o POST para a rota de criar utilizador no backend
      // (Ajuste a URL '/users' se a sua rota de cadastro for '/users/register')
      await api.post('/users', {
        name: name,
        email: email,
        password: password
      });

      alert('Conta criada com sucesso! Faça login para entrar.');
      
      // Redireciona o utilizador de volta para a tela de Login
      navigate('/');

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); // Ex: "E-mail já cadastrado"
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
    }
  };

  return (
    <div className="cadastro-container">
      
      {/* Lado Esquerdo */}
      <div className="cadastro-banner"></div>

      {/* Lado Direito */}
      <div className="cadastro-content">
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
              placeholder="Crie uma senha forte" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              minLength="6"
            />
          </div>

          <button type="submit" className="btn-primary">Cadastrar</button>
          
          {/* Botão de Voltar para a tela de Login */}
          <button 
            type="button" 
            className="btn-outline" 
            onClick={() => navigate('/')}
          >
            Voltar
          </button>
        </form>
      </div>

    </div>
  );
};

export default Cadastro;