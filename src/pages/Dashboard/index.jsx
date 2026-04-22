import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiMenu, FiUser } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import './Dashboard.css';

// ✅ Ícones como imagem — funciona em qualquer projeto (CRA, Vite, etc.)
import iconSaldo         from '../../assets/saldo.svg';
import iconGanhos        from '../../assets/ganhos.svg';
import iconDespesas      from '../../assets/despesas.svg';
import iconAvisoVerde    from '../../assets/aviso-verde.svg';
import iconAvisoAmarelo  from '../../assets/aviso-amarelo.svg';
import iconAvisoVermelho from '../../assets/aviso-vermelho.svg';

const PIE_COLORS = ['#66BB6A', '#1F4842', '#BCF39B', '#FFC750', '#EF5350', '#8884d8'];

const Dashboard = () => {
  const [summary, setSummary]                       = useState({ totalBalance: 0, monthIncome: 0, monthExpense: 0 });
  const [annualData, setAnnualData]                 = useState([]);
  const [expensesByCategory, setExpensesByCategory] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recommendations, setRecommendations]       = useState([]);
  const [loading, setLoading]                       = useState(true);

  const { toggleMenu } = useOutletContext();
  const user = JSON.parse(localStorage.getItem('@MoneyKeep:user') || '{}');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, annualRes, categoryRes, transRes, recRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/annual-overview'),
          api.get('/dashboard/expenses-by-category'),
          api.get('/transactions'),
          api.get('/recommendations'),
        ]);
        setSummary(summaryRes.data);
        setAnnualData(annualRes.data);
        setExpensesByCategory(categoryRes.data);
        setRecentTransactions(transRes.data.slice(0, 5));
        setRecommendations(recRes.data);
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <h2 style={{ padding: '32px', color: 'var(--color-primary)' }}>A carregar o seu painel financeiro...</h2>;
  }

  const currentYear = new Date().getFullYear();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  const renderRecommendationIcon = (type) => {
    const iconMap = {
      success: iconAvisoVerde,
      warning: iconAvisoAmarelo,
      danger:  iconAvisoVermelho,
    };
    const src = iconMap[type] || iconAvisoAmarelo;
    const cssClass = type === 'success' ? 'icon-success' : type === 'danger' ? 'icon-danger' : 'icon-warning';
    return (
      <div className={`suggestion-icon ${cssClass}`}>
        <img src={src} alt={type} width={18} height={18} />
      </div>
    );
  };

  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <header className="page-header">
        <div className="header-left">
          <FiMenu className="menu-toggle" size={28} onClick={toggleMenu} />
          <h1 className="page-title">Dashboard</h1>
        </div>
        <div className="user-profile">
          <span className="user-name">{user.name || 'Usuário'}</span>
          <div className="user-avatar"><FiUser /></div>
        </div>
      </header>

      {/* CONTEÚDO */}
      <div className="grupo-total" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* LINHA SUPERIOR */}
        <div className="dashboard-top-row">
          <div className="left-panel">

            {/* Cards de resumo */}
            <section className="summary-cards area-cards">
              <div className="card main">
                <div className="card-header">
                  <img src={iconSaldo} alt="Saldo" width={20} height={20} style={{ flexShrink: 0 }} />
                  <span>Saldo Atual</span>
                </div>
                <div className="card-value">{formatCurrency(summary.totalBalance)}</div>
              </div>

              <div className="card">
                <div className="card-header">
                  <img src={iconGanhos} alt="Ganhos" width={20} height={20} style={{ flexShrink: 0 }} />
                  <span>Ganhos</span>
                </div>
                <div className="card-value">{formatCurrency(summary.monthIncome)}</div>
              </div>

              <div className="card">
                <div className="card-header">
                  <img src={iconDespesas} alt="Despesas" width={20} height={20} style={{ flexShrink: 0 }} />
                  <span>Despesas</span>
                </div>
                <div className="card-value">{formatCurrency(summary.monthExpense)}</div>
              </div>
            </section>

            {/* Gráfico de barras */}
            <div className="chart-card area-bar">
              <div className="chart-header">
                <h2 className="chart-title">Visão Anual</h2>
                <span className="chart-subtitle">{currentYear}</span>
              </div>
              <div className="scroll-wrapper">
                <div className="scroll-inner-chart">
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={annualData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v / 1000}k`} />
                      <Tooltip formatter={(v) => formatCurrency(v)} cursor={{ fill: 'rgba(31,72,66,0.04)' }} contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13 }} />
                      <Bar dataKey="income"  name="Ganhos"   fill="var(--color-primary)" radius={[4,4,0,0]} barSize={12} />
                      <Bar dataKey="expense" name="Despesas" fill="#BCF39B"               radius={[4,4,0,0]} barSize={12} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* Pizza */}
          <div className="right-panel">
            <div className="chart-card area-pie" style={{ height: '100%' }}>
              <div className="chart-header">
                <h2 className="chart-title">Divisão de Despesas</h2>
              </div>
              {expensesByCategory.length > 0 ? (
                <div className="pie-body">
                  <div className="pie-chart-container" style={{ width: '100%', height: 220, position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 10, pointerEvents: 'none' }}>
                      <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: 500 }}>Gastos totais</div>
                      <div style={{ fontSize: '14px', color: 'var(--color-primary)', fontWeight: 700 }}>{formatCurrency(summary.monthExpense)}</div>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={expensesByCategory} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={2} dataKey="amount" stroke="none">
                          {expensesByCategory.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 13 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="custom-legend">
                    {expensesByCategory.map((expense, index) => (
                      <div className="legend-item" key={index}>
                        <div className="legend-label-group">
                          <div className="legend-percentage" style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}>{expense.percentage}%</div>
                          <span className="legend-name">{expense.category}</span>
                        </div>
                        <span className="legend-value">{formatCurrency(expense.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="empty-state">Sem despesas este mês.</div>
              )}
            </div>
          </div>
        </div>

        {/* LINHA INFERIOR */}
        <div className="dashboard-bottom-row">

          {/* Tabela */}
          <div className="table-card area-table" style={{ height: '100%' }}>
            <div className="chart-header">
              <h2 className="chart-title">Transações Recentes</h2>
            </div>
            {recentTransactions.length > 0 ? (
              <div className="scroll-wrapper">
                <div className="scroll-inner-table">
                  <table className="table-container">
                    <thead>
                      <tr>
                        <th>Tipo da transação</th>
                        <th>Data</th>
                        <th>Descrição</th>
                        <th>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((t) => (
                        <tr key={t.id}>
                          <td>{t.category_name || (t.type === 'income' ? 'Ganho' : 'Despesa')}</td>
                          <td>{formatDate(t.transaction_date)}</td>
                          <td>{t.description}</td>
                          <td className={t.type === 'income' ? 'transaction-income' : 'transaction-expense'}>
                            {t.type === 'income' ? '+ ' : '− '}{formatCurrency(t.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="empty-state">Nenhuma transação registada.</div>
            )}
          </div>

          {/* Sugestões */}
          <div className="suggestions-card area-suggestions" style={{ height: '100%' }}>
            <div className="chart-header">
              <h2 className="chart-title">Sugestões Rápidas</h2>
            </div>
            {recommendations.length > 0 ? (
              <div className="suggestions-list">
                {recommendations.map((rec, index) => (
                  <div className="suggestion-card" key={index}>
                    {renderRecommendationIcon(rec.type)}
                    <span className="suggestion-text">{rec.message}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">Tudo tranquilo por agora!</div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;