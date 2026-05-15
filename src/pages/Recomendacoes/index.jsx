import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiMenu, FiUser, FiSmile } from 'react-icons/fi';
import api from '../../services/api';
import './Recomendacoes.css';

// ✅ Ícones de aviso customizados
import iconAvisoVerde    from '../../assets/aviso-verde.svg';
import iconAvisoAmarelo  from '../../assets/aviso-amarelo.svg';
import iconAvisoVermelho from '../../assets/aviso-vermelho.svg';

const Recomendacoes = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { toggleMenu } = useOutletContext();
  const user = JSON.parse(localStorage.getItem('@MoneyKeep:user') || '{}');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get('/api/recommendations');
        setRecommendations(response.data);
      } catch (error) {
        console.error('Erro ao buscar recomendações:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, []);

  const getIconSrc = (type) => {
    switch (type) {
      case 'success': return iconAvisoVerde;
      case 'warning': return iconAvisoAmarelo;
      case 'danger':  return iconAvisoVermelho;
      default:        return iconAvisoAmarelo;
    }
  };

  const getBgClass = (type) => {
    switch (type) {
      case 'success': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'danger':  return 'bg-danger';
      default:        return 'bg-warning';
    }
  };

  if (loading) return <h2 style={{ padding: '32px', color: 'var(--color-primary)' }}>A analisar a sua saúde financeira…</h2>;

  return (
    <div className="recomendacoes-container">

      {/* HEADER */}
      <header className="page-header">
        <div className="header-left">
          <FiMenu className="menu-toggle" size={26} onClick={toggleMenu} />
          <h1 className="page-title">Recomendações</h1>
        </div>
        <div className="user-profile">
          <span className="user-name">{user.name || 'Usuário'}</span>
          <div className="user-avatar"><FiUser /></div>
        </div>
      </header>

      {/* LISTA DE CARDS */}
      <div className="recomendacoes-body">
        {recommendations.length > 0 ? (
          recommendations.map((rec, index) => (
            <div className="recomendacao-card" key={index}>

              {/* Título com borda */}
              <div className="rec-title-row">
                <h3 className="rec-title">{rec.title}</h3>
              </div>

              {/* Ícone + mensagem */}
              <div className="rec-body">
                <div className={`rec-icon-wrapper ${getBgClass(rec.type)}`}>
                  <img src={getIconSrc(rec.type)} alt={rec.type} width={20} height={20} />
                </div>
                <p className="rec-message">{rec.message}</p>
              </div>

            </div>
          ))
        ) : (
          <div className="empty-state">
            <FiSmile size={48} />
            <h3>Tudo perfeito por aqui!</h3>
            <p>Você não tem nenhum alerta financeiro no momento. Continue registrando suas transações!</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Recomendacoes;