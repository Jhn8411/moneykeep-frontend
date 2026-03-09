import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiImage } from 'react-icons/fi';
import api from '../../services/api';
import './Aprendizado.css';

const Artigo = () => {
  const { id } = useParams(); // Apanha o ID que está no URL
  const navigate = useNavigate(); // Ferramenta para voltar atrás
  
  const [artigo, setArtigo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArtigo = async () => {
      try {
        const response = await api.get(`/contents/${id}`);
        setArtigo(response.data);
      } catch (err) {
        console.error('Erro ao carregar artigo:', err);
        setError('Não foi possível carregar o conteúdo deste artigo.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtigo();
  }, [id]);

  if (loading) return <h2>A preparar a sua leitura...</h2>;
  if (error) return <h2>{error}</h2>;
  if (!artigo) return <h2>Artigo não encontrado.</h2>;

  return (
    <div className="artigo-container">
      {/* Botão de Voltar usando a navegação do React Router (-1 volta para a página anterior na história) */}
      <button className="btn-voltar" onClick={() => navigate(-1)}>
        <FiArrowLeft size={20} />
        Voltar para a lista
      </button>

      <div className="artigo-header">
        <span className="card-level-badge" style={{ marginBottom: '16px', display: 'inline-block' }}>
          {artigo.level}
        </span>
        <h1 className="artigo-title">{artigo.title}</h1>
      </div>

      {artigo.image_url && (
        <img src={artigo.image_url} alt={artigo.title} className="artigo-imagem" />
      )}

      {/* O CSS 'white-space: pre-wrap' garante que as quebras de linha que meteu na BD aparecem aqui */}
      <div className="artigo-corpo">
        {artigo.body_text}
      </div>
      
      {/* Espaço reservado para o futuro Quiz que você planejou! */}
      <div style={{ marginTop: '60px', padding: '20px', backgroundColor: 'var(--color-bg)', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--color-primary)' }}>Quiz Interativo em Breve!</h3>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>Teste os seus conhecimentos sobre este tópico.</p>
      </div>

    </div>
  );
};

export default Artigo;