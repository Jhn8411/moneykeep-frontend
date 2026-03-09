import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Ferramenta para mudar de página
import api from '../../services/api'; // O nosso arquivo configurado com o Axios
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Novo estado para guardar mensagens de erro
  
  const navigate = useNavigate(); // Inicializamos a ferramenta de navegação

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Limpa qualquer erro antigo toda vez que o usuário tenta logar

    try {
      // 1. Enviamos os dados para a URL exata do nosso backend
      const response = await api.post('/users/login', {
        email: email,
        password: password
      });

      // 2. Se deu certo, extraímos o token e os dados da resposta
      const { token, user } = response.data;

      // 3. Salvamos a "Pulseira VIP" (Token) no cofre do navegador (localStorage)
      localStorage.setItem('@MoneyKeep:token', token);
      
      // Opcional: Salvar os dados do usuário para mostrar o nome dele no Header depois
      localStorage.setItem('@MoneyKeep:user', JSON.stringify(user));

      // 4. Sucesso total! Redireciona o usuário para o Dashboard
      navigate('/dashboard');

    } catch (err) {
      // Se o backend retornar um erro (ex: Status 401 Credenciais Inválidas), cai aqui
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); // Mostra o erro que veio lá do backend
      } else {
        setError('Erro de conexão com o servidor. Tente novamente.'); // Erro genérico
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-banner"></div>

      <div className="login-content">
        <h1>Seja bem vindo ao<br/>MoneyKeep</h1>
        <p>Faça seu login ou cadastro para começar!</p>

        <form onSubmit={handleLogin}>
          
          {/* Se a variável 'error' tiver algum texto, renderiza a caixinha de erro */}
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
          <button type="button" className="btn-outline"onClick={() => navigate('/cadastro')}>Cadastrar-se</button>
        </form>

        <a href="#" className="forgot-password">Esqueci minha senha</a>
      </div>
    </div>
  );
};

export default Login;