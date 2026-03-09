import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar';
import './MainLayout.css';

const MainLayout = () => {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="layout-content">
        {/* O <Outlet /> é a magia do React Router. 
            É exatamente neste "buraco" que ele vai injetar a tela de Dashboard, Transações, etc. */}
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;