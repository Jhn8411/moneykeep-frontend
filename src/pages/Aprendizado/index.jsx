import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiImage } from 'react-icons/fi';
import api from '../../services/api';
import './Aprendizado.css';

const Aprendizado = () => {
  const [groupedContents, setGroupedContents] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await api.get('/contents');
        setGroupedContents(response.data);
      } catch (error) {
        console.error('Erro ao carregar conteúdos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, []);

  if (loading) return <h2>A carregar a sua trilha de aprendizagem...</h2>;

  // Transformamos as chaves do objeto (Iniciante, Intermediário, Avançado) num array para percorrer
  const levels = Object.keys(groupedContents);

  return (
    <div className="aprendizado-container">
      <header className="page-header">
        <h1 className="page-title">Aprendizado</h1>
        <p style={{ color: '#6B7280', marginTop: '4px' }}>
          Melhore a sua literacia financeira com os nossos conteúdos exclusivos.
        </p>
      </header>

      {levels.map(level => {
        const contents = groupedContents[level];
        
        // Se este nível não tiver nenhum conteúdo, não o renderizamos
        if (!contents || contents.length === 0) return null;

        return (
          <section className="level-section" key={level}>
            <h2 className="level-title">Nível {level}</h2>
            
            <div className="cards-grid">
              {contents.map(content => (
                // Usamos o Link do React Router para navegar para a página do artigo específico
                <Link to={`/aprendizado/${content.id}`} className="conteudo-card" key={content.id}>
                  
                  {/* Se tiver URL de imagem, mostra a imagem; se não, mostra um fundo verde com um ícone */}
                  {content.image_url ? (
                    <img src={content.image_url} alt={content.title} className="card-image" />
                  ) : (
                    <div className="card-image-placeholder">
                      <FiImage size={32} opacity={0.5} />
                    </div>
                  )}

                  <div className="card-info">
                    <span className="card-level-badge">{content.level}</span>
                    <h3 className="card-title">{content.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

    </div>
  );
};

export default Aprendizado;