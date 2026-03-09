import React, { useState } from 'react';
import { FiUser, FiLock, FiGlobe } from 'react-icons/fi';
import './Configuracoes.css';

const Configuracoes = () => {
  // Pega os dados do usuário que guardamos no momento do login
  const user = JSON.parse(localStorage.getItem('@MoneyKeep:user') || '{}');

  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // No TCC, você pode apenas mostrar um alerta fingindo que salvou, 
    // ou futuramente criar uma rota PUT /users no backend para atualizar de verdade.
    alert('Perfil atualizado com sucesso! (Simulação)');
  };

  const handleDeleteAccount = () => {
    const confirm = window.confirm("Tem certeza absoluta? Todos os seus dados financeiros serão perdidos para sempre.");
    if (confirm) {
      alert("Para o escopo deste TCC, a exclusão foi simulada.");
    }
  };

  return (
    <div className="config-container">
      
      <header className="page-header">
        <h1 className="page-title">Configurações</h1>
        <p style={{ color: '#6B7280', marginTop: '4px' }}>
          Gerencie os detalhes da sua conta e preferências do sistema.
        </p>
      </header>

      {/* --- Seção 1: Perfil --- */}
      <section className="config-section">
        <h2><FiUser style={{ marginRight: '8px' }} /> Perfil do Usuário</h2>
        
        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="input-group">
            <label>Nome Completo</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>E-mail de Acesso</label>
            <input 
              type="email" 
              value={email}
              disabled // E-mail geralmente não muda facilmente
              style={{ backgroundColor: '#F3F4F6', color: '#9CA3AF' }}
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: 'fit-content', padding: '0 32px' }}>
            Salvar Alterações
          </button>
        </form>
      </section>

      {/* --- Seção 2: Preferências --- */}
      <section className="config-section">
        <h2><FiGlobe style={{ marginRight: '8px' }} /> Preferências do Sistema</h2>
        
        <div className="config-row">
          <div className="input-group">
            <label>Moeda Padrão</label>
            <select disabled>
              <option value="BRL">Real Brasileiro (R$)</option>
              <option value="USD">Dólar Americano ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>

          <div className="input-group">
            <label>Idioma</label>
            <select disabled>
              <option value="PT">Português (Brasil)</option>
              <option value="EN">English</option>
            </select>
          </div>
        </div>
        <p style={{ fontSize: '12px', color: '#6B7280' }}>* Opções fixas na versão atual do sistema.</p>
      </section>

      {/* --- Seção 3: Zona de Perigo --- */}
      <section className="config-section danger-zone">
        <h2><FiLock style={{ marginRight: '8px' }} /> Zona de Perigo</h2>
        <p className="danger-text">
          Ao excluir a sua conta, você perderá o acesso definitivo ao MoneyKeep e todo o seu histórico de transações será apagado dos nossos servidores. Esta ação não pode ser desfeita.
        </p>
        <button type="button" className="btn-danger" onClick={handleDeleteAccount}>
          Excluir Minha Conta
        </button>
      </section>

    </div>
  );
};

export default Configuracoes;