import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar'; 
import './MainLayout.css'; 

const MainLayout = () => {
  // 1. Estado que controla se o menu mobile está aberto
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 2. Funções para abrir e fechar o menu
  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="main-layout-container">
      
      {/* 3. A película escura que fica por cima do conteúdo quando o menu abre */}
      <div 
        className={`sidebar-overlay ${isMobileMenuOpen ? 'active' : ''}`} 
        onClick={closeMenu}
      ></div>

      {/* 4. Passamos para o Sidebar se ele deve estar aberto e a função de fechar */}
      <Sidebar isOpen={isMobileMenuOpen} closeMenu={closeMenu} />

      <div className="layout-content">
        {/* 5. A MÁGICA: Passamos o toggleMenu para as páginas de dentro (como o Dashboard) poderem usar */}
        <Outlet context={{ toggleMenu }} />
      </div>

    </div>
  );
};

export default MainLayout;