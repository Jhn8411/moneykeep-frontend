import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { FiImage, FiMenu, FiUser } from 'react-icons/fi';
import api from '../../services/api';
import './Aprendizado.css';

const Aprendizado = () => {
  const [groupedContents, setGroupedContents] = useState({});
  const [loading, setLoading] = useState(true);

  const { toggleMenu } = useOutletContext();
  const user = JSON.parse(localStorage.getItem('@MoneyKeep:user') || '{}');

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await api.get('/api/contents');
        setGroupedContents(response.data);
      } catch (error) {
        console.error('Erro ao carregar conteúdos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContents();
  }, []);

  if (loading) return <h2 style={{ padding: '32px', color: 'var(--color-primary)' }}>A carregar a sua trilha de aprendizagem…</h2>;

  const levels = Object.keys(groupedContents);

  return (
    <div className="aprendizado-container">

      {/* ── HEADER ── */}
      <header className="page-header">
        <div className="header-left">
          <FiMenu className="menu-toggle" size={26} onClick={toggleMenu} />
          <h1 className="page-title">Aprendizado</h1>
        </div>
        <div className="user-profile">
          <span className="user-name">{user.name || 'Usuário'}</span>
          <div className="user-avatar"><FiUser /></div>
        </div>
      </header>

      {/* ── SEÇÕES POR NÍVEL ── */}
      <div className="aprendizado-body">
        {levels.map(level => {
          const contents = groupedContents[level];
          if (!contents || contents.length === 0) return null;

          return (
            <section className="level-section" key={level}>
              <h2 className="level-title">{level}</h2>

              <div className="cards-grid">
                {contents.map(content => (
                  <Link
                    to={`/aprendizado/${content.id}`}
                    className="conteudo-card"
                    key={content.id}
                  >
                    {/* Imagem ou placeholder cinza */}
                    {content.image_url ? (
                      <img
                        src={content.image_url}
                        alt={content.title}
                        className="card-image"
                      />
                    ) : (
                      <div className="card-image-placeholder">
                        <FiImage size={28} />
                      </div>
                    )}

                    {/* Linha divisória + título */}
                    <div className="card-info">
                      <h3 className="card-title">{content.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

    </div>
  );
};

export default Aprendizado;