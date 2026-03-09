import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiPieChart, FiLayers, FiMessageCircle, FiBook, FiSettings } from 'react-icons/fi'; // Ícones modernos
import { MdShowChart } from 'react-icons/md'; // Ícone para simular o seu logo
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Remove a "pulseira VIP"
    localStorage.removeItem('@MoneyKeep:token');
    localStorage.removeItem('@MoneyKeep:user');
    
    // 2. Manda de volta para o Login
    navigate('/');
  };

  return (
    <aside className="sidebar-container">
      
      <div className="sidebar-logo">
        <MdShowChart size={32} />
        <span>MoneyKeep</span>
      </div>

      <nav className="sidebar-nav">
        {/* O NavLink adiciona a classe "active" na URL correspondente sozinha! */}
        <NavLink to="/dashboard" className="nav-item">
          <FiPieChart size={24} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/transacoes" className="nav-item">
          <FiLayers size={24} />
          <span>Transações</span>
        </NavLink>

        <NavLink to="/recomendacoes" className="nav-item">
          <FiMessageCircle size={24} />
          <span>Recomendações</span>
        </NavLink>

        <NavLink to="/aprendizado" className="nav-item">
          <FiBook size={24} />
          <span>Aprendizado</span>
        </NavLink>

        <NavLink to="/configuracoes" className="nav-item">
          <FiSettings size={24} />
          <span>Configurações</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="btn-logout">Sair</button>
      </div>
      
    </aside>
  );
};

export default Sidebar;