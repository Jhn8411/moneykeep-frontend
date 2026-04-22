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
        <NavItem to="/dashboard"      label="Dashboard"      iconGreen={iconDashboardGreen}     iconWhite={iconDashboardWhite}     onClick={closeMenu} />
        <NavItem to="/transacoes"     label="Transações"     iconGreen={iconTransacoesGreen}    iconWhite={iconTransacoesWhite}    onClick={closeMenu} />
        <NavItem to="/recomendacoes"  label="Recomendações"  iconGreen={iconRecomendacoesGreen} iconWhite={iconRecomendacoesWhite} onClick={closeMenu} />
        <NavItem to="/aprendizado"    label="Aprendizado"    iconGreen={iconAprendizadoGreen}   iconWhite={iconAprendizadoWhite}   onClick={closeMenu} />
        <NavItem to="/configuracoes"  label="Configurações"  iconGreen={iconGearGreen}          iconWhite={iconGearWhite}          onClick={closeMenu} />
      </nav>

      <div className="sidebar-footer">
        <button className="btn-logout" onClick={handleLogout}>Sair</button>
      </div>

    </aside>
  );
};

export default Sidebar;