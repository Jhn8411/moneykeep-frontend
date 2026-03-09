import React, { useState, useEffect } from 'react';
import { FiBell } from 'react-icons/fi';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';
import './Transacoes.css';

const Transacoes = () => {
  // --- Estados do Formulário ---
  const [type, setType] = useState('expense'); // Começa como despesa por defeito
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');

  // --- Estados dos Dados da API ---
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState({ totalBalance: 0, monthIncome: 0, monthExpense: 0 });
  const [loading, setLoading] = useState(true);

  // Carrega as categorias e o resumo ao abrir a página
  const fetchData = async () => {
    try {
      const [catRes, sumRes] = await Promise.all([
        api.get('/categories'),
        api.get('/dashboard/summary')
      ]);
      setCategories(catRes.data);
      setSummary(sumRes.data);
      
      // Define a primeira categoria por defeito, se existir
      if (catRes.data.length > 0) {
        setCategoryId(catRes.data[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Função para Enviar a Nova Transação ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação: categoryId só é obrigatório se o tipo for 'expense' (Despesa)
    if (!amount || !date || (type === 'expense' && !categoryId)) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await api.post('/transactions', {
        type,
        amount: parseFloat(amount),
        transaction_date: date,
        // Se for receita (ganho), enviamos null para a base de dados
        category_id: type === 'expense' ? categoryId : null, 
        description
      });

      alert('Transação adicionada com sucesso!');
      
      // Limpa os campos após o sucesso
      setAmount('');
      setDescription('');
      
      // Atualiza o resumo lateral chamando a API novamente
      fetchData();

    } catch (error) {
      console.error('Erro ao criar transação:', error);
      alert('Ocorreu um erro ao guardar a transação.');
    }
  };

  if (loading) return <h2>A carregar...</h2>;

  return (
    <div className="transacoes-container">
      
      <header className="page-header">
        <h1 className="page-title">Transações</h1>
      </header>

      <div className="transacoes-grid">
        
        {/* --- Lado Esquerdo: Formulário --- */}
        <div className="form-card">
          <div className="form-header">
            <h2>Nova Transação</h2>
            <p>Adicione um ganho ou despesa</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Seletor do Tipo (Despesa / Ganho) */}
            <div className="type-toggle">
              <button 
                type="button" 
                className={`toggle-btn ${type === 'expense' ? 'active-expense' : ''}`}
                onClick={() => setType('expense')}
              >
                Despesa
              </button>
              <button 
                type="button" 
                className={`toggle-btn ${type === 'income' ? 'active-income' : ''}`}
                onClick={() => setType('income')}
              >
                Ganho
              </button>
            </div>

            <div className="input-group">
              <label>Valor da {type === 'expense' ? 'Despesa' : 'Receita'}</label>
              <input 
                type="number" 
                step="0.01" 
                placeholder="Ex: 150.50" 
                className="input-amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required 
              />
            </div>

            <div className="form-row">
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Data</label>
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required 
                />
              </div>

              {/* Campo de Categoria Atualizado */}
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label>Categoria</label>
                <select 
                  value={type === 'income' ? '' : categoryId} 
                  onChange={(e) => setCategoryId(e.target.value)}
                  required={type === 'expense'} // Só é obrigatório se for despesa
                  disabled={type === 'income'}  // Fica desativado se for ganho
                >
                  {/* Se for ganho, mostra uma mensagem padrão no select */}
                  {type === 'income' ? (
                    <option value="">Não se aplica a ganhos</option>
                  ) : (
                    categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Descrição</label>
              <input 
                type="text" 
                placeholder="Ex: Lanche da tarde no trabalho" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary btn-submit">
              Adicionar Transação
            </button>
          </form>
        </div>

        {/* --- Lado Direito: Resumo --- */}
        <div className="summary-side-card">
          <h3>Resumo</h3>
          
          <div className="summary-block">
            <span>Saldo atual</span>
            <strong>{formatCurrency(summary.totalBalance)}</strong>
          </div>

          <div className="summary-block">
            <span>Ganhos do mês</span>
            <strong className="income-value">{formatCurrency(summary.monthIncome)}</strong>
          </div>

          <div className="summary-block">
            <span>Despesas do mês</span>
            <strong className="expense-value">{formatCurrency(summary.monthExpense)}</strong>
          </div>
        </div>
      </div>

      {/* --- Secção Inferior: Lembrete --- */}
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '18px', color: 'var(--color-primary)', marginBottom: '12px' }}>Lembrete</h3>
        <div className="reminder-card">
          <div className="suggestion-icon icon-success" style={{ minWidth: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiBell size={20} />
          </div>
          <span style={{ fontWeight: '500', color: 'var(--color-primary)' }}>
            Mantenha o hábito de registar as suas transações diariamente para ter um controlo financeiro mais preciso!
          </span>
        </div>
      </div>

    </div>
  );
};

export default Transacoes;