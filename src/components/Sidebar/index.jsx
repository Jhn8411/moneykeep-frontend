import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/Logo.svg';

// Ícones em duas versões: verde (inativo) e branco (ativo)
import iconDashboardGreen     from '../../assets/chart-pie-green.svg';
import iconDashboardWhite     from '../../assets/chart-pie-white.svg';
import iconTransacoesGreen    from '../../assets/coins-green.svg';
import iconTransacoesWhite    from '../../assets/coins-white.svg';
import iconRecomendacoesGreen from '../../assets/comment-dollar.svg';
import iconRecomendacoesWhite from '../../assets/comment-dollar-white.svg';
import iconAprendizadoGreen   from '../../assets/user-graduate-green.svg';
import iconAprendizadoWhite   from '../../assets/user-graduate-white.svg';
import iconGearGreen          from '../../assets/gear-green.svg';
import iconGearWhite          from '../../assets/gear-white.svg';

import './Sidebar.css';

// Componente de item de nav com troca de ícone baseada no estado ativo
const NavItem = ({ to, label, iconGreen, iconWhite, onClick }) => (
  <NavLink to={to} className="nav-item" onClick={onClick}>
    {({ isActive }) => (
      <>
        <img src={isActive ? iconWhite : iconGreen} alt="" width={20} height={20} />
        {label}
      </>
    )}
  </NavLink>
);

// Item especial que usa SVG inline (para Recorrentes, sem asset externo)
const NavItemSVG = ({ to, label, onClick }) => (
  <NavLink to={to} className="nav-item" onClick={onClick}>
    {({ isActive }) => (
      <>
        {/* Ícone de calendário recorrente — inline SVG */}
        <svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ flexShrink: 0 }}
        >
          <rect x="3" y="5" width="18" height="16" rx="3"
            stroke={isActive ? '#FFFFFF' : '#1F4842'} strokeWidth="2" />
          <path d="M3 10h18" stroke={isActive ? '#FFFFFF' : '#1F4842'} strokeWidth="2" />
          <path d="M8 3v4M16 3v4" stroke={isActive ? '#FFFFFF' : '#1F4842'}
            strokeWidth="2" strokeLinecap="round" />
          {/* Seta de repetição no canto */}
          <path d="M14.5 14.5 A2.5 2.5 0 1 1 12 17"
            stroke={isActive ? '#FFFFFF' : '#1F4842'} strokeWidth="1.6"
            strokeLinecap="round" fill="none" />
          <path d="M10.5 16.5l1.5.5-.5-1.5"
            stroke={isActive ? '#FFFFFF' : '#1F4842'} strokeWidth="1.4"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {label}
      </>
    )}
  </NavLink>
);

const Sidebar = ({ isOpen, closeMenu }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('@MoneyKeep:token');
    localStorage.removeItem('@MoneyKeep:user');
    navigate('/');
  };

  return (
    <aside className={`sidebar-container ${isOpen ? 'open' : ''}`}>

      <div className="sidebar-logo">
        <img src={logoImg} alt="MoneyKeep" style={{ width: '32px' }} />
        <span>MoneyKeep</span>
      </div>

      <nav className="sidebar-nav">
        <NavItem to="/dashboard"     label="Dashboard"     iconGreen={iconDashboardGreen}     iconWhite={iconDashboardWhite}     onClick={closeMenu} />
        <NavItem to="/transacoes"    label="Transações"    iconGreen={iconTransacoesGreen}    iconWhite={iconTransacoesWhite}    onClick={closeMenu} />
        <NavItemSVG to="/recorrentes" label="Recorrentes"  onClick={closeMenu} />  {/* ← NOVO */}
        <NavItem to="/recomendacoes" label="Recomendações" iconGreen={iconRecomendacoesGreen} iconWhite={iconRecomendacoesWhite} onClick={closeMenu} />
        <NavItem to="/aprendizado"   label="Aprendizado"   iconGreen={iconAprendizadoGreen}   iconWhite={iconAprendizadoWhite}   onClick={closeMenu} />
        <NavItem to="/configuracoes" label="Configurações" iconGreen={iconGearGreen}          iconWhite={iconGearWhite}          onClick={closeMenu} />
      </nav>

      <div className="sidebar-footer">
        <button className="btn-logout" onClick={handleLogout}>Sair</button>
      </div>

    </aside>
  );
};

export default Sidebar;
