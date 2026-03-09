import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importação dos Layouts e Telas Reais
import MainLayout from '../components/MainLayout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Transacoes from '../pages/Transacoes';
import Recomendacoes from '../pages/Recomendacoes';
import Aprendizado from '../pages/Aprendizado';
import Artigo from '../pages/Aprendizado/Artigo';
import Configuracoes from '../pages/Configuracoes';
import Cadastro from '../pages/Cadastro';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública (Fora do Menu Lateral) */}
        <Route path="/" element={<Login />} />
        
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas Privadas (Envolvidas pelo MainLayout que contém a Sidebar) */}
        <Route element={<MainLayout />}>
          
          {/* A nossa tela real de Dashboard que acabamos de criar! */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* As telas que ainda vamos construir */}
          <Route path="/transacoes" element={<Transacoes />} />
          <Route path="/recomendacoes" element={<Recomendacoes />} />
          <Route path="/aprendizado" element={<Aprendizado />} />
          <Route path="/aprendizado/:id" element={<Artigo />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}