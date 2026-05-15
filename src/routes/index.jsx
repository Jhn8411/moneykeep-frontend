import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importação dos Layouts e Telas Reais
import MainLayout    from '../components/MainLayout';
import Login         from '../pages/Login';
import Dashboard     from '../pages/Dashboard';
import Transacoes    from '../pages/Transacoes';
import Recorrentes   from '../pages/Recorrentes'; // ← NOVO
import Recomendacoes from '../pages/Recomendacoes';
import Aprendizado   from '../pages/Aprendizado';
import Artigo        from '../pages/Aprendizado/Artigo';
import Configuracoes from '../pages/Configuracoes';
import Cadastro      from '../pages/Cadastro';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/"         element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* Rotas Privadas (com Sidebar) */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard"     element={<Dashboard />} />
          <Route path="/transacoes"    element={<Transacoes />} />
          <Route path="/recorrentes"   element={<Recorrentes />} /> {/* ← NOVO */}
          <Route path="/recomendacoes" element={<Recomendacoes />} />
          <Route path="/aprendizado"   element={<Aprendizado />} />
          <Route path="/aprendizado/:id" element={<Artigo />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
