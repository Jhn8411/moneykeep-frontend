import React, { useState, useEffect } from 'react';
import { 
  FiDollarSign, FiTrendingUp, FiTrendingDown, FiUser,
  FiCheckCircle, FiAlertCircle, FiXCircle // Ícones para as recomendações
} from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import './Dashboard.css';

const PIE_COLORS = ['#66BB6A', '#1F4842', '#BCF39B', '#FFC750', '#EF5350', '#8884d8'];

const Dashboard = () => {
  const [summary, setSummary] = useState({ totalBalance: 0, monthIncome: 0, monthExpense: 0 });
  const [annualData, setAnnualData] = useState([]);
  const [expensesByCategory, setExpensesByCategory] = useState([]);
  
  // 1. NOVOS ESTADOS: Transações e Recomendações
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('@MoneyKeep:user') || '{}');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 2. Adicionamos as novas rotas ao Promise.all
        const [summaryRes, annualRes, categoryRes, transRes, recRes] = await Promise.all([
          api.get('/dashboard/summary'),
          api.get('/dashboard/annual-overview'),
          api.get('/dashboard/expenses-by-category'),
          api.get('/transactions'), // Traz todas as transações
          api.get('/recommendations') // Traz a inteligência do sistema
        ]);

        setSummary(summaryRes.data);
        setAnnualData(annualRes.data);
        setExpensesByCategory(categoryRes.data);
        
        // Vamos guardar apenas as 5 transações mais recentes para não poluir o Dashboard
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
    return <h2>A carregar o seu painel financeiro...</h2>;
  }

  const currentYear = new Date().getFullYear();

  // Função auxiliar para formatar a data (ex: 2026-07-02 -> 02/07/2026)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  // Função para renderizar o ícone correto baseado no tipo de alerta
  const renderRecommendationIcon = (type) => {
    switch (type) {
      case 'success': return <div className="suggestion-icon icon-success"><FiCheckCircle /></div>;
      case 'warning': return <div className="suggestion-icon icon-warning"><FiAlertCircle /></div>;
      case 'danger': return <div className="suggestion-icon icon-danger"><FiXCircle /></div>;
      default: return null;
    }
  };

  return (
    <div className="dashboard-container">
      
      {/* --- CABEÇALHO --- */}
      <header className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <div className="user-profile">
          <span>{user.name || 'Utilizador'}</span>
          <div className="user-avatar"><FiUser /></div>
        </div>
      </header>

      {/* --- CARDS DE RESUMO --- */}
      <section className="summary-cards">
        <div className="card main">
          <div className="card-header"><FiDollarSign size={24} /><span>Saldo Atual</span></div>
          <div className="card-value">{formatCurrency(summary.totalBalance)}</div>
        </div>
        <div className="card">
          <div className="card-header"><FiTrendingUp size={24} style={{ color: 'var(--color-success)' }} /><span>Ganhos</span></div>
          <div className="card-value">{formatCurrency(summary.monthIncome)}</div>
        </div>
        <div className="card">
          <div className="card-header"><FiTrendingDown size={24} style={{ color: 'var(--color-danger)' }} /><span>Despesas</span></div>
          <div className="card-value">{formatCurrency(summary.monthExpense)}</div>
        </div>
      </section>

      {/* --- GRÁFICOS --- */}
      <section className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Visão Anual</h2>
            <span className="chart-subtitle">{currentYear}</span>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={annualData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} axisLine={false} tickLine={false} tickFormatter={(value) => `R$${value/1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="income" name="Ganhos" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="expense" name="Despesas" fill="var(--color-secondary)" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Divisão de Despesas</h2>
          </div>
          <div style={{ width: '100%', height: 180, display: 'flex', justifyContent: 'center' }}>
            {expensesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expensesByCategory} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="amount" stroke="none">
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p style={{ alignSelf: 'center', color: '#6B7280' }}>Sem despesas este mês.</p>
            )}
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
      </section>

      {/* --- NOVA SEÇÃO: TABELA E SUGESTÕES --- */}
      <section className="bottom-section">
        
        {/* Bloco 1: Transações Recentes */}
        <div className="chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Transações Recentes</h2>
          </div>
          
          {recentTransactions.length > 0 ? (
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
                {recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.category_name || (transaction.type === 'income' ? 'Ganho' : 'Despesa')}</td>
                    <td>{formatDate(transaction.transaction_date)}</td>
                    <td>{transaction.description}</td>
                    <td className={transaction.type === 'income' ? 'transaction-income' : 'transaction-expense'}>
                      {transaction.type === 'income' ? '+ ' : '- '}
                      {formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: '#6B7280', marginTop: '16px' }}>Nenhuma transação registada.</p>
          )}
        </div>

        {/* Bloco 2: Sugestões Rápidas */}
        <div className="chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Sugestões Rápidas</h2>
          </div>
          
          <div className="suggestions-list">
            {recommendations.length > 0 ? (
              recommendations.map((rec, index) => (
                <div className="suggestion-card" key={index}>
                  {renderRecommendationIcon(rec.type)}
                  <span className="suggestion-text">{rec.message}</span>
                </div>
              ))
            ) : (
              <p style={{ color: '#6B7280' }}>Tudo tranquilo por agora!</p>
            )}
          </div>
        </div>

      </section>

    </div>
  );
};

export default Dashboard;