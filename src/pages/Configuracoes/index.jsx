import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';
import { FiUser, FiLock, FiGlobe, FiMenu } from 'react-icons/fi';
import { FiUser as FiUserAvatar } from 'react-icons/fi';
import api from '../../services/api';
import './Configuracoes.css';

const Configuracoes = () => {
  const navigate   = useNavigate();
  const { toggleMenu } = useOutletContext();

  const user  = JSON.parse(localStorage.getItem('@MoneyKeep:user') || '{}');
  const token = localStorage.getItem('@MoneyKeep:token');

  const [name, setName]   = useState(user.name  || '');
  const [email, setEmail] = useState(user.email || '');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(
        '/users',
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedUser = { ...user, name: response.data.name };
      localStorage.setItem('@MoneyKeep:user', JSON.stringify(updatedUser));
      alert('Perfil atualizado com sucesso!');
      window.location.reload();
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Ocorreu um erro ao atualizar o seu perfil.');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Tem certeza absoluta? Todos os seus dados financeiros serão perdidos para sempre.'
    );
    if (!confirmed) return;

    try {
      await api.delete('/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem('@MoneyKeep:token');
      localStorage.removeItem('@MoneyKeep:user');
      alert('Sua conta foi excluída com sucesso. Sentiremos sua falta!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      alert('Ocorreu um erro ao excluir sua conta.');
    }
  };

  return (
    <div className="config-container">

      {/* ── HEADER ── */}
      <header className="page-header">
        <div className="header-left">
          <FiMenu className="menu-toggle" size={26} onClick={toggleMenu} />
          <h1 className="page-title">Configurações</h1>
        </div>
        <div className="user-profile">
          <span className="user-name">{user.name || 'Usuário'}</span>
          <div className="user-avatar"><FiUserAvatar /></div>
        </div>
      </header>

      <div className="config-body">

        {/* ── Seção 1: Perfil ── */}
        <section className="config-section">
          <h2><FiUser size={18} /> Perfil do Usuário</h2>

          <div className="config-section-body">
            <form onSubmit={handleSaveProfile} style={{ display: 'contents' }}>

              <div className="input-group">
                <label>Nome Completo</label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label>E-mail de Acesso</label>
                <input
                  type="email"
                  placeholder="Seu E-mail"
                  value={email}
                  disabled
                />
              </div>

              <div className="config-footer">
                <button type="submit" className="btn-primary">
                  Salvar Alterações
                </button>
              </div>

            </form>
          </div>
        </section>

        {/* ── Seção 2: Preferências ── */}
        <section className="config-section">
          <h2><FiGlobe size={18} /> Preferencias do Sistema</h2>

          <div className="config-section-body">

            <div className="config-row">
              <div className="input-group">
                <label>Moeda Padrão</label>
                <input type="text" value="Real Brasileiro (R$)" disabled />
              </div>

              <div className="input-group">
                <label>Idioma</label>
                <input type="text" value="Português (Brasil)" disabled />
              </div>
            </div>

            <div className="config-footer">
              <p className="config-note">*Opções fixas na versão atual do sistema</p>
              <button type="button" className="btn-primary" disabled style={{ opacity: 0.45, cursor: 'not-allowed' }}>
                Salvar Alterações
              </button>
            </div>

          </div>
        </section>

        {/* ── Seção 3: Zona de Perigo ── */}
        <section className="config-section danger-zone">
          <h2><FiLock size={18} /> Zona de Perigo</h2>

          <div className="config-section-body">
            <p className="danger-text">
              Ao excluir a sua conta, voce perderá o acesso definitivo ao MoneyKeep e todo o seu historio de transações será apagado dos nossos servidores. Esta ação não pode ser desfeita
            </p>

            <div className="config-footer">
              <button type="button" className="btn-danger" onClick={handleDeleteAccount}>
                Excluir Minha Conta
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Configuracoes;