import React, { useState, useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiXCircle, FiSmile } from 'react-icons/fi';
import api from '../../services/api';
import './Recomendacoes.css';

const Recomendacoes = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await api.get('/recommendations');
        setRecommendations(response.data);
      } catch (error) {
        console.error('Erro ao buscar recomendações:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  // Função mágica que escolhe o ícone e a cor baseada no tipo da recomendação
  const getIconAndClass = (type) => {
    switch (type) {
      case 'success':
        return { icon: <FiCheckCircle />, cssClass: 'bg-success' };
      case 'warning':
        return { icon: <FiAlertCircle />, cssClass: 'bg-warning' };
      case 'danger':
        return { icon: <FiXCircle />, cssClass: 'bg-danger' };
      default:
        return { icon: <FiAlertCircle />, cssClass: 'bg-warning' };
    }
  };

  if (loading) return <h2>A analisar a sua saúde financeira...</h2>;

  return (
    <div className="recomendacoes-container">
      
      <header className="page-header">
        <h1 className="page-title">Recomendações Inteligentes</h1>
        <p style={{ color: '#6B7280', marginTop: '4px' }}>
          Análises e alertas automáticos baseados nos seus gastos do mês.
        </p>
      </header>

      {recommendations.length > 0 ? (
        <div className="recomendacoes-grid">
          {recommendations.map((rec, index) => {
            const { icon, cssClass } = getIconAndClass(rec.type);
            
            return (
              <div className="recomendacao-card" key={index}>
                <div className={`rec-icon-wrapper ${cssClass}`}>
                  {icon}
                </div>
                <div className="rec-content">
                  <h3 className="rec-title">{rec.title}</h3>
                  <p className="rec-message">{rec.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <FiSmile size={48} />
          <h3>Tudo perfeito por aqui!</h3>
          <p>Você não tem nenhum alerta financeiro no momento. Continue registrando suas transações!</p>
        </div>
      )}

    </div>
  );
};

export default Recomendacoes;